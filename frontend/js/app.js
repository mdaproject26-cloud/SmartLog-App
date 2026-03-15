import { authService } from "./services/auth.js";
import { productUI } from "./modules/products.js";
import { locationUI } from "./modules/locations.js";
import { customerUI } from "./modules/customers.js";
import { supplierUI } from "./modules/suppliers.js";
import { inventoryUI } from "./modules/inventory.js";
import { inboundUI } from "./modules/inbound.js";
import { outboundUI } from "./modules/outbound.js";
import { reportUI } from "./modules/reports.js";
import { userUI } from "./modules/users.js";

// SmartLog Main Application Entry Point
console.log("SmartLog App Initialized");

// Role-based Menu Permissions
const rolePermissions = {
  Admin: [
    "#dashboard",
    "#products",
    "#locations",
    "#inventory",
    "#inbound",
    "#outbound",
    "#reports",
    "#users",
  ],
  Operator: ["#dashboard", "#inventory", "#inbound"],
  Picker: ["#dashboard", "#inventory", "#outbound"],
  Checker: ["#dashboard", "#inventory", "#inbound", "#outbound"],
  Dispatcher: ["#dashboard", "#inventory", "#outbound"],
};

function updateMenuVisibility(userRole) {
  const allowedMenus = rolePermissions[userRole] || ["#dashboard"];

  document.querySelectorAll(".sidebar-nav li a").forEach((link) => {
    const href = link.getAttribute("href");
    if (allowedMenus.includes(href)) {
      link.parentElement.style.display = "block";
    } else {
      link.parentElement.style.display = "none";
    }
  });
}

// Simple SPA Router
const routes = {
  "#dashboard": { title: "Dashboard", render: () => renderDashboard() },
  "#products": {
    title: "Master Produk",
    render: () => productUI.renderProductList(),
  },
  "#locations": {
    title: "Master Lokasi",
    render: () => locationUI.renderLocationList(),
  },
  "#customers": {
    title: "Master Customer",
    render: () => customerUI.renderCustomerList(),
  },
  "#suppliers": {
    title: "Master Supplier",
    render: () => supplierUI.renderSupplierList(),
  },
  "#inventory": {
    title: "Inventory",
    render: () => inventoryUI.renderInventoryList(),
  },
  "#inbound": {
    title: "Inbound (PO)",
    render: () => inboundUI.renderInboundList(),
  },
  "#outbound": {
    title: "Outbound (SO)",
    render: () => outboundUI.renderOutboundList(),
  },
  "#reports": {
    title: "Reports",
    render: () => reportUI.renderReportDashboard(),
  },
  "#users": { title: "User Management", render: () => userUI.renderUserList() },
};

function renderDashboard() {
  const contentArea = document.getElementById("content-area");
  contentArea.innerHTML = `
        <div class="dashboard-preview">
            <h3>Welcome, Admin!</h3>
            <p>Pilih menu di samping untuk mulai mengelola gudang.</p>
        </div>
    `;
}

function handleRoute() {
  if (!authService.isAuthenticated()) {
    console.log("User not authenticated, showing login form...");
    // In a real app, we'd redirect to a login page or show a modal
    return;
  }

  const user = authService.getUser();
  updateMenuVisibility(user.role);

  const hash = window.location.hash || "#dashboard";
  const route = routes[hash] || routes["#dashboard"];

  // Update breadcrumb
  document.getElementById("current-page").innerText = route.title;

  // Update active menu
  document.querySelectorAll(".sidebar-nav li").forEach((li) => {
    li.classList.remove("active");
    const link = li.querySelector("a");
    if (link && link.getAttribute("href") === hash) {
      li.classList.add("active");
    }
  });

  // Render the content
  route.render();

  console.log(`Navigating to: ${route.title} as ${user.role}`);
}

window.addEventListener("hashchange", handleRoute);
window.addEventListener("load", handleRoute);
