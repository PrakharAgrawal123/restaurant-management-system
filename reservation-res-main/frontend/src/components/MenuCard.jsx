import React from "react";
import { Link } from "react-router-dom";
import { Star, Flame, Clock, Plus, Check } from "lucide-react";
import { useCart } from "../context/CartContext";

const MenuCard = ({ item, onAddToCart }) => {
  const { cart } = useCart();
  const isInCart = cart.some((c) => c._id === item._id);
  const cartItem = cart.find((c) => c._id === item._id);

  return (
    <div className="menu-card">
      <div className="menu-card-image-wrapper">
        <img src={item.image} alt={item.name} className="menu-card-img" />
        <span className="menu-card-category">{item.category}</span>
        {item.tag && item.tag !== "None" && (
          <span className={`menu-card-tag ${item.tag.toLowerCase().replace(/\s+/g, '-')}`}>
            {item.tag}
          </span>
        )}
      </div>

      <div className="menu-info">
        <div className="menu-card-header">
          <h3>{item.name}</h3>
          <span className="price">${item.price.toFixed(2)}</span>
        </div>

        <div className="menu-card-meta">
          <div className="meta-rating">
            <Star size={13} className="star-icon-filled" />
            <span>{item.rating || 4.5}</span>
          </div>
          {item.calories && (
            <div className="meta-calories">
              <Flame size={13} className="flame-icon-filled" />
              <span>{item.calories} kcal</span>
            </div>
          )}
          {item.prepTime && (
            <div className="meta-time">
              <Clock size={13} className="time-icon-filled" />
              <span>{item.prepTime}</span>
            </div>
          )}
        </div>

        <p className="menu-card-desc">
          {item.description.length > 70 
            ? `${item.description.slice(0, 70)}...` 
            : item.description}
        </p>

        <div className="menu-footer">
          <Link to={`/menu/${item._id}`} className="explore-card-link">
            Explore Details
          </Link>
          <button 
            className={`add-to-cart-btn ${isInCart ? "added" : ""}`} 
            onClick={() => onAddToCart(item)}
            disabled={!item.isAvailable}
          >
            {isInCart ? (
              <>
                <Check size={14} /> In Cart ({cartItem.quantity})
              </>
            ) : (
              <>
                <Plus size={14} /> {item.isAvailable ? "Add" : "Sold"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
