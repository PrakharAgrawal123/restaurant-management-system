import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import MenuCard from "../../components/MenuCard";
import Cart from "../../components/Cart";
import { useAuth } from "../../context/AuthContext";
import { ShoppingCart } from "lucide-react";

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/v1/menu/all");
        setMenuItems(data.menuItems);
      } catch (error) {
        toast.error("Failed to fetch menu");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const addToCart = (item) => {
    const existing = cart.find(i => i._id === item._id);
    if (existing) {
      setCart(cart.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast.success(`${item.name} added to cart`);
  };

  const updateQuantity = (id, q) => {
    setCart(cart.map(i => i._id === id ? { ...i, quantity: q } : i));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(i => i._id !== id));
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const placeOrder = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to place an order");
      return;
    }

    // In a real app, you'd let the user select a branch here too.
    // For this demo, I'll use a hardcoded branch or the first one.
    try {
      const branchesRes = await axios.get("http://localhost:5000/api/v1/branch/all");
      const branchId = branchesRes.data.branches[0]?._id;

      if (!branchId) {
        toast.error("No restaurant branches available");
        return;
      }

      await axios.post("http://localhost:5000/api/v1/order/new", {
        branch: branchId,
        items: cart.map(i => ({ menuItem: i._id, quantity: i.quantity })),
        orderType: "Dine-in"
      }, { withCredentials: true });

      toast.success("Order placed successfully!");
      setCart([]);
      setShowCart(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed");
    }
  };

  if (loading) return <div className="loading">Loading Menu...</div>;

  return (
    <div className="menu-page">
      <header className="menu-header">
        <h1>Our Menu</h1>
        <button className="cart-toggle-btn" onClick={() => setShowCart(!showCart)}>
          <ShoppingCart />
          <span className="cart-count">{cart.length}</span>
        </button>
      </header>

      <div className="menu-grid">
        {menuItems.map(item => (
          <MenuCard key={item._id} item={item} onAddToCart={addToCart} />
        ))}
      </div>

      {showCart && (
        <div className="cart-modal-overlay">
          <div className="cart-modal-content">
            <button className="close-cart" onClick={() => setShowCart(false)}>&times;</button>
            <Cart
              cartItems={cart}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
              onPlaceOrder={placeOrder}
              total={total}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
