const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const Product = require("./Models/Products");
const Suppliers = require("./Models/Suppliers");
const Category = require("./Models/Category");
const Invoice = require("./Models/Invoices");
const Unit = require("./Models/Unit");
const Customers = require("./Models/Customers");
const PurchaseInvoice = require("./Models/PurchaseInvoice");
const StockModel = require("./Models/Stocks");
const Credits = require("./Models/Credits");



const app = express();

app.use(cors({
  origin: ["https://bill-q-erp.vercel.app", "http://localhost:5173"],
    credentials: true
}));
app.use(express.json());

mongoose
  .connect("mongodb+srv://anshadmuhammedmp:Mkmuhammedkunhi65@cluster0.zqs0dae.mongodb.net/MyBilling")
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB Connection Error: ", err));

// Add Products

app.post("/createproduct", async (req, res) => {
  Product.create(req.body)
    .then((product) => res.json(product))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/products", async (req, res) => {
  Product.find()
    .then((products) => res.json(products))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/products/:id", async (req, res) => {
  Product.findById(req.params.id)
    .then((product) => res.json(product))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.put("/products/:id", async (req, res) => {
  Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((product) => res.json(product))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.delete("/products/:id", async (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then(() => res.json("Product deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Add Category

app.post("/createcategory", async (req, res) => {
  Category.create(req.body)
    .then((category) => res.json(category))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/categories", async (req, res) => {
  Category.find()
    .then((categories) => res.json(categories))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/categories/:id", async (req, res) => {
  Category.findById(req.params.id)
    .then((category) => res.json(category))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.put("/categories/:id", async (req, res) => {
  Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((category) => res.json(category))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.delete("/categories/:id", async (req, res) => {
  Category.findByIdAndDelete(req.params.id)
    .then(() => res.json("Category deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});


// Add Suppliers 

app.post("/createsupplier", async (req, res) => {
  Suppliers.create(req.body)
    .then((supplier) => res.json(supplier))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/suppliers", async (req, res) => {
  Suppliers.find()
    .then((suppliers) => res.json(suppliers))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/suppliers/:id", async (req, res) => {
  Suppliers.findById(req.params.id)
    .then((supplier) => res.json(supplier))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.put("/suppliers/:id", async (req, res) => {
  Suppliers.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((supplier) => res.json(supplier))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.delete("/suppliers/:id", async (req, res) => {
  Suppliers.findByIdAndDelete(req.params.id)
    .then(() => res.json("Supplier deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Invoice
// CREATE INVOICE - FULL FIX
// CREATE INVOICE - FULL FIX
app.post("/createinvoice", async (req, res) => {
  try {
    console.log("📥 Incoming invoice:", req.body);

    const {
      InvoiceNumber,
      date,
      CustomerName,
      CustomerNumber,
      Stocks,
      Subtotal,
      Tax,
      PaymentMethod,
      TotalAmount,
      Discount,
    } = req.body;

    // 1️⃣ Basic validation
    if (!InvoiceNumber) return res.status(400).json({ message: "InvoiceNumber missing" });
    if (!Array.isArray(Stocks) || Stocks.length === 0)
      return res.status(400).json({ message: "Stocks array invalid" });

    // 2️⃣ Save Invoice
    const invoice = new Invoice({
      InvoiceNumber,
      date: date ? new Date(date) : new Date(),
      CustomerName: CustomerName || "Walk-in",
      CustomerNumber: CustomerNumber || "",
      Stocks,
      Subtotal: Number(Subtotal || 0),
      Tax: Number(Tax || 0),
      PaymentMethod,
      TotalAmount: Number(TotalAmount || 0),
      Discount: Number(Discount || 0),
    });
    await invoice.save();

    // 3️⃣ Save to Credits if PaymentMethod is Credit
    if (PaymentMethod === "Credit") {
      const credit = new Credits({
        _id: invoice._id, // reuse invoice _id
        InvoiceNumber,
        date: date ? new Date(date) : new Date(),
        CustomerName: CustomerName || "Walk-in",
        CustomerNumber: CustomerNumber || "",
        Stocks,
        Subtotal: Number(Subtotal || 0),
        Tax: Number(Tax || 0),
        PaymentMethod,
        TotalAmount: Number(TotalAmount || 0),
        Discount: Number(Discount || 0),
      });
      await credit.save();
    }

    // 4️⃣ Deduct stock quantities robustly
    for (const item of Stocks) {
      if (!item.productId || !item.quantity) continue;

      const deductQty = Number(item.quantity);
      if (isNaN(deductQty) || deductQty <= 0) continue;

      // Find stock by productId (brand optional)
      const stock = await StockModel.findOne({ productId: item.productId });
      if (!stock) {
        console.warn(`⚠️ Stock not found for ${item.name} (productId: ${item.productId})`);
        continue; // skip deduction if not found
      }

      if (stock.quantity < deductQty) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.name} (Available: ${stock.quantity}, Requested: ${deductQty})`,
        });
      }

      stock.quantity -= deductQty;
      await stock.save();
      console.log(`✅ Stock updated for ${item.name}: remaining ${stock.quantity}`);
    }

    res.status(200).json({ message: "Invoice created and stock updated successfully", invoice });
  } catch (error) {
    console.error("❌ ERROR creating invoice:", error);
    res.status(500).json({ message: error.message });
  }
});





app.get("/credits", async (req, res) => {
  Credits.find()
    .then((credits) => res.json(credits))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.put("/invoices/:invoiceId/paymentMethod", async (req, res) => {
  const { invoiceId } = req.params;
  const { paymentMethod } = req.body;

  try {
    // Update Invoice
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      { PaymentMethod: paymentMethod },
      { new: true }
    );

    if (!updatedInvoice) return res.status(404).send("Invoice not found");

    // If method changed from Credit to something else, remove from Credits
    if (paymentMethod !== "Credit") {
      await Credits.findByIdAndDelete(invoiceId);
    }

    res.json({ message: "Payment method updated", updatedInvoice });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});



app.get("/invoices", async (req, res) => {
  Invoice.find()
    .then((invoices) => res.json(invoices))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/invoices/:id", async (req, res) => {
  Invoice.findById(req.params.id)
    .then((invoice) => res.json(invoice))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Unit

app.post("/createunit", async (req, res) => {
  Unit.create(req.body)
    .then((unit) => res.json(unit))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/units", async (req, res) => {
  Unit.find()
    .then((units) => res.json(units))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/units/:id", async (req, res) => {
  Unit.findById(req.params.id)
    .then((unit) => res.json(unit))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.put("/units/:id", async (req, res) => {
  Unit.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((unit) => res.json(unit))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.delete("/units/:id", async (req, res) => {
  Unit.findByIdAndDelete(req.params.id)
    .then(() => res.json("Unit deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});


// Customers

app.post("/Customers", async (req, res) => {
  Customers.create(req.body)
    .then((customer) => res.json(customer))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/Customers", async (req, res) => {
  Customers.find()
    .then((customers) => res.json(customers))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/Customers/:id", async (req, res) => {
  Customers.findById(req.params.id)
    .then((customer) => res.json(customer))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.put("/Customers/:id", async (req, res) => {
  Customers.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((customer) => res.json(customer))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.delete("/Customers/:id", async (req, res) => {
  Customers.findByIdAndDelete(req.params.id)
    .then(() => res.json("Customer deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Purchasebill

app.post("/createpurchaseinvoice", async (req, res) => {
  try {
    const {
      InvoiceNumber,
      date,
      SupplierName,
      Stocks,
      Subtotal,
      Tax,
      Discount,
      PaymentMethod,
      TotalAmount,
    } = req.body;

    if (!Array.isArray(Stocks) || Stocks.length === 0) {
      return res.status(400).json({ message: "No products provided" });
    }

    const purchase = new PurchaseInvoice({
      InvoiceNumber,
      date: new Date(date),
      SupplierName,
      Stocks,
      Subtotal,
      Tax,
      Discount,
      PaymentMethod,
      TotalAmount,
    });

    await purchase.save();
    // Add stocks
    for (const item of Stocks) {
      if (!item.productId || !item.quantity) continue;

      // Find existing stock with same product, cost, and brand
      const stock = await StockModel.findOne({
        productId: item.productId,
        cost: item.Cost,
        Brand: item.Brand || null,
      });

      if (stock) {
        // Same product + same cost + same brand → just increment quantity
        stock.quantity += item.quantity;
        await stock.save();
      } else {
        // Create new stock row
        await StockModel.create({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          cost: item.Cost,
          MRP: item.MRP,
          Unit: item.Unit,
          Barcode: item.Barcode,
          Brand: item.Brand || null,
        });
      }
    }

    res.status(200).json({ message: "Purchase invoice saved successfully" });
  } catch (error) {
    console.error("❌ PURCHASE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});










app.get("/purchaseinvoices", async (req, res) => {
  PurchaseInvoice.find()
    .then((purchaseinvoices) => res.json(purchaseinvoices))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/stocks", async (req, res) => {
  try {
    const stocks = await StockModel.find();
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Server

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});