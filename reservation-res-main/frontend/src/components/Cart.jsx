import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";

const Cart = ({ cartItems, onUpdateQuantity, onRemove, onPlaceOrder, total }) => {
  if (cartItems.length === 0) {
    return <div className="empty-cart">Your cart is empty</div>;
  }

  return (
    <div className="cart-container">
      <h3>Your Order</h3>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item._id} className="cart-item">
            <div className="item-details">
              <h4>{item.name}</h4>
              <span>${item.price}</span>
            </div>
            <div className="item-actions">
              <div className="quantity-controls">
                <button onClick={() => onUpdateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}>
                  <Plus size={16} />
                </button>
              </div>
              <button className="remove-btn" onClick={() => onRemove(item._id)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <div className="cart-total">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button className="place-order-btn" onClick={onPlaceOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Cart;
