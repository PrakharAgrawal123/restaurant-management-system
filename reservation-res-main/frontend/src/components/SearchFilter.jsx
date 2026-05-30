import React from "react";
import { Search, Filter } from "lucide-react";

const SearchFilter = ({ onSearch, onFilter, filterOptions, placeholder }) => {
  return (
    <div className="search-filter-wrapper">
      <div className="search-box">
        <Search size={20} />
        <input 
          type="text" 
          placeholder={placeholder || "Search..."} 
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="filter-box">
        <Filter size={20} />
        <select onChange={(e) => onFilter(e.target.value)}>
          <option value="All">All Status</option>
          {filterOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchFilter;
