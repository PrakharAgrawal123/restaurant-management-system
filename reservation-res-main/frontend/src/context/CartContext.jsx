import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    const existing = cart.find((i) => i._id === item._id);
    if (existing) {
      setCart(
        cart.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast.success(`${item.name} added to cart`);
  };

  const updateQuantity = (id, q) => {
    if (q <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map((i) => (i._id === id ? { ...i, quantity: q } : i)));
    }
  };

  const removeFromCart = (id) => {
    const item = cart.find((i) => i._id === id);
    setCart(cart.filter((i) => i._id !== id));
    if (item) {
      toast.success(`${item.name} removed from cart`);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
