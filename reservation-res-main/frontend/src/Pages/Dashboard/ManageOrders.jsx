import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchFilter from "../../components/SearchFilter";
import toast from "react-hot-toast";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/v1/order/admin/all", {
        withCredentials: true,
      });
      setOrders(data.orders);
      setFilteredOrders(data.orders);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:4000/api/v1/order/admin/update/${id}`, 
        { status: newStatus }, 
        { withCredentials: true }
      );
      toast.success("Order status updated");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleSearch = (query) => {
    const filtered = orders.filter(order => 
      order.user?.name.toLowerCase().includes(query.toLowerCase()) ||
      order._id.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  const handleFilter = (status) => {
    if (status === "All") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === status));
    }
  };

  if (loading) return <div>Loading Orders...</div>;

  return (
    <div className="manage-orders-container">
      <h2>Manage Food Orders</h2>
      
      <SearchFilter 
        onSearch={handleSearch} 
        onFilter={handleFilter} 
        filterOptions={["Pending", "Preparing", "Served", "Completed", "Cancelled"]}
        placeholder="Search by customer name or Order ID..."
      />

      <div className="orders-table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Branch</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id}>
                <td>#{order._id.slice(-6)}</td>
                <td>{order.user?.name}</td>
                <td>{order.branch?.name}</td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>
                  <span className={`status-pill ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <span className={`payment-pill ${order.paymentStatus.toLowerCase()}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td>
                  <select 
                    className="action-select"
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Served">Served</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;
