async function generateOutput() {
      const baseName = document.getElementById("baseName").value.trim() || "db";
      const rawNumbers = document.getElementById("numbers").value.trim().split(/\n+/);
      let output = ``;
      let counter = 1;
      let dataToSend = [];

      rawNumbers.forEach(num => {
        let phone = num.replace(/\D/g, "");
        if (phone) {
          if (phone.startsWith("62")) {
            phone = phone.substring(2);
          } else if (phone.startsWith("0")) {
            phone = phone.substring(1);
          }
          phone = "+62" + phone;
          const nama = `${baseName.toUpperCase()}${counter}`;
          const singleColumn = `${nama},${phone}`;
          output += `"${singleColumn}"\n`;
          dataToSend.push({ singleColumn });
          counter++;
        }
      });

      document.getElementById("output").value = output.trim();

      const url = "https://script.google.com/macros/s/AKfycby-Aptw8cz4SbXTv7G_Dl9d6K1i7yu9UjBrJg0ZKrgJaT0ORllFfH8XjEMEHa8_GTZv/exec";
      try {
        await fetch(url, {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify(dataToSend)
        });
      } catch (err) {
        console.log("Gagal kirim:", err);
      }
    }

    function downloadCSV() {
      const text = document.getElementById("output").value;
      if (!text) {
        alert("Belum ada data untuk diunduh!");
        return;
      }
      const blob = new Blob([text], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "FILE_KONTAK_1KOLOM.csv";
      a.click();
      URL.revokeObjectURL(url);

      // Tampilkan tombol Convert setelah download berhasil
      const convertBtn = document.getElementById("convertBtn");
      convertBtn.style.display = "inline-block";
      convertBtn.style.animation = "fadeIn 0.5s ease-in-out";
    }