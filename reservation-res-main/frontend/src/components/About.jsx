import React from "react";
import { Link } from "react-scroll";
import { HiOutlineArrowRight } from "react-icons/hi";
import { motion } from "framer-motion";

const About = () => {
  return (
    <>
      <section className="about" id="about">
        <div className="container">
          <motion.div 
            className="banner"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="top">
              <h1 className="heading">ABOUT US</h1>
              <p>The only thing we're serious about is food.</p>
            </div>
            <p className="mid">
              Welcome to our restaurant — where food is not just served, it’s experienced.
              <br />
              We don’t believe in ordinary meals. Every dish we create is a blend of passion, precision, and a little bit of madness that turns simple ingredients into unforgettable flavors. From the moment you step in, you’re not just a customer — you become part of a story crafted with taste, creativity, and energy.

              Our kitchen runs on innovation. Our chefs experiment, explore, and push boundaries to bring you dishes that are bold, fresh, and full of personality. Whether it’s comfort food or something completely new, we make sure every bite leaves an impression.

              But we’re more than just food. We’re about vibes, moments, and memories. Late-night cravings, casual hangouts, celebrations, or just a quick escape from routine — this is your place.

              This is not just a restaurant.
              This is an experience you’ll keep coming back for.
            </p>
            <Link to={"menu"} spy={true} smooth={true} duration={500}>
              Explore Menu{" "}
              <span>
                <HiOutlineArrowRight />
              </span>
            </Link>
          </motion.div>
          <motion.div 
            className="banner"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img src="about.png" alt="about" />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default About;
