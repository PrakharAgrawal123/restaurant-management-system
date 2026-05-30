import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarView.css";

const CalendarView = ({ reservations }) => {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  const formattedDate = date.toISOString().split("T")[0];
  const filteredReservations = reservations.filter(res => res.date === formattedDate);

  // Helper to mark dates with reservations
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const d = date.toISOString().split("T")[0];
      const count = reservations.filter(res => res.date === d).length;
      if (count > 0) {
        return <div className="dot-container"><div className="dot"></div></div>;
      }
    }
    return null;
  };

  return (
    <div className="calendar-view-container">
      <div className="calendar-wrapper">
        <Calendar 
          onChange={onChange} 
          value={date} 
          tileContent={tileContent}
        />
      </div>
      <div className="reservations-list-side">
        <h3>Bookings for {formattedDate}</h3>
        {filteredReservations.length === 0 ? (
          <p className="no-bookings">No bookings for this date.</p>
        ) : (
          <div className="mini-res-list">
            {filteredReservations.map(res => (
              <div key={res._id} className="mini-res-card">
                <div className="mini-res-header">
                  <strong>{res.firstName} {res.lastName}</strong>
                  <span className={`status-badge ${res.status.toLowerCase()}`}>{res.status}</span>
                </div>
                <div className="mini-res-body">
                  <span>{res.time}</span> • <span>{res.numberOfGuests} Guests</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
