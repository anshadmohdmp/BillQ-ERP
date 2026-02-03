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
const mongoose = require("mongoose");
require('dotenv').config();



const app = express();

app.use(cors({
  origin: process.env.CORS_URL, 
    credentials: true
}));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
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

app.post("/createinvoice", async (req, res) => {
  try {
    const {
      InvoiceNumber,
      date,
      CustomerName,
      CustomerNumber,
      Stocks,
      Subtotal,
      Tax,
      Discount,
      PaymentMethod,
      TotalAmount,
    } = req.body;

    if (!InvoiceNumber || !Array.isArray(Stocks) || !Stocks.length) {
      return res.status(400).json({ message: "Invalid invoice data" });
    }

    /* ======================================================
       🔹 STEP 1: CHECK STOCK AVAILABILITY (NO DEDUCTION YET)
    ====================================================== */
    for (const item of Stocks) {
      if (!item.productId) {
        return res
          .status(400)
          .json({ message: "Product ID missing in billing" });
      }

      // ⚠️ IMPORTANT: productId is STRING in DB
      const productId = String(item.productId);

      const stockRows = await StockModel.find({ productId });

      const totalAvailable = stockRows.reduce(
        (sum, s) => sum + Number(s.quantity),
        0
      );

      console.log("🔎 Stock check:", {
        productId,
        available: totalAvailable,
        requested: item.quantity,
      });

      if (totalAvailable < Number(item.quantity)) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.name}. Available: ${totalAvailable}`,
        });
      }
    }

    /* ======================================================
       🔹 STEP 2: SAVE INVOICE
    ====================================================== */
    const invoice = new Invoice({
      InvoiceNumber,
      date: date ? new Date(date) : new Date(),
      CustomerName: CustomerName || "Walk-in",
      CustomerNumber: CustomerNumber || "",
      Stocks,
      Subtotal: Number(Subtotal),
      Tax: Number(Tax),
      Discount: Number(Discount),
      PaymentMethod,
      TotalAmount: Number(TotalAmount),
    });

    await invoice.save();

    /* ======================================================
       🔹 STEP 3: FIFO STOCK DEDUCTION
    ====================================================== */
    for (const item of Stocks) {
      let remainingQty = Number(item.quantity);
      const productId = String(item.productId);

      const stockRows = await StockModel.find({ productId }).sort({
        createdAt: 1, // FIFO
      });

      for (const stock of stockRows) {
        if (remainingQty <= 0) break;

        if (stock.quantity <= remainingQty) {
          remainingQty -= stock.quantity;
          await StockModel.deleteOne({ _id: stock._id });
        } else {
          stock.quantity -= remainingQty;
          remainingQty = 0;
          await stock.save();
        }
      }
    }

    res.status(200).json({
      message: "Invoice created successfully",
    });
  } catch (error) {
    console.error("❌ SALES ERROR:", error);
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

    if (!Array.isArray(Stocks) || !Stocks.length) {
      return res.status(400).json({ message: "No stock items provided" });
    }

    const purchase = new PurchaseInvoice({
      InvoiceNumber,
      date: date ? new Date(date) : new Date(),
      SupplierName,
      Stocks,
      Subtotal,
      Tax,
      Discount,
      PaymentMethod,
      TotalAmount,
    });

    await purchase.save();

    // 🔹 ADD STOCK
    for (const item of Stocks) {
      if (!item.productId || !item.quantity) continue;

      const productId = new mongoose.Types.ObjectId(item.productId);

      const cost = Number(item.Cost || item.cost);
      const mrp = Number(item.MRP);

      if (isNaN(cost) || isNaN(mrp)) {
        throw new Error(`Cost/MRP missing for ${item.name}`);
      }

      const existingStock = await StockModel.findOne({
  productId,
  cost
});


      if (existingStock) {
        existingStock.quantity += Number(item.quantity);
        await existingStock.save();
      } else {
        await StockModel.create({
          productId,
          name: item.name,
          quantity: Number(item.quantity),
          cost,
          MRP: mrp,
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