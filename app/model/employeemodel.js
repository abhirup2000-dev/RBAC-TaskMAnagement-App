const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema(
  {
    empName: {
      type: String,
      required: true,
    },
    empEmail: {
      type: String,
      required: true,
      unique: true,
    },
    empPassword: {
      type: String,
      required: true,
    },
    empDepartment: {
      type: String,
      required: true,
    },
    empRole: {
      type: String,
      enum: ["admin", "manager", "employee"],
      required: true,
    },
  },
  { timestamps: true },
);

const Employee = mongoose.model("Employee_model", EmployeeSchema);

module.exports = Employee;
