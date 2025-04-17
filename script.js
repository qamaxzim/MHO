import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://uvoppzdiqujbfilnqrce.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2b3BwemRpcXVqYmZpbG5xcmNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NTU4NDgsImV4cCI6MjA2MDMzMTg0OH0.aoU3w5uVS4RBEN_M6XO2ytKJdeZXIOcf5TEyeDGtSJY'; // Replace this with your real anon key
const supabase = createClient(supabaseUrl, supabaseKey);



document.addEventListener("DOMContentLoaded", function() {
  const drawerContainer = document.getElementById("drawer-container");
  let db;

  window.initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}` }).then(SQL => {
    db = new SQL.Database();

    db.run(`
      CREATE TABLE IF NOT EXISTS drawers (
        id INTEGER PRIMARY KEY,
        type TEXT,
        compartments INTEGER
      );
    `);

    const drawers = [
      { id: 1, type: "Wooden Drawer", compartments: 6 },
      { id: 2, type: "Wooden Drawer", compartments: 6 },
      { id: 3, type: "Plastic Drawer", compartments: 3 },
      { id: 4, type: "Plastic Drawer", compartments: 3 },
      { id: 5, type: "Plastic Drawer", compartments: 3 },
      { id: 6, type: "Plastic Drawer", compartments: 3 },
    ];

    const insertStmt = db.prepare("INSERT INTO drawers (id, type, compartments) VALUES (?, ?, ?)");
    drawers.forEach(drawer => insertStmt.run([drawer.id, drawer.type, drawer.compartments]));
    insertStmt.free();

    renderDrawersFromDB();
  const addDrawerButton = document.getElementById("addDrawerButton");
  const drawerModal = document.getElementById("addDrawerModal");
  const closeDrawerModal = document.getElementById("closeAddDrawer");

  // Show the modal when the Add Drawer button is clicked
  addDrawerButton.addEventListener("click", function() {
    drawerModal.classList.remove("hidden"); // Show the modal
  });

  // Hide the modal when the close button is clicked
  closeDrawerModal.addEventListener("click", function() {
    drawerModal.classList.add("hidden"); // Hide the modal
  });
  const addCompartmentButton = document.getElementById("addCompartmentButton");
  const CompartmentModal = document.getElementById("addCompartmentModal");
  const closeCompartmentModal = document.getElementById("closeAddCompartment");

  // Show the modal when the Add Box button is clicked
  addCompartmentButton.addEventListener("click", function() {
    CompartmentModal.classList.remove("hidden"); // Show the modal
  });

  // Hide the modal when the close button is clicked
  closeCompartmentModal.addEventListener("click", function() {
    CompartmentModal.classList.add("hidden"); // Hide the modal
  });
  const addBoxButton = document.getElementById("addBoxButton");
  const BoxModal = document.getElementById("addBoxModal");
  const closeBoxModal = document.getElementById("closeAddBox");

  // Show the modal when the Add Box button is clicked
  addBoxButton.addEventListener("click", function() {
    BoxModal.classList.remove("hidden"); // Show the modal
  });

  // Hide the modal when the close button is clicked
  closeBoxModal.addEventListener("click", function() {
    BoxModal.classList.add("hidden"); // Hide the modal
  });
  const addPieceButton = document.getElementById("addPieceButton");
  const pieceModal = document.getElementById("addPieceModal");
  const closePieceModal = document.getElementById("closeAddPiece");

  // Show the modal when the Add Drawer button is clicked
  addPieceButton.addEventListener("click", function() {
    pieceModal.classList.remove("hidden"); // Show the modal
  });

  // Hide the modal when the close button is clicked
  closePieceModal.addEventListener("click", function() {
    pieceModal.classList.add("hidden"); // Hide the modal
  });


  });

  function renderDrawersFromDB() {
    drawerContainer.innerHTML = "";

    const result = db.exec("SELECT * FROM drawers");

    if (result.length > 0) {
      const values = result[0].values;

      values.forEach(row => {
        const [id, type, compartments] = row;

        const div = document.createElement("div");
        div.className = "drawer bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 mb-2 cursor-pointer flex items-center gap-3";
        div.innerHTML = `<i class="fas fa-box"></i> ${type} #${id} - ${compartments} compartments`;

        div.addEventListener("click", () => {
          const existing = div.querySelector(".compartments");
          if (existing) {
            existing.remove();
          } else {
            const compList = document.createElement("div");
            compList.className = "compartments ml-6 mt-2";
            for (let i = 1; i <= compartments; i++) {
              const comp = document.createElement("div");
              comp.className = "text-sm text-white bg-blue-400 px-3 py-1 rounded mb-1 shadow";
              comp.textContent = `Compartment ${i}`;
              compList.appendChild(comp);
            }
            div.appendChild(compList);
          }
        });

        drawerContainer.appendChild(div);
      });
    }
  }
});

// ✅ Main QR Scanner logic
let selectedBoxInfo = null;

async function showQrScanner() {
  selectedBoxInfo = null;

  document.getElementById("qrModal").classList.remove("hidden");

  const qrScanner = new Html5Qrcode("qr-reader");

  qrScanner.start(
    { facingMode: "environment" },
    {
      fps: 10,
      qrbox: 250
    },
    async qrCodeMessage => {
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

      const partNum = box.part_num;

      const action = confirm("Press OK to add pieces, Cancel to remove pieces.");
      const operation = action ? "add" : "remove";

      const countStr = prompt(`How many pieces do you want to ${operation}?`);
      const count = parseInt(countStr);
      if (isNaN(count) || count <= 0) {
        alert("Invalid number.");
        return;
      }

      const delta = operation === "add" ? count : -count;
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
        .eq('part_num', partNum)
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
          .eq('part_num', partNum);
      } else if (delta > 0) {
        await supabase
          .from('my_parts')
          .insert({ part_num: partNum, qty: delta });
      }

      alert(`✅ ${Math.abs(count)} piece(s) ${operation === "add" ? "added" : "removed"}!`);

      qrScanner.stop().then(() => {
        document.getElementById("qrModal").classList.add("hidden");
        document.getElementById("qr-reader").innerHTML = "";
      });
    },
    errorMessage => {
      // Optional: console.warn("QR Scan Error", errorMessage);
    }
  );

  document.getElementById("closeQr").onclick = () => {
    qrScanner.stop().then(() => {
      document.getElementById("qrModal").classList.add("hidden");
      document.getElementById("qr-reader").innerHTML = "";
    });
  };
}

// Expose to global
window.showQrScanner = showQrScanner;
