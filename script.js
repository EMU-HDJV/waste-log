let data = [];

const scriptURL = "https://script.google.com/macros/s/AKfycbzJmIdB5hvmQr4JkYlSUYdkX3xE9FRzdE-T0txhnrECuZwKKZedAgoZbKHN6aF5yKkz/exec";

function addEntry() {
  const date = document.getElementById("date").value;
  const volume = document.getElementById("volume").value;
  const waste = document.getElementById("waste").value;

  if (!date || !volume || !waste) {
    alert("Please complete all fields");
    return;
  }

  // ONE OBJECT = ONE ROW
  const rowData = {
    date: date,
    volume: volume,
    waste: waste
  };

  data.push(rowData);

  const tbody = document.querySelector("#table tbody");
  const row = tbody.insertRow();
  row.insertCell(0).innerText = date;
  row.insertCell(1).innerText = volume;
  row.insertCell(2).innerText = waste;

  // Clear inputs after adding
  document.getElementById("date").value = "";
  document.getElementById("volume").value = "";
  document.getElementById("waste").value = "";
}

function exportExcel() {
  let csv = "Date,Volume,Waste Name\n";
  data.forEach(row => {
    csv += `${row.date},${row.volume},${row.waste}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "waste_log.csv";
  a.click();
}
