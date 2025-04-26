const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const moment = require('moment');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const axios = require('axios');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('❌ Error connecting to the database:', err);
        return;
    }
    console.log('✅ Connected to the MySQL database');
});

// Helper: Convert Excel serial date to YYYY-MM-DD
function convertExcelDate(serial) {
    if (!serial) return null;
    return moment("1899-12-30").add(serial, 'days').format("YYYY-MM-DD");
}

// ----------------- ROUTES -----------------

// Add Single Client
app.post("/add-client", (req, res) => {
    const { clientName, petName, petType, medicalHistory, height, weight, lastAppointment, upcomingAppointment } = req.body;

    if (!clientName || !petName || !petType || !medicalHistory || !height || !weight || !lastAppointment || !upcomingAppointment) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const sql = `
        INSERT INTO clients 
        (client_name, pet_name, pet_type, medical_history, height, weight, last_appointment, upcoming_appointment) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        clientName, petName, petType, medicalHistory, height, weight,
        moment(lastAppointment).format("YYYY-MM-DD"),
        moment(upcomingAppointment).format("YYYY-MM-DD")
    ], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json({ message: "Client appointment data added successfully!" });
    });
});

// Upload Clients from Excel
app.post("/upload-excel", (req, res) => {
    const { clients } = req.body;

    if (!clients || clients.length === 0) {
        return res.status(400).json({ message: "No data received from Excel file" });
    }

    const values = clients.map(client => [
        client["Client Name"],
        client["Pet Name"],
        client["Pet Type"],
        client["Medical History"],
        client["Height (cm)"],
        client["Weight (kg)"],
        convertExcelDate(client["Last Appointment"]),
        convertExcelDate(client["Upcoming Appointment"])
    ]);

    const sql = `
        INSERT INTO clients 
        (client_name, pet_name, pet_type, medical_history, height, weight, last_appointment, upcoming_appointment)
        VALUES ?
    `;

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json({ message: `Uploaded ${result.affectedRows} client records successfully!` });
    });
});

// Add Single Medicine
app.post("/add-medicine", (req, res) => {
    const { animalType, disease, medicineName, dosage, frequency, medicineCode, quantity, expiryDate } = req.body;

    if (!animalType || !disease || !medicineName || !dosage || !frequency || !medicineCode || !quantity || !expiryDate) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = `
        INSERT INTO medicines 
        (animal_type, disease, medicine_name, dosage, frequency, medicine_code, quantity, expiry_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
        animalType, disease, medicineName, dosage, frequency, medicineCode, quantity,
        moment(expiryDate).format("YYYY-MM-DD")
    ], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: "Medicine data inserted successfully" });
    });
});

// Upload Medicines from Excel
app.post("/upload-medicine-excel", (req, res) => {
    const medicines = req.body;

    if (!medicines || medicines.length === 0) {
        return res.status(400).json({ message: "No data received from Excel file" });
    }

    const values = medicines.map(medicine => [
        medicine["Animal Type"] || null,
        medicine["Disease"] || null,
        medicine["Medicine"] || null,
        medicine["Dosage"] || null,
        medicine["Frequency"] || null,
        medicine["Medicine Code"] || null,
        parseInt(medicine["Quantity"]) || 0,
        convertExcelDate(medicine["Expiry Date"]) || null
    ]);

    const sql = `
        INSERT INTO medicines 
        (animal_type, disease, medicine_name, dosage, frequency, medicine_code, quantity, expiry_date)
        VALUES ?
    `;

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json({ message: `Uploaded ${result.affectedRows} medicine records successfully!` });
    });
});

// Check Alerts (Upcoming Appointments + Low Stock Medicines)
app.get("/check-alerts", (req, res) => {
    const today = moment();
    const threeDaysLater = moment().add(3, 'days').format("YYYY-MM-DD");

    const appointmentQuery = `
        SELECT * FROM clients 
        WHERE upcoming_appointment BETWEEN CURDATE() AND ?
    `;

    db.query(appointmentQuery, [threeDaysLater], (err, appointments) => {
        if (err) {
            console.error("Error fetching appointments:", err);
            return res.status(500).json({ message: "Error checking appointments" });
        }

        const medicalIssues = appointments.map(app => app.medical_history);

        if (medicalIssues.length === 0) {
            return res.json({ upcomingAppointments: [], medicineAlerts: [] });
        }

        const medicineQuery = `
            SELECT * FROM medicines 
            WHERE disease IN (?) AND quantity < 2
        `;

        db.query(medicineQuery, [medicalIssues], (err, lowMedicines) => {
            if (err) {
                console.error("Error fetching medicine data:", err);
                return res.status(500).json({ message: "Error checking medicines" });
            }

            res.json({
                upcomingAppointments: appointments,
                medicineAlerts: lowMedicines
            });
        });
    });
});

// Send email to Vet
app.post('/send-mail', (req, res) => {
    const { userName, userEmail, userPhone, petName, petIssue } = req.body;

    if (!userName || !userEmail || !userPhone || !petName || !petIssue) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.VET_EMAIL,       // your vet's Gmail address
            pass: process.env.VET_EMAIL_PASS    // app password (not Gmail password)
        }
    });

    const mailOptions = {
        from: process.env.VET_EMAIL,
        to: process.env.VET_EMAIL,
        subject: `New Appointment Request from ${userName}`,
        html: `
            <h2>New Appointment Request</h2>
            <p><strong>Name:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Phone:</strong> ${userPhone}</p>
            <p><strong>Pet's Name:</strong> ${petName}</p>
            <p><strong>Pet's Issue:</strong> ${petIssue}</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("❌ Error sending email:", error);
            return res.status(500).json({ message: "Failed to send email" });
        }
        console.log("✅ Email sent:", info.response);
        return res.status(200).json({ message: "Email sent successfully!" });
    });
});

// Submit Appointment
app.post("/submit-appointment", (req, res) => {
    const { clientName, petName, petType, medicalHistory, height, weight, lastAppointment, upcomingAppointment } = req.body;

    if (!clientName || !petName || !petType || !medicalHistory || !height || !weight || !lastAppointment || !upcomingAppointment) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const sql = `
        INSERT INTO clients 
        (client_name, pet_name, pet_type, medical_history, height, weight, last_appointment, upcoming_appointment)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [clientName, petName, petType, medicalHistory, height, weight, lastAppointment, upcomingAppointment];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ message: "Error saving appointment" });
        }
        res.status(200).json({ message: "Appointment saved successfully!" });
    });
});



// GET ALL Clients
app.get("/get-clients", (req, res) => {
    const sql = `SELECT * FROM clients`;

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(result);
    });
});

// GET ALL Medicines
app.get("/get-medicines", (req, res) => {
    const sql = `SELECT * FROM medicines`;

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(result);
    });
});

// DELETE Client by ID
app.delete("/delete-client/:id", (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM clients WHERE id = ?`;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json({ message: "Client deleted successfully!" });
    });
});

// DELETE Medicine by ID
app.delete("/delete-medicine/:id", (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM medicines WHERE id = ?`;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json({ message: "Medicine deleted successfully!" });
    });
});
// ----------------- CRON JOB -----------------

// CRON JOB - Runs every day at 8 AM (fixed cron timing), but for testing purposes, it runs every minute
cron.schedule('* * * * *', () => {
    console.log("🔁 Running daily alert check");

    axios.get('http://localhost:3000/check-alerts')
        .then(response => {
            const { upcomingAppointments, medicineAlerts } = response.data;

            if (upcomingAppointments.length === 0 && medicineAlerts.length === 0) {
                console.log("✅ No alerts for today.");
                return;
            }

            let messageBody = "";

            if (upcomingAppointments.length > 0) {
                messageBody += "📅 *Upcoming Appointments:*\n";
                upcomingAppointments.forEach(a => {
                    messageBody += `• ${a.client_name} – ${a.pet_name} on ${moment(a.upcoming_appointment).format("DD MMM YYYY")}\n`;
                });
                messageBody += "\n";
            }

            if (medicineAlerts.length > 0) {
                messageBody += "💊 *Low Stock Medicines:*\n";
                medicineAlerts.forEach(m => {
                    messageBody += `• ${m.medicine_name} (for ${m.disease}) – Only ${m.quantity} left\n`;
                });
            }

            const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

            client.messages.create({
                from: process.env.TWILIO_WHATSAPP_FROM,
                to: process.env.TWILIO_WHATSAPP_TO,
                body: messageBody
            })
            .then(message => console.log("📤 WhatsApp alert sent:", message.sid))
            .catch(err => console.error("❌ Error sending WhatsApp:", err));
        })
        .catch(err => {
            console.error("Error during scheduled alert check:", err.message);
        });
});

// ----------------- START SERVER -----------------
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
