import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { motion } from "framer-motion";

const Success = () => {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setInterval(() => {
      setCountdown((preCount) => {
        if (preCount === 1) {
          clearInterval(timeoutId);
          navigate("/");
        }
        return preCount - 1;
      });
    }, 1000);
    return () => clearInterval(timeoutId);
  }, [navigate]);

  return (
    <section className="success-page">
      <motion.div 
        className="container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img src="/sandwich.png" alt="success" />
        <h1>Reservation Successful!</h1>
        <p>Your request has been sent. Redirecting to home in {countdown} seconds...</p>
        <div className="success-links">
          <Link to={"/"}>
            Back to Home <HiOutlineArrowNarrowRight />
          </Link>
          <Link to={"/dashboard"} className="secondary-link">
            View My Reservations
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default Success;