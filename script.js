import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://uvoppzdiqujbfilnqrce.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2b3BwemRpcXVqYmZpbG5xcmNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NTU4NDgsImV4cCI6MjA2MDMzMTg0OH0.aoU3w5uVS4RBEN_M6XO2ytKJdeZXIOcf5TEyeDGtSJY'; // Replace this with your real anon key
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", function() {
  const modals = [
    { buttonId: "addDrawerButton", modalId: "addDrawerModal", closeId: "closeAddDrawer" },
    { buttonId: "addCompartmentButton", modalId: "addCompartmentModal", closeId: "closeAddCompartment" },
    { buttonId: "addBoxButton", modalId: "addBoxModal", closeId: "closeAddBox" },
    { buttonId: "addPieceButton", modalId: "addPieceModal", closeId: "closeAddPiece" },
  ];

  modals.forEach(({ buttonId, modalId, closeId }) => {
    const openButton = document.getElementById(buttonId);
    const modal = document.getElementById(modalId);
    const closeButton = document.getElementById(closeId);

    openButton.addEventListener("click", function() {
      modal.classList.remove("hidden");
    });

    closeButton.addEventListener("click", function() {
      modal.classList.add("hidden");
    });
  });

  // Your submitDrawerButton click handler can stay separately here
});    
    // Submit Drawer Button
const submitDrawerButton = document.getElementById("submitDrawer");

submitDrawerButton.addEventListener("click", async function() {
  const drawerName = document.getElementById("drawerNameInput").value.trim();

  if (!drawerName) {
    alert("Please enter a drawer name");
    return;
  }
}); 
  
// QR Scanner ref
document.getElementById("startScanButton").addEventListener("click", showQrScanner);


