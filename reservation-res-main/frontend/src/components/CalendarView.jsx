import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarView.css";
import { Clock, MapPin, User, Users, ClipboardList } from "lucide-react";

const CalendarView = ({ reservations, onUpdateStatus }) => {
  const [date, setDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");
  const [selectedResId, setSelectedResId] = useState(null);

  const onChange = (newDate) => {
    setDate(newDate);
    setSelectedResId(null); // Clear selection on date change
  };

  // Safe timezone-independent formatted date
  const formattedDate = date.toLocaleDateString('sv-SE'); // returns YYYY-MM-DD

  // Filter reservations for the selected date
  const dateReservations = reservations.filter((res) => res.date === formattedDate);

  // Apply filters on top of the date reservations
  const filteredReservations = dateReservations.filter((res) => {
    const matchesStatus = statusFilter === "All" || res.status === statusFilter;
    const matchesBranch = branchFilter === "All" || res.branch?.name === branchFilter;
    return matchesStatus && matchesBranch;
  });

  // Get unique branches for the current date's reservations for filter dropdown
  const uniqueBranches = Array.from(
    new Set(dateReservations.map((res) => res.branch?.name).filter(Boolean))
  );

  // Find the currently selected reservation details
  const selectedRes = reservations.find((r) => r._id === selectedResId);

  // Helper to mark dates with reservations
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const d = date.toLocaleDateString('sv-SE');
      const dayReservations = reservations.filter((res) => res.date === d);
      const pendingCount = dayReservations.filter(r => r.status === "Pending").length;
      const confirmedCount = dayReservations.filter(r => r.status === "Confirmed").length;
      
      if (dayReservations.length > 0) {
        return (
          <div className="dot-container">
            {pendingCount > 0 && <span className="dot pending-dot"></span>}
            {confirmedCount > 0 && <span className="dot confirmed-dot"></span>}
            {dayReservations.length - pendingCount - confirmedCount > 0 && <span className="dot other-dot"></span>}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="calendar-view-container">
      <div className="calendar-wrapper">
        <h3 style={{ marginBottom: "15px" }}>Select Date</h3>
        <Calendar 
          onChange={onChange} 
          value={date} 
          tileContent={tileContent}
        />
      </div>

      <div className="reservations-list-side">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h3>Bookings for {formattedDate}</h3>
          <span style={{ fontSize: "0.9rem", color: "var(--secondary-text)" }}>
            ({filteredReservations.length} of {dateReservations.length} found)
          </span>
        </div>

        {/* Filters */}
        {dateReservations.length > 0 && (
          <div className="calendar-filters">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="calendar-filter-select"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select 
              value={branchFilter} 
              onChange={(e) => setBranchFilter(e.target.value)}
              className="calendar-filter-select"
            >
              <option value="All">All Branches</option>
              {uniqueBranches.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        )}

        {filteredReservations.length === 0 ? (
          <div className="no-bookings-placeholder">
            <ClipboardList size={32} />
            <p>No reservations matching criteria on this day.</p>
          </div>
        ) : (
          <div className="mini-res-list">
            {filteredReservations.map((res) => (
              <div 
                key={res._id} 
                className={`mini-res-card ${selectedResId === res._id ? "selected" : ""}`}
                onClick={() => setSelectedResId(res._id)}
              >
                <div className="mini-res-header">
                  <strong>{res.firstName} {res.lastName}</strong>
                  <span className={`status-badge ${res.status.toLowerCase()}`}>{res.status}</span>
                </div>
                <div className="mini-res-body">
                  <span><Clock size={12} style={{ display: "inline", marginRight: "4px" }} /> {res.time}</span>
                  <span> • </span>
                  <span><Users size={12} style={{ display: "inline", marginRight: "4px" }} /> {res.numberOfGuests} Guests</span>
                  <span> • </span>
                  <span>Table {res.table?.tableNumber || "N/A"}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reservation management details */}
        {selectedRes && (
          <div className="calendar-selected-details">
            <h4>Manage Booking Details</h4>
            <div className="detail-row">
              <User size={16} />
              <span>{selectedRes.firstName} {selectedRes.lastName} ({selectedRes.email})</span>
            </div>
            <div className="detail-row">
              <MapPin size={16} />
              <span>{selectedRes.branch?.name} - {selectedRes.branch?.location}</span>
            </div>
            <div className="detail-row">
              <Clock size={16} />
              <span>{selectedRes.date} at {selectedRes.time}</span>
            </div>
            <div className="detail-status-update">
              <label>Update Status:</label>
              <select 
                value={selectedRes.status}
                onChange={(e) => onUpdateStatus(selectedRes._id, e.target.value)}
                className="status-dropdown-update"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
