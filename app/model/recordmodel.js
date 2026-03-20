const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecordSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee_model",
      required: true,
    },
    createdByName: {
      type: String,
      required: true,
    },
    createdByRole: {
      type: String,
      enum: ["admin", "manager", "employee"],
      required: true,
    },
  },
  { timestamps: true },
);

const Record = mongoose.model("Record_model", RecordSchema);
module.exports = Record;
