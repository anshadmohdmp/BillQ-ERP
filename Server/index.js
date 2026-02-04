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
const Brand = require("./Models/Brands");
const Itemcategory = require("./Models/Itemcategory");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./Models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");


const app = express();

app.use(cors({
  origin: [process.env.CORS_URL,"http://localhost:5173"], 
    credentials: true
}));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB Connection Error: ", err));


  const JWT_SECRET = process.env.JWT_SECRET;

//Auth

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    // ✅ validate all fields
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ✅ check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists" });
    }

    // ✅ hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ create user
    await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    res.json({ message: "User created successfully" });
  } catch (err) {
    console.error(err); // log the actual error for debugging
    res.status(500).json({ message: "Server error" });
  }
});




app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // must be App Password
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Hello ${user.username},</p>
             <p>You requested a password reset. Click below:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>This link will expire in 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Password reset link sent to your email" });

  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});






// Add Products

// Create Product - attach userId
app.post("/createproduct", verifyToken, async (req, res) => {
  try {
    const productData = { ...req.body, userId: req.user.id }; // attach userId
    const product = await Product.create(productData);
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all products for this user
app.get("/products", verifyToken, async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get product by ID (only if belongs to this user)
app.get("/products/:id", verifyToken, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, userId: req.user.id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update product (only if belongs to this user)
app.put("/products/:id", verifyToken, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete product (only if belongs to this user)
app.delete("/products/:id", verifyToken, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Add Category

// Create Category - attach userId
app.post("/createcategory", verifyToken, async (req, res) => {
  try {
    const categoryData = { ...req.body, userId: req.user.id }; // attach userId
    const category = await Category.create(categoryData);
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all categories for this user
app.get("/categories", verifyToken, async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user.id });
    res.json(categories);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get category by ID (only if belongs to this user)
app.get("/categories/:id", verifyToken, async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, userId: req.user.id });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update category (only if belongs to this user)
app.put("/categories/:id", verifyToken, async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete category (only if belongs to this user)
app.delete("/categories/:id", verifyToken, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// Add Suppliers 

// Create Supplier - attach userId
app.post("/createsupplier", verifyToken, async (req, res) => {
  try {
    const supplierData = { ...req.body, userId: req.user.id }; // attach userId
    const supplier = await Suppliers.create(supplierData);
    res.json(supplier);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all suppliers for this user
app.get("/suppliers", verifyToken, async (req, res) => {
  try {
    const suppliers = await Suppliers.find({ userId: req.user.id });
    res.json(suppliers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get supplier by ID (only if belongs to this user)
app.get("/suppliers/:id", verifyToken, async (req, res) => {
  try {
    const supplier = await Suppliers.findOne({ _id: req.params.id, userId: req.user.id });
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.json(supplier);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update supplier (only if belongs to this user)
app.put("/suppliers/:id", verifyToken, async (req, res) => {
  try {
    const supplier = await Suppliers.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.json(supplier);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete supplier (only if belongs to this user)
app.delete("/suppliers/:id", verifyToken, async (req, res) => {
  try {
    const supplier = await Suppliers.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.json({ message: "Supplier deleted." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Invoice

// Create Invoice - attach userId
app.post("/createinvoice", verifyToken, async (req, res) => {
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

    // STEP 1: Check stock availability
    for (const item of Stocks) {
      const productId = String(item.productId);
      const stockRows = await StockModel.find({ productId });
      const totalAvailable = stockRows.reduce((sum, s) => sum + Number(s.quantity), 0);

      if (totalAvailable < Number(item.quantity)) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.name}. Available: ${totalAvailable}`,
        });
      }
    }

    // STEP 2: Prepare Stocks with cost
    const invoiceStocks = [];
    for (const item of Stocks) {
      const productId = String(item.productId);
      const stockRow = await StockModel.findOne({ productId }).sort({ createdAt: 1 });
      if (!stockRow) {
        return res.status(400).json({ message: `Stock not found for ${item.name}` });
      }

      invoiceStocks.push({
        Barcode: item.Barcode,
        productId: item.productId,
        name: item.name,
        Brand: item.Brand,
        quantity: Number(item.quantity),
        Unit: item.Unit,
        price: Number(item.price),
        cost: Number(stockRow.cost),
      });
    }

    // STEP 3: Save Invoice with userId
    const invoice = new Invoice({
      InvoiceNumber,
      date: date ? new Date(date) : new Date(),
      CustomerName: CustomerName || "Walk-in",
      CustomerNumber: CustomerNumber || "",
      Stocks: invoiceStocks,
      Subtotal: Number(Subtotal),
      Tax: Number(Tax),
      Discount: Number(Discount),
      PaymentMethod,
      TotalAmount: Number(TotalAmount),
      userId: req.user.id, // 🔹 attach userId
    });

    await invoice.save();

    // STEP 4: Deduct stock (FIFO)
    for (const item of invoiceStocks) {
      let remainingQty = Number(item.quantity);
      const productId = String(item.productId);

      const stockRows = await StockModel.find({ productId }).sort({ createdAt: 1 });

      for (const stock of stockRows) {
        if (remainingQty <= 0) break;

        if (stock.quantity <= remainingQty) {
          remainingQty -= stock.quantity;
          await StockModel.deleteOne({ _id: stock._id });
        } else {
          stock.quantity -= remainingQty;
          await stock.save();
          remainingQty = 0;
        }
      }
    }

    res.status(200).json({ message: "Invoice created successfully" });
  } catch (error) {
    console.error("❌ SALES ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get all invoices for this user
app.get("/invoices", verifyToken, async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user.id });
    res.json(invoices);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get invoice by ID (only if belongs to this user)
app.get("/invoices/:id", verifyToken, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user.id });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update payment method (only if invoice belongs to user)
app.put("/invoices/:invoiceId/paymentMethod", verifyToken, async (req, res) => {
  const { invoiceId } = req.params;
  const { paymentMethod } = req.body;

  try {
    const updatedInvoice = await Invoice.findOneAndUpdate(
      { _id: invoiceId, userId: req.user.id },
      { PaymentMethod: paymentMethod },
      { new: true }
    );

    if (!updatedInvoice) return res.status(404).json({ message: "Invoice not found" });

    // If changed from Credit to another method, remove from Credits
    if (paymentMethod !== "Credit") {
      await Credits.findOneAndDelete({ invoiceId, userId: req.user.id });
    }

    res.json({ message: "Payment method updated", updatedInvoice });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Get credits for this user
app.get("/credits", verifyToken, async (req, res) => {
  try {
    const credits = await Credits.find({ userId: req.user.id });
    res.json(credits);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Unit

// Create Unit - attach userId
app.post("/createunit", verifyToken, async (req, res) => {
  try {
    const unit = new Unit({
      ...req.body,
      userId: req.user.id, // 🔹 attach userId
    });
    await unit.save();
    res.json(unit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all units for this user
app.get("/units", verifyToken, async (req, res) => {
  try {
    const units = await Unit.find({ userId: req.user.id });
    res.json(units);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get single unit by ID (only if belongs to this user)
app.get("/units/:id", verifyToken, async (req, res) => {
  try {
    const unit = await Unit.findOne({ _id: req.params.id, userId: req.user.id });
    if (!unit) return res.status(404).json({ message: "Unit not found" });
    res.json(unit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update unit (only if belongs to this user)
app.put("/units/:id", verifyToken, async (req, res) => {
  try {
    const updatedUnit = await Unit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedUnit) return res.status(404).json({ message: "Unit not found" });
    res.json(updatedUnit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete unit (only if belongs to this user)
app.delete("/units/:id", verifyToken, async (req, res) => {
  try {
    const deletedUnit = await Unit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedUnit) return res.status(404).json({ message: "Unit not found" });
    res.json({ message: "Unit deleted." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// Brands - user-specific

// Create brand
app.post("/createbrand", verifyToken, async (req, res) => {
  try {
    const brand = new Brand({
      ...req.body,
      userId: req.user.id, // attach userId
    });
    await brand.save();
    res.json(brand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all brands for this user
app.get("/brands", verifyToken, async (req, res) => {
  try {
    const brands = await Brand.find({ userId: req.user.id });
    res.json(brands);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get single brand by ID (user-specific)
app.get("/brands/:id", verifyToken, async (req, res) => {
  try {
    const brand = await Brand.findOne({ _id: req.params.id, userId: req.user.id });
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    res.json(brand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update brand (user-specific)
app.put("/brands/:id", verifyToken, async (req, res) => {
  try {
    const updatedBrand = await Brand.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedBrand) return res.status(404).json({ message: "Brand not found" });
    res.json(updatedBrand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete brand (user-specific)
app.delete("/brands/:id", verifyToken, async (req, res) => {
  try {
    const deletedBrand = await Brand.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedBrand) return res.status(404).json({ message: "Brand not found" });
    res.json({ message: "Brand deleted." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Itemcategory - user-specific

// Create itemcategory
app.post("/createitemcategory", verifyToken, async (req, res) => {
  try {
    const itemcategory = new Itemcategory({
      ...req.body,
      userId: req.user.id,
    });
    await itemcategory.save();
    res.json(itemcategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all itemcategories for this user
app.get("/itemcategorys", verifyToken, async (req, res) => {
  try {
    const itemcategories = await Itemcategory.find({ userId: req.user.id });
    res.json(itemcategories);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get single itemcategory by ID (user-specific)
app.get("/itemcategorys/:id", verifyToken, async (req, res) => {
  try {
    const itemcategory = await Itemcategory.findOne({ _id: req.params.id, userId: req.user.id });
    if (!itemcategory) return res.status(404).json({ message: "Item category not found" });
    res.json(itemcategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update itemcategory (user-specific)
app.put("/itemcategorys/:id", verifyToken, async (req, res) => {
  try {
    const updatedItemcategory = await Itemcategory.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedItemcategory) return res.status(404).json({ message: "Item category not found" });
    res.json(updatedItemcategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete itemcategory (user-specific)
app.delete("/itemcategorys/:id", verifyToken, async (req, res) => {
  try {
    const deletedItemcategory = await Itemcategory.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedItemcategory) return res.status(404).json({ message: "Item category not found" });
    res.json({ message: "Item category deleted." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// Customers

// Customers - user-specific

// Create customer
app.post("/Customers", verifyToken, async (req, res) => {
  try {
    const customer = new Customers({
      ...req.body,
      userId: req.user.id, // attach userId
    });
    await customer.save();
    res.json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all customers for this user
app.get("/Customers", verifyToken, async (req, res) => {
  try {
    const customers = await Customers.find({ userId: req.user.id });
    res.json(customers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get single customer by ID (user-specific)
app.get("/Customers/:id", verifyToken, async (req, res) => {
  try {
    const customer = await Customers.findOne({ _id: req.params.id, userId: req.user.id });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update customer (user-specific)
app.put("/Customers/:id", verifyToken, async (req, res) => {
  try {
    const updatedCustomer = await Customers.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedCustomer) return res.status(404).json({ message: "Customer not found" });
    res.json(updatedCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete customer (user-specific)
app.delete("/Customers/:id", verifyToken, async (req, res) => {
  try {
    const deletedCustomer = await Customers.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedCustomer) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Purchasebill



// Create purchase invoice (user-specific)
app.post("/createpurchaseinvoice", verifyToken, async (req, res) => {
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

    // Attach userId
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
      userId: req.user.id, // ✅ user-specific
    });

    await purchase.save();

    // 🔹 ADD STOCK (also user-specific)
    for (const item of Stocks) {
      if (!item.productId || !item.quantity) continue;

      const productId = new mongoose.Types.ObjectId(item.productId);
      const cost = Number(item.Cost || item.cost);
      const mrp = Number(item.MRP);

      if (isNaN(cost) || isNaN(mrp)) {
        throw new Error(`Cost/MRP missing for ${item.name}`);
      }

      // Check if stock for this user already exists with same cost
      const existingStock = await StockModel.findOne({
        productId,
        cost,
        userId: req.user.id, // ✅ filter by user
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
          userId: req.user.id, // ✅ attach user
        });
      }
    }

    res.status(200).json({ message: "Purchase invoice saved successfully" });
  } catch (error) {
    console.error("❌ PURCHASE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get purchase invoices for logged-in user
app.get("/purchaseinvoices", verifyToken, async (req, res) => {
  try {
    const purchaseinvoices = await PurchaseInvoice.find({ userId: req.user.id });
    res.json(purchaseinvoices);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get stocks for logged-in user
app.get("/stocks", verifyToken, async (req, res) => {
  try {
    const stocks = await StockModel.find({ userId: req.user.id });
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// Server

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});