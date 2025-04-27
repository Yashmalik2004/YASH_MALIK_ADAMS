# 🐾 ADAMS - Advanced Doctor Animal Management System

> **A comprehensive solution for veterinary medication management and animal healthcare records, designed to enhance clinic operations and ensure the health and safety of pets.**

---
## 📄 Project Documentation

[Click here to view the Project Report (PDF)](https://github.com/Yashmalik2004/Yash_malik_CSE1_ADAMS/blob/main/ADAMS.pdf)

---
## 🎥 Project Video

[Click here to view the Project Video](https://1drv.ms/v/c/1b29cb5322b45e96/EbfAsX5nfwBHiZJG7sSP2IEBRGOnfcP2vnzVNkbAhrxfpg?e=QFvLJp)

---

## 📚 **Project Overview**

**ADAMS** (Advanced Doctor Animal Management System) is a state-of-the-art platform that revolutionizes the management of veterinary clinic operations. It focuses on the following core features:

- **Medication Inventory Tracking:** Real-time monitoring of medication stock levels.
- **Expiration Date Monitoring:** Alerts and notifications for upcoming medication expiration dates.
- **Medical History Management:** Detailed tracking of animal medical records and treatment history.
- **Automated Notifications:** Timely reminders for low stock levels and expiring medications.
  
By integrating these functionalities, ADAMS ensures seamless workflow, reduces administrative overhead, and minimizes errors in medication management, empowering veterinary staff to make informed decisions.

---

## 🖼️ **Web Interface Preview**

Here’s a glimpse of the ADAMS web dashboard interface:

![Alt Text](https://github.com/Yashmalik2004/Yash_malik_CSE1_ADAMS/blob/main/Screenshot%202025-04-27%20220041.png)


---

## 🌟 **Key Features**

- 📦 **Real-Time Medication Inventory Management**  
   Automatically tracks medication stock and provides real-time updates.

- ⏰ **Expiration Date Alerts**  
   Automated notifications for medication that is approaching its expiration date.

- 🩺 **Comprehensive Animal Medical History Tracking**  
   Store and view detailed records of animal health and treatment history.

- 📧 **Automated Email Alerts**  
   Notifications for both low stock levels and medication expiration via email (SMTP integration).

- 🖥️ **Interactive Web Dashboard**  
   User-friendly web interface to manage inventory, appointments, and medical records.

- 📊 **Future Analytics**  
   Plans for adding operational analytics for better decision-making (e.g., medication usage trends).

---

## 🛠️ Technology Stack

- **Frontend**: 
  - **HTML** — Structure and layout of the web dashboard.
  - **CSS** — Styling and visual presentation of the web dashboard.
  - **JavaScript** — Interactive elements and client-side scripting for a dynamic user experience.
  
- **Backend**:
  - **Node.js** — Server-side logic and handling requests for the application.
  - **MySQL** — Relational database for storing animal medical records and medication inventory.
  
- **APIs**:
  - **Twilio API** — Sending SMS notifications for stock alerts, appointment reminders, and medication expiration notifications.
  - **SMTP** — Sending automated email notifications for medication expiry and low stock alerts.
  
- **Scheduling & Automation**:
  - **Cron Jobs** — Scheduling tasks like sending reminder emails and checking medication expiry dates.
  
- **Programming Concepts**:
  - **Object-Oriented Programming (OOP)** — A modular and scalable code structure for easy maintenance and future enhancements.
  
- **Version Control**:
  - **Git** — Source code management for version control and collaboration.

- **Security**:
  - **HTTPS** — Secure data transmission between the client and the server.


---

## 📈 **Planned Enhancements**

The following features are planned for future versions of the ADAMS system:

- 📱 **Mobile App Development** (Android/iOS)  
   Access ADAMS functionality on-the-go with mobile versions for veterinary professionals.

- 📊 **Real-Time Operational Analytics**  
   Enhance tracking with analytics to monitor medication usage trends and stock performance.

- 🔒 **User Role Management**  
   Role-based access control for different users (e.g., vets, staff, administrators).

- ☁️ **Cloud Deployment**  
   Future migration to cloud platforms (e.g., AWS, Azure) for global access and scalability.

- 🤖 **Predictive Analytics Using Machine Learning**  
   Use machine learning to predict medication needs based on historical usage patterns.

- 📡 **RFID Integration**  
   Implement RFID technology for tracking medication in real-time.

---

## 🧪 Experimental Setup

**Developed using:**

- **Frontend**: HTML, CSS, JavaScript (for web dashboard)
- **Backend**: Node.js (for handling backend logic)
- **Database**: MySQL (for storing animal and medication records)
- **APIs**: Twilio API (for sending SMS notifications), SMTP (for email alerts)
- **Scheduling**: Cron Jobs (for automated tasks like sending reminder emails and updating stock alerts)
- **Version Control**: Git (for source code versioning)

**Tested across:**

- Desktop, Tablet, and Mobile Devices
- Browsers: Chrome, Firefox, Edge

**Evaluation Tools:**

- **Postman** (for API testing)
- **Browser Developer Tools** (for debugging and performance optimization)
- **Lighthouse** (for performance and accessibility audits)
- **Jest** (for unit and integration testing in JavaScript)

**Deployment:**

- **Initial Deployment**: Local hosting (for initial testing and feedback)
- **Future Migration**: Planned cloud migration to AWS or Azure for better scalability and reliability

**Security and Backup Tools:**

- **Backup**: MySQL dump for periodic database backups
- **Security**: HTTPS for secure data transfer, Basic Authentication (for admin access)

**User Interaction:**

- **Twilio API** for SMS-based alerts and notifications to users regarding stock levels, appointments, and medication expirations
- **Cron Jobs** for scheduling routine tasks such as sending automated reminders for upcoming appointments and medication expiry dates


![Image Alt Text](https://github.com/Yashmalik2004/Yash_malik_CSE1_ADAMS/blob/main/Screenshot%202025-04-27%20220137.png)


---

## 📝 **Results**

- 95% accuracy in stock and expiration tracking.
- SUS Usability Score: 79.
- 4.5/5 rating for notification reliability.
- Workflow streamlined with a 60% reduction in manual tracking time.

---

## 📖 **References**

- Mahalle, C., Katre, H., & Chaube, A. (2021). Enhancing Animal Healthcare through Digital Record Keeping. *IJTSRD*.
- Triet, M. N., et al. (2024). Enhanced Security for Animal Health Records Using RSA-Encrypted NFTs. *Lecture Notes in Computer Science*.
- Molloy, T. (2023). Recent Technological Advancements in Veterinary Medicine. *VETport*.
- Brown, A. (2025). 8 Veterinary Technology Trends. *Harvard*.

---

## 🌐 **Live Project**

👉 [View our project site here!](https://yashmalik2004.github.io/Yash_malik_CSE1_ADAMS/)

---

## 🚀 Steps to Run/Execute the Project Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/Yashmalik2004/Yash_malik_CSE1_ADAMS.git
2. **Navigate to the project directory**
   ```bash
   cd Yash_malik_CSE1_ADAMS
3. **Install the required dependencies**
    ```bash
    npm install
    npm init -y
    npm install express sqlite3 body-parser cors
 4. **Set up the database**
    - Create a MySQL database for the project (e.g., adams_db).
    - Update the database connection credentials in the .env file with your local MySQL database configuration.
 5. **Run the development server**
    ```bash
    node server.js
6. **Access the Application**
    a. Open `index.html` in any code compiler and live run it.
---
![Image Alt Text](https://github.com/username/repository-name/raw/main/image.jpg)

## 🤝 **Team Credits**

- **Industry Mentor:** Dr. Lokkit Chaudhary
- **Faculty Mentor:** Dr. Saneh Lata Yadav
- **Developers:** Yash malik | Sneha Sharma | Ashmita | lavya kumar beriwal

---

## 📬 **Contact**

For any queries or collaborations, reach out to:  
📧 **lokkit@gmail.com** 
or **9116603111**

**For Project details**
  contact  **yashmalik4832004two@gmail.com**
 
---

# 🐾 **Thank you for visiting ADAMS!**
