import React from "react";
import { data } from "../restApi.json";
import { motion } from "framer-motion";

const Team = () => {
  return (
    <section className="team" id="team">
      <div className="container">
        <div className="heading_section">
          <h1 className="heading">OUR TEAM</h1>
          <p>
            Meet the passionate team behind every unforgettable experience.
          </p>
        </div>
        <div className="team_container">
          {data[0].team.map((element, index) => {
            return (
              <motion.div 
                className="card" 
                key={element.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <img src={element.image} alt={element.name} />
                <h3>{element.name}</h3>
                <p>{element.designation}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Team;
