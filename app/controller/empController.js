const Employee = require("../model/employeemodel");
const jwt = require("jsonwebtoken");
const { ROLE_PERMISSIONS } = require("../middleware/middleware");
const statusCode = require("../utils/StatusCode");

class EmployeeController {
  async createEmployee(req, res) {
    try {
      const role = req.body.empRole || "employee";
      const data = {
        empName: req.body.empName,
        empEmail: req.body.empEmail,
        empPassword: req.body.empPassword,
        empDepartment: req.body.empDepartment,
        empRole: role,
      };

      const empData = new Employee(data);
      const createdEmployee = await empData.save();

      if (createdEmployee) {
        return res.status(statusCode.CREATED).json({
          success: true,
          message: "Employee created successfully",
          employee: createdEmployee,
        });
      } else {
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          message: "Error creating employee",
        });
      }
    } catch (error) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: "Error creating employee",
        error: error.message,
      });
    }
  }

  async loginEmployee(req, res) {
    try {
      const { empEmail, empPassword } = req.body;

      if (!empEmail || !empPassword) {
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const employee = await Employee.findOne({ empEmail });
      if (!employee) {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "Employee not found",
        });
      }

      if (employee.empPassword !== empPassword) {
        return res.status(statusCode.UNAUTHORIZED).json({
          success: false,
          message: "Invalid password",
        });
      }

      const permissions = ROLE_PERMISSIONS[employee.empRole] || [];

      const token = jwt.sign(
        {
          id: employee._id,
          empName: employee.empName,
          empEmail: employee.empEmail,
          department: employee.empDepartment,
          role: employee.empRole,
          permissions: permissions,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" },
      );

      return res.status(statusCode.SUCCESS).json({
        success: true,
        message: "Employee logged in successfully",
        data: {
          id: employee._id,
          empName: employee.empName,
          empEmail: employee.empEmail,
          department: employee.empDepartment,
          role: employee.empRole,
          permissions: permissions,
        },
        token: token,
      });
    } catch (error) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: "Logging failed",
        error: error.message,
      });
    }
  }

  async getAllEmployees(req, res) {
    try {
      const employees = await Employee.find();
      return res.status(statusCode.SUCCESS).json({
        success: true,
        message: "Employees fetched successfully",
        employees: employees,
      });
    } catch (error) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: "Error fetching employees",
        error: error.message,
      });
    }
  }

  async updateEmployee(req, res) {
    try {
      const empId = req.params.id;
      const updatedEmployee = await Employee.findByIdAndUpdate(
        empId,
        req.body,
        { new: true },
      );
      if (updatedEmployee) {
        return res.status(statusCode.SUCCESS).json({
          success: true,
          message: "Employee updated successfully",
          employee: updatedEmployee,
        });
      } else {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "Employee not found",
        });
      }
    } catch (error) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: "Error updating employee",
        error: error.message,
      });
    }
  }

  async deleteEmployee(req, res) {
    try {
      const empId = req.params.id;
      const deletedEmployee = await Employee.findByIdAndDelete(empId);
      if (deletedEmployee) {
        return res.status(statusCode.SUCCESS).json({
          success: true,
          message: "Employee deleted successfully",
        });
      } else {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "Employee not found",
        });
      }
    } catch (error) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: "Error deleting employee",
        error: error.message,
      });
    }
  }
}

module.exports = new EmployeeController();
