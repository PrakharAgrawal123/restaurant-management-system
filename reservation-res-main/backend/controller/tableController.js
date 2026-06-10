import { Table } from "../models/table.js";
import { Reservation } from "../models/reservation.js";
import ErrorHandler from "../middlewares/error.js";

// Get Tables by Branch & Availability
export const getTablesByBranchAndAvailability = async (req, res, next) => {
  const { branchId } = req.params;
  const { date, time } = req.query;

  try {
    if (!branchId) {
      return next(new ErrorHandler("Branch ID is required", 400));
    }

    // Fetch all tables for the branch
    const tables = await Table.find({ branch: branchId });

    // If date and time are provided, check which tables are reserved
    if (date && time) {
      const activeReservations = await Reservation.find({
        branch: branchId,
        date,
        time,
        status: { $in: ["Pending", "Confirmed"] },
      });

      const reservedTableIds = activeReservations
        .map((resv) => resv.table?.toString())
        .filter(Boolean);

      const updatedTables = tables.map((t) => {
        const isReserved = reservedTableIds.includes(t._id.toString());
        return {
          ...t.toObject(),
          status: isReserved ? "Reserved" : t.status,
        };
      });

      return res.status(200).json({
        success: true,
        tables: updatedTables,
      });
    }

    res.status(200).json({
      success: true,
      tables,
    });
  } catch (error) {
    next(error);
  }
};

// Create a Table (Admin)
export const createTable = async (req, res, next) => {
  const { tableNumber, capacity, branch, position } = req.body;
  try {
    if (!tableNumber || !capacity || !branch) {
      return next(new ErrorHandler("Please fill all table details", 400));
    }

    const table = await Table.create({
      tableNumber,
      capacity,
      branch,
      position,
    });

    res.status(201).json({
      success: true,
      table,
    });
  } catch (error) {
    next(error);
  }
};
