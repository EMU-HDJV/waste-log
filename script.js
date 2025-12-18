let data = [];
const scriptURL = "https://script.google.com/macros/s/AKfycbxTzFIX6K7a5L_qopkrjTGTvKv1pV6_TonqnfbUFtG6pWdFR7dsyhn82g6H-vYrhsvx/exec";

async function addEntry() {
  const date = document.getElementById("date").value;
  const volume = document.getElementById("volume").value;
  const waste = document.getElementById("waste").value;

  if (!date || !volume || !waste) {
    alert("Please complete all fields");
    return;
  }

  const rowData = { date, volume, waste };

  // 1. SEND TO GOOGLE SHEETS
  // We use 'no-cors' because Google Apps Script doesn't return standard CORS headers
  fetch(scriptURL, {
    method: 'POST',
    mode: 'no-cors', 
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rowData)
  })
  .then(() => console.log("Data sent to Google Sheets"))
  .catch(err => console.error("Sync error:", err));

  // 2. UPDATE LOCAL TABLE
  data.push(rowData);
  const tbody = document.querySelector("#table tbody");
  const row = tbody.insertRow(0); // Using (0) puts the newest entry at the top
  row.insertCell(0).innerText = date;
  row.insertCell(1).innerText = volume;
  row.insertCell(2).innerText = waste;

  // 3. CLEAR INPUTS
  document.getElementById("date").value = "";
  document.getElementById("volume").value = "";
  document.getElementById("waste").value = "";
}

function exportExcel() {
  // Use quotes around values so that commas inside "Waste Name" don't break the CSV columns
  let csv = "Date,Volume,Waste Name\n";
  data.forEach(row => {
    csv += `"${row.date}","${row.volume}","${row.waste}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "waste_log.csv";
  document.body.appendChild(a); // Better browser compatibility
  a.click();
  document.body.removeChild(a);
}
