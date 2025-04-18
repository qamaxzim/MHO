let selectedBoxInfo = null;
let qrScanner = null;

async function showQrScanner() {
  selectedBoxInfo = null;
  document.getElementById("qrModal").classList.remove("hidden");

  qrScanner = new Html5Qrcode("qr-reader");

  const stopScanner = async () => {
    await qrScanner.stop();
    document.getElementById("qrModal").classList.add("hidden");
    document.getElementById("qr-reader").innerHTML = "";
  };

  qrScanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    async (qrCodeMessage) => {
      console.log("Scanned:", qrCodeMessage);

      const { data: box, error } = await supabase
        .from('boxes')
        .select('id, part_num, qty')
        .eq('barcode', qrCodeMessage)
        .single();

      if (error || !box) {
        alert("Box not found in the database!");
        return;
      }

      const action = confirm("Press OK to add pieces, Cancel to remove pieces.");
      const count = parseInt(prompt(`How many pieces to ${action ? "add" : "remove"}?`));

      if (isNaN(count) || count <= 0) {
        alert("Invalid number.");
        return;
      }

      const delta = action ? count : -count;
      const newBoxQty = box.qty + delta;

      if (newBoxQty < 0) {
        alert("You can't remove more than you have!");
        return;
      }

      // Update box qty
      await supabase
        .from('boxes')
        .update({ qty: newBoxQty })
        .eq('id', box.id);

      // Update or insert into my_parts
      const { data: existingPart } = await supabase
        .from('my_parts')
        .select('qty')
        .eq('part_num', box.part_num)
        .maybeSingle();

      if (existingPart) {
        const newQty = existingPart.qty + delta;
        if (newQty < 0) {
          alert("You can't remove more than your total inventory!");
          return;
        }

        await supabase
          .from('my_parts')
          .update({ qty: newQty })
          .eq('part_num', box.part_num);
      } else if (delta > 0) {
        await supabase
          .from('my_parts')
          .insert({ part_num: box.part_num, qty: delta });
      }

      alert(`✅ ${Math.abs(count)} piece(s) ${action ? "added" : "removed"}!`);
      await stopScanner();
    },
    (errorMessage) => {
      // You can optionally log scanning errors here
    }
  );

  document.getElementById("closeQr").onclick = stopScanner;
}

// Expose to global
window.showQrScanner = showQrScanner;