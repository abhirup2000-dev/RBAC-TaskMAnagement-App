const Record = require("../model/recordmodel");
const statusCode = require("../utils/StatusCode");

class RecordController {
  async createRecord(req, res) {
    try {
      const data = {
        title: req.body.title,
        description: req.body.description,
        createdBy: req.user.id,
        createdByName: req.user.empName,
        createdByRole: req.user.role,
      };

      const createdRecord = await Record.create(data);
      if (createdRecord) {
        return res.status(statusCode.CREATED).json({
          success: true,
          message: "Record created successfully",
          record: createdRecord,
        });
      } else {
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          message: "Error creating record",
        });
      }
    } catch (error) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: "Error creating record",
        error: error.message,
      });
    }
  }

  async getAllRecords(req, res) {
    try {
      const records = await Record.find({}).sort({ createdAt: -1 });
      return res.status(statusCode.SUCCESS).json({
        success: true,
        message: "Records fetched successfully",
        records: records,
      });
    } catch (error) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: "Error fetching records",
        error: error.message,
      });
    }
  }

  async updateRecord(req, res) {
    try {
      const recordId = req.params.id;
      const updatedRecord = await Record.findByIdAndUpdate(
        recordId,
        { title: req.body.title, description: req.body.description },
        { new: true },
      );
      if (updatedRecord) {
        return res.status(statusCode.SUCCESS).json({
          success: true,
          message: "Record updated successfully",
          record: updatedRecord,
        });
      } else {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "Record not found",
        });
      }
    } catch (error) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: "Error updating record",
        error: error.message,
      });
    }
  }

  async deleteRecord(req, res) {
    try {
      const recordId = req.params.id;
      const deletedRecord = await Record.findByIdAndDelete(recordId);
      if (deletedRecord) {
        return res.status(statusCode.SUCCESS).json({
          success: true,
          message: "Record deleted successfully",
        });
      } else {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "Record not found",
        });
      }
    } catch (error) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: "Error deleting record",
        error: error.message,
      });
    }
  }
}

module.exports = new RecordController();
