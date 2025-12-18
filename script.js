let data = [];

const scriptURL = "https://script.google.com/macros/s/AKfycbzZpJO0yqRe_YAbX-yOii34PK4yLCKq3Lv2lF1twDBzI-fGwUIuRkXzUCYSiXKxeF5w/exec";

async function addEntry() {
  const date = document.getElementById("date").value;
  const volume = document.getElementById("volume").value;
  const waste = document.getElementById("waste").value;
  const statusText = document.getElementById("status");

  // Basic Validation
  if (!date || !volume || !waste) {
    alert("Please complete all fields");
    return;
  }

  const rowData = {
    date: date,
    volume: volume,
    waste: waste
  };

  // 1. UI Feedback: Show "Sending..."
  statusText.innerText = "Syncing with Google Sheets...";
  statusText.style.color = "#1976d2";

  // 2. Send to Google Sheets
  fetch(scriptURL, {
    method: 'POST',
    mode: 'no-cors', 
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rowData)
  })
  .then(() => {
    statusText.innerText = "✅ Successfully saved to Cloud";
    statusText.style.color = "#2e7d32";
    // Clear message after 3 seconds
    setTimeout(() => { statusText.innerText = ""; }, 3000);
  })
  .catch(error => {
    statusText.innerText = "❌ Sync Error (Saved locally only)";
    statusText.style.color = "#d32f2f";
    console.error("Error!", error.message);
  });

  // 3. Update Local Table (Recent first)
  data.push(rowData);
  const tbody = document.querySelector("#table tbody");
  const row = tbody.insertRow(0); // Add to top for mobile view
  
  row.insertCell(0).innerText = date;
  row.insertCell(1).innerText = volume;
  row.insertCell(2).innerText = waste;

  // 4. Clear inputs after adding
  document.getElementById("date").value = "";
  document.getElementById("volume").value = "";
  document.getElementById("waste").value = "";
}

function exportExcel() {
  if (data.length === 0) {
    alert("No data to export yet!");
    return;
  }

  // Header row
  let csv = "Date,Volume (kg),Waste Name\n";
  
  // Data rows with quotes to protect commas in waste names
  data.forEach(row => {
    csv += `"${row.date}","${row.volume}","${row.waste}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.style.display = 'none';
  a.href = url;
  a.download = `hazardous_waste_log_${new Date().toISOString().slice(0,10)}.csv`;
  
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}



