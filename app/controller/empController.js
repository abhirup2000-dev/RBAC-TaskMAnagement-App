const Record = require("../model/recordModel");
const Employee = require("../model/employeeModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { ROLE_PERMISSIONS } = require("../middleware/middleware");

const statusCode = require("../utils/StatusCode");

class ViewController {
  // GET /
  viewLogin(req, res) {
    if (req.user) return res.redirect("/dashboard");
    res.render("index", { error: null, title: "Employee Login" });
  }

  adminLogin(req, res) {
    if (req.user) return res.redirect("/dashboard");
    res.render("admin/adminlogin", { error: null, title: "Admin Login" });
  }

  managerLogin(req, res) {
    if (req.user) return res.redirect("/dashboard");
    res.render("manager/managerlogin", { error: null, title: "Manager Login" });
  }

  // GET /register
  viewRegister(req, res) {
    if (req.user) return res.redirect("/dashboard");
    res.render("register", { error: null });
  }

  // GET /dashboard
  async showDashboard(req, res) {
    try {
      const permissions = ROLE_PERMISSIONS[req.user.role] || [];
      res.render("dashboard", {
        user: req.user,
        permissions: permissions,
        allPermissions: [
          "create_record",
          "read_record",
          "update_record",
          "delete_record",
        ],
      });
    } catch (error) {
      res.status(statusCode.SERVER_ERROR).send("Server error");
    }
  }

  // GET /records-view
  async showRecords(req, res) {
    try {
      const permissions = ROLE_PERMISSIONS[req.user.role] || [];
      const records = await Record.find({}).sort({ createdAt: -1 });
      res.render("records", {
        user: req.user,
        permissions: permissions,
        records: records,
        error: null,
        success: null,
      });
    } catch (error) {
      res.status(500).send("Server error");
    }
  }

  // POST /auth/login
  async handleLogin(req, res) {
    try {
      const { empEmail, empPassword } = req.body;

      const employee = await Employee.findOne({ empEmail });

      // ❌ check user first
      if (!employee) {
        return res.render("index", { error: "Invalid email or password" });
      }

      // 🔥 compare hashed password
      const isMatch = await bcrypt.compare(empPassword, employee.empPassword);

      if (!isMatch) {
        return res.render("index", { error: "Invalid email or password" });
      }

      const permissions = ROLE_PERMISSIONS[employee.empRole] || [];

      // 🔥 Access Token (short-lived)
      const accessToken = jwt.sign(
        {
          id: employee._id,
          empName: employee.empName,
          empEmail: employee.empEmail,
          department: employee.empDepartment,
          role: employee.empRole,
          permissions: permissions,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" },
      );

      //cookies
      res.cookie("token", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      });

      return res.redirect("/dashboard");
    } catch (error) {
      console.error(error);
      return res.render("index", { error: "Login failed. Try again." });
    }
  }

  // POST /auth/register
  async empRegister(req, res) {
    try {
      const { empName, empEmail, empPassword, empDepartment, empRole } =
        req.body;

      const existing = await Employee.findOne({ empEmail });
      if (existing) {
        return res.render("register", { error: "Email already registered" });
      }

      //HASH PASSWORD
      const hashedPassword = await bcrypt.hash(empPassword, 10);

      await Employee.create({
        empName,
        empEmail,
        empPassword: hashedPassword, //store hashed
        empDepartment,
        empRole: empRole || "employee",
      });

      return res.redirect("/");
    } catch (error) {
      return res.render("register", {
        error: "Registration failed. Try again.",
      });
    }
  }

  // POST /logout
  logout(req, res) {
    res.clearCookie("token");
    res.redirect("/");
  }

  // POST /records-view/create
  async CreateRecord(req, res) {
    try {
      const permissions = ROLE_PERMISSIONS[req.user.role] || [];
      if (!permissions.includes("create_record")) {
        const records = await Record.find({}).sort({ createdAt: -1 });
        return res.render("records", {
          user: req.user,
          permissions,
          records,
          error: "Not allowed to create records",
          success: null,
        });
      }
      await Record.create({
        title: req.body.title,
        description: req.body.description,
        createdBy: req.user.id,
        createdByName: req.user.empName,
        createdByRole: req.user.role,
      });
      const records = await Record.find({}).sort({ createdAt: -1 });
      return res.render("records", {
        user: req.user,
        permissions,
        records,
        error: null,
        success: "Record created successfully!",
      });
    } catch (error) {
      const permissions = ROLE_PERMISSIONS[req.user.role] || [];
      const records = await Record.find({}).sort({ createdAt: -1 });
      return res.render("records", {
        user: req.user,
        permissions,
        records,
        error: "Failed to create record",
        success: null,
      });
    }
  }

  // POST /records-view/delete/:id
  async DeleteRecord(req, res) {
    try {
      const permissions = ROLE_PERMISSIONS[req.user.role] || [];
      if (!permissions.includes("delete_record")) {
        const records = await Record.find({}).sort({ createdAt: -1 });
        return res.render("records", {
          user: req.user,
          permissions,
          records,
          error: "Not allowed to delete records",
          success: null,
        });
      }
      await Record.findByIdAndDelete(req.params.id);
      return res.redirect("/records-view");
    } catch (error) {
      return res.redirect("/records-view");
    }
  }

  // POST /records-view/update/:id
  async UpdateRecord(req, res) {
    try {
      const permissions = ROLE_PERMISSIONS[req.user.role] || [];
      if (!permissions.includes("update_record")) {
        const records = await Record.find({}).sort({ createdAt: -1 });
        return res.render("records", {
          user: req.user,
          permissions,
          records,
          error: "Not allowed to update records",
          success: null,
        });
      }
      await Record.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        description: req.body.description,
      });
      return res.redirect("/records-view");
    } catch (error) {
      return res.redirect("/records-view");
    }
  }
}

module.exports = new ViewController();
