require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const moment = require('moment');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());


// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Yashu04@pass',
    database: 'ADAMS'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('✅ Connected to MySQL database');
    }
});

// Excel date conversion
function convertExcelDate(serial) {
    if (!serial) return null;
    return moment("1899-12-30").add(serial, 'days').format("YYYY-MM-DD");
}

// Route: Add Single Client
app.post("/add-client", (req, res) => {
    const { clientName, petName, petType, medicalHistory, height, weight, lastAppointment, upcomingAppointment } = req.body;

    const sql = `INSERT INTO clients (client_name, pet_name, pet_type, medical_history, height, weight, last_appointment, upcoming_appointment) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
        clientName, petName, petType, medicalHistory, height, weight,
        moment(lastAppointment).format("YYYY-MM-DD"),
        moment(upcomingAppointment).format("YYYY-MM-DD")
    ], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json({ message: "Client data added successfully!" });
    });
});

// Route: Upload Client Excel
app.post("/upload-excel", (req, res) => {
    const { clients } = req.body;

    if (!clients || clients.length === 0) {
        return res.status(400).json({ message: "No data received from Excel file" });
    }

    const sql = `INSERT INTO clients (client_name, pet_name, pet_type, medical_history, height, weight, last_appointment, upcoming_appointment) VALUES ?`;

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

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json({ message: `Uploaded ${result.affectedRows} client records successfully!` });
    });
});

// Route: Add Single Medicine
app.post('/add-medicine', (req, res) => {
    const { animalType, disease, medicineName, dosage, frequency, medicineCode, quantity, expiryDate } = req.body;

    if (!animalType || !disease || !medicineName || !dosage || !frequency || !medicineCode || !quantity || !expiryDate) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `INSERT INTO medicines (animal_type, disease, medicine_name, dosage, frequency, medicine_code, quantity, expiry_date) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [animalType, disease, medicineName, dosage, frequency, medicineCode, quantity, moment(expiryDate).format("YYYY-MM-DD")], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Medicine data inserted successfully' });
    });
});

// Route: Upload Medicine Excel
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

    const sql = `INSERT INTO medicines (animal_type, disease, medicine_name, dosage, frequency, medicine_code, quantity, expiry_date) VALUES ?`;

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json({ message: `Uploaded ${result.affectedRows} medicine records successfully!` });
    });
});

// Route: Check Upcoming Appointments & Low Medicine Stock
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

// CRON JOB - Daily at 8 AM
cron.schedule('* * * * *', () => {
    console.log("🔁 Running daily alert check at 8:00 AM");

    const axios = require('axios');
    axios.get('http://localhost:3000/check-alerts')
        .then(response => {
            const { upcomingAppointments, medicineAlerts } = response.data;

            if (upcomingAppointments.length === 0 && medicineAlerts.length === 0) {
                console.log("✅ No alerts for today.");
            } else {
                console.log("📩 Alerts found:");
                if (upcomingAppointments.length > 0) {
                    console.log("⚠️ Upcoming Appointments:");
                    upcomingAppointments.forEach(a => {
                        console.log(`- ${a.client_name} has an appointment on ${a.upcoming_appointment}`);
                    });
                }

                if (medicineAlerts.length > 0) {
                    console.log("⚠️ Low Stock Medicines:");
                    medicineAlerts.forEach(m => {
                        console.log(`- ${m.medicine_name} (for ${m.disease}) - Only ${m.quantity} left`);
                    });
                }

                const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

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

if (messageBody !== "") {
    client.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: process.env.TWILIO_WHATSAPP_TO,
        body: messageBody
    
    })
    .then(message => console.log("📤 WhatsApp alert sent:", message.sid))
    .catch(err => console.error("❌ Error sending WhatsApp:", err));
}

            }
        })
        .catch(err => {
            console.error("Error during scheduled alert check:", err.message);
        });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
