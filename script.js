const scriptURL = "https://script.google.com/macros/s/AKfycbzJmIdB5hvmQr4JkYlSUYdkX3xE9FRzdE-T0txhnrECuZwKKZedAgoZbKHN6aF5yKkz/exec";

function addEntry() {
  const date = document.getElementById("date").value;
  const volume = document.getElementById("volume").value;
  const waste = document.getElementById("waste").value;

  if (!date || !volume || !waste) {
    alert("Please complete all fields");
    return;
  }

  fetch(scriptURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      date: date,
      volume: volume,
      waste: waste
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.result === "success") {
      alert("Saved successfully");
    } else {
      alert("Error: " + data.message);
    }
  })
  .catch(err => alert("Request failed"));

  // Clear inputs
  document.getElementById("date").value = "";
  document.getElementById("volume").value = "";
  document.getElementById("waste").value = "";
}
