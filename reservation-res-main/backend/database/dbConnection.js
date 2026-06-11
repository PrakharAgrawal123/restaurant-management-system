import mongoose from "mongoose";
import { seedData } from "../utils/seeder.js";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "RESERVATIONS",
    })
    .then(() => {
      console.log("Connected to database!");
      seedData(); // Run auto-seeding
    })
    .catch((err) => {
      console.log(`Some error occured while connecing to database: ${err}`);
    });
};


