import React from "react";
import "./TableLayout.css";

const TableLayout = ({ tables, selectedTable, onSelectTable }) => {
  return (
    <div className="table-layout-container">
      <h3>Select a Table</h3>
      <div className="restaurant-floor">
        {tables.map((table) => (
          <div
            key={table._id}
            className={`table-box ${table.status.toLowerCase()} ${
              selectedTable === table._id ? "selected" : ""
            }`}
            onClick={() => table.status === "Available" && onSelectTable(table._id)}
          >
            <span className="table-number">{table.tableNumber}</span>
            <span className="table-capacity">{table.capacity}p</span>
          </div>
        ))}
      </div>
      <div className="legend">
        <div className="legend-item"><div className="box available"></div> Available</div>
        <div className="legend-item"><div className="box reserved"></div> Reserved</div>
        <div className="legend-item"><div className="box selected"></div> Your Choice</div>
      </div>
    </div>
  );
};

export default TableLayout;
