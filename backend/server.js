const express = require("express");
const cors = require("cors");
require("dotenv").config();
const supabase = require("./services/database");
const products = require("./modules/products");
const locations = require("./modules/locations");
const customers = require("./modules/customers");
const suppliers = require("./modules/suppliers");
const inventory = require("./modules/inventory");
const inbound = require("./modules/inbound");
const outbound = require("./modules/outbound");
const reports = require("./reports/stock_report");
const users = require("./modules/users");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token missing" });

  // In a real app, you would verify the token with supabase.auth.getUser(token)
  // For now, we'll assume the token is valid for development
  next();
};

// Basic Route for Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "SmartLog Backend is running" });
});

// Authentication Routes
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Optionally fetch user role from your custom 'users' table if needed
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role, name")
      .eq("id", data.user.id)
      .single();

    res.json({
      message: "Login successful",
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: userData ? userData.role : "User",
        name: userData ? userData.name : "Unknown",
      },
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Product Routes
app.get("/api/products", authenticateToken, async (req, res) => {
  try {
    const data = await products.getAllProducts();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/products", authenticateToken, async (req, res) => {
  try {
    const data = await products.createProduct(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/products/:id", authenticateToken, async (req, res) => {
  try {
    const data = await products.updateProduct(req.params.id, req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/products/:id", authenticateToken, async (req, res) => {
  try {
    const result = await products.deleteProduct(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Location Routes
app.get("/api/locations", authenticateToken, async (req, res) => {
  try {
    const data = await locations.getAllLocations();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/locations", authenticateToken, async (req, res) => {
  try {
    const data = await locations.createLocation(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/locations/:id", authenticateToken, async (req, res) => {
  try {
    const data = await locations.updateLocation(req.params.id, req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/locations/:id", authenticateToken, async (req, res) => {
  try {
    const result = await locations.deleteLocation(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Customer Routes
app.get("/api/customers", authenticateToken, async (req, res) => {
  try {
    const data = await customers.getAllCustomers();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/customers", authenticateToken, async (req, res) => {
  try {
    const data = await customers.createCustomer(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supplier Routes
app.get("/api/suppliers", authenticateToken, async (req, res) => {
  try {
    const data = await suppliers.getAllSuppliers();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/suppliers", authenticateToken, async (req, res) => {
  try {
    const data = await suppliers.createSupplier(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inventory Routes
app.get("/api/inventory", authenticateToken, async (req, res) => {
  try {
    const data = await inventory.getInventory();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inbound Routes
app.get("/api/inbound", authenticateToken, async (req, res) => {
  try {
    const data = await inbound.getInboundList();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/inbound/po", authenticateToken, async (req, res) => {
  try {
    const data = await inbound.createPO(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/inbound/putaway", authenticateToken, async (req, res) => {
  try {
    const data = await inbound.putaway(
      req.body.header_id,
      req.body.putaway_data,
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Outbound Routes
app.get("/api/outbound", authenticateToken, async (req, res) => {
  try {
    const data = await outbound.getOutboundList();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/outbound/so", authenticateToken, async (req, res) => {
  try {
    const data = await outbound.createSO(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/outbound/pick", authenticateToken, async (req, res) => {
  try {
    const data = await outbound.pickItems(
      req.body.header_id,
      req.body.pick_data,
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reporting Routes
app.get("/api/reports/stock", authenticateToken, async (req, res) => {
  try {
    const data = await reports.getStockReport();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/reports/movement", authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await reports.getMovementReport(startDate, endDate);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Management Routes
app.get("/api/users", authenticateToken, async (req, res) => {
  try {
    const data = await users.getAllUsers();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/users", authenticateToken, async (req, res) => {
  try {
    const data = await users.createUser(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`SmartLog Server running on http://localhost:${PORT}`);
});
