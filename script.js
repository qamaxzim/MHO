document.addEventListener("DOMContentLoaded", () => {
    const drawerContainer = document.getElementById("drawer-container");
  
    // Let's assume you have 2 wooden + 4 plastic drawers
    const drawers = [
      { id: 1, type: "Wooden Drawer", compartments: 6 },
      { id: 2, type: "Wooden Drawer", compartments: 6 },
      { id: 3, type: "Plastic Drawer", compartments: 3 },
      { id: 4, type: "Plastic Drawer", compartments: 3 },
      { id: 5, type: "Plastic Drawer", compartments: 3 },
      { id: 6, type: "Plastic Drawer", compartments: 3 },
    ];
  
    drawers.forEach(drawer => {
      const div = document.createElement("div");
      div.className = "drawer";
      div.textContent = `${drawer.type} #${drawer.id} - ${drawer.compartments} compartments`;
      drawerContainer.appendChild(div);
    });
  });
  