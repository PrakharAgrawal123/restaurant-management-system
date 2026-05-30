import { Reservation } from "../models/reservation.js";
import { Order } from "../models/order.js";
import { User } from "../models/user.js";

// Get Admin Analytics
export const getAdminAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalReservations = await Reservation.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue from completed orders
    const orders = await Order.find({ paymentStatus: "Paid" });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    // Get reservation stats by status
    const reservationStats = await Reservation.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Get order stats by status
    const orderStats = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Peak booking timings (simple aggregation by hour)
    const peakTimings = await Reservation.aggregate([
      {
        $group: {
          _id: "$time",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalReservations,
        totalOrders,
        totalRevenue,
        reservationStats,
        orderStats,
        peakTimings
      }
    });
  } catch (error) {
    return next(error);
  }
};
