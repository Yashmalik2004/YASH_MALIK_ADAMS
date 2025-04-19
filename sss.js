document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("data-form")) {
    loadDataFromStorage();
    document
      .getElementById("data-form")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        addDataToTable();
        showGlitchEffect();
      });
  }

  if (document.getElementById("medicine-form")) {
    loadMedicineFromStorage();
    document
      .getElementById("medicine-form")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        addMedicineToTable();
        showGlitchEffect();
      });
  }

  document.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("focus", function () {
      this.classList.add("neon-glow");
    });
    input.addEventListener("blur", function () {
      this.classList.remove("neon-glow");
    });
  });

  startSciFiBackground();
});

function shut(){
  window.open('index.html','_self');
  window.close();
}
function showGlitchEffect() {
  document.body.classList.add("glitch-effect");
  setTimeout(() => {
    document.body.classList.remove("glitch-effect");
  }, 500);
}

function addDataToTable() {
  const formData = new FormData(document.getElementById("data-form"));
  const tableBody = document.querySelector("#data-table tbody");
  const newRow = document.createElement("tr");

  formData.forEach((value) => {
    const newCell = document.createElement("td");
    newCell.textContent = value;
    newCell.classList.add("neon-text");
    newRow.appendChild(newCell);
  });

  newRow.classList.add("table-row-glow");
  tableBody.appendChild(newRow);
  document.getElementById("data-form").reset();
}

function addMedicineToTable() {
  const formData = new FormData(document.getElementById("medicine-form"));
  const tableBody = document.querySelector("#medicine-table tbody");
  const newRow = document.createElement("tr");

  formData.forEach((value) => {
    const newCell = document.createElement("td");
    newCell.textContent = value;
    newCell.classList.add("neon-text");
    newRow.appendChild(newCell);
  });

  newRow.classList.add("table-row-glow");
  tableBody.appendChild(newRow);
  checkExpiryDate(formData.get("expiry-date"));
  document.getElementById("medicine-form").reset();
}

function handleExcelUpload() {
  const file = document.getElementById("excel-upload").files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      json.forEach((row) => {
        const tableBody = document.querySelector("#data-table tbody");
        const newRow = document.createElement("tr");
        Object.values(row).forEach((value) => {
          const newCell = document.createElement("td");
          newCell.textContent = value;
          newCell.classList.add("neon-text");
          newRow.appendChild(newCell);
        });
        newRow.classList.add("table-row-glow");
        tableBody.appendChild(newRow);
      });
    };
    reader.readAsArrayBuffer(file);
  }
}

function checkExpiryDate(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);

  if (expiry < today) {
    sendEmailNotification();
  }
}

function sendEmailNotification() {
  console.log("Sending email notification about expired medicine...");
  alert("🚀 Sci-Fi Alert: Expired medicine detected! Notification sent.");
}

function startSciFiBackground() {
  document.body.style.background =
    "linear-gradient(45deg, #020024, #090979, #00d4ff)";
  document.body.style.backgroundSize = "400% 400%";
  document.body.style.animation = "gradientShift 8s ease infinite";
}
document.getElementById('medicine-form').addEventListener('submit', function(event) {
  event.preventDefault();
  addMedicineToTable();
});

function addMedicineToTable() {
  const formData = new FormData(document.getElementById('medicine-form'));
  const tableBody = document.querySelector('#medicine-table tbody');
  const newRow = document.createElement('tr');

  formData.forEach(value => {
      const newCell = document.createElement('td');
      newCell.textContent = value;
      newRow.appendChild(newCell);
  });

  tableBody.appendChild(newRow);
  checkExpiryDate(formData.get('expiry-date'));
  document.getElementById('medicine-form').reset();
}

function handleMedicineExcelUpload() {
  const file = document.getElementById('medicine-excel-upload').files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);

          json.forEach(row => {
              const tableBody = document.querySelector('#medicine-table tbody');
              const newRow = document.createElement('tr');

             
              const keys = ['Animal Type', 'Disease', 'Medicine', 'Dosage', 'Frequency', 'Medicine Code', 'Quantity', 'Expiry Date'];

              keys.forEach(key => {
                  const newCell = document.createElement('td');
                  newCell.textContent = row[key] || ''; 
                  newRow.appendChild(newCell);
              });

              tableBody.appendChild(newRow);
          });
      };
      reader.readAsArrayBuffer(file);
  }
}

function checkExpiryDate(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);

  if (expiry < today) {
      sendEmailNotification();
  }
}

function sendEmailNotification() {
  console.log('Sending email notification about expired medicine...');
  alert('Email notification sent about expired medicine.');
}
