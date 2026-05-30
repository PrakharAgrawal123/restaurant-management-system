import React from "react";

const MenuCard = ({ item, onAddToCart }) => {
  return (
    <div className="menu-card">
      <img src={item.image} alt={item.name} />
      <div className="menu-info">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className="menu-footer">
          <span className="price">${item.price}</span>
          <button 
            className="add-to-cart-btn" 
            onClick={() => onAddToCart(item)}
            disabled={!item.isAvailable}
          >
            {item.isAvailable ? "Add to Cart" : "Sold Out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
