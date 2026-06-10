import { Branch } from "../models/branch.js";
import { Table } from "../models/table.js";
import { Menu } from "../models/menu.js";

export const seedData = async () => {
  try {
    // 1. Seed Branches
    const branchCount = await Branch.countDocuments();
    let seededBranches = [];

    if (branchCount === 0) {
      console.log("Seeding default branches...");
      seededBranches = await Branch.create([
        {
          name: "Downtown Gourmet",
          location: "New York",
          address: "123 Main St, New York, NY 10001",
          phone: "212-555-0199",
          email: "downtown@yums.com",
          openingHours: "09:00 AM - 11:00 PM",
          image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop"
        },
        {
          name: "Miami Beach Bistro",
          location: "Miami",
          address: "456 Ocean Dr, Miami Beach, FL 33139",
          phone: "305-555-0120",
          email: "miami@yums.com",
          openingHours: "10:00 AM - 12:00 AM",
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop"
        },
        {
          name: "Lakeside Grill",
          location: "Chicago",
          address: "789 Michigan Ave, Chicago, IL 60611",
          phone: "312-555-0143",
          email: "chicago@yums.com",
          openingHours: "08:00 AM - 10:00 PM",
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=600&auto=format&fit=crop"
        }
      ]);
      console.log(`Seeded ${seededBranches.length} branches successfully.`);
    } else {
      seededBranches = await Branch.find();
    }

    // 2. Seed Tables for each Branch
    const tableCount = await Table.countDocuments();
    if (tableCount === 0 && seededBranches.length > 0) {
      console.log("Seeding default tables...");
      const tablesToCreate = [];
      seededBranches.forEach((branch) => {
        // Create 8 tables for each branch
        for (let i = 1; i <= 8; i++) {
          let capacity = 2;
          if (i > 4) capacity = 4;
          if (i > 6) capacity = 6;
          
          tablesToCreate.push({
            tableNumber: `${i}`,
            capacity,
            branch: branch._id,
            status: "Available",
            position: {
              x: (i - 1) % 4,
              y: Math.floor((i - 1) / 4)
            }
          });
        }
      });
      await Table.create(tablesToCreate);
      console.log(`Seeded ${tablesToCreate.length} tables successfully.`);
    }

    // 3. Seed Menu Items
    const menuCount = await Menu.countDocuments();
    if (menuCount === 0) {
      console.log("Seeding default menu items...");
      await Menu.create([
        {
          name: "Roasted Lamb Rump",
          description: "Tender lamb served with seasonal root vegetables and rich red wine jus.",
          price: 28.5,
          category: "Main Course",
          image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop",
          isAvailable: true
        },
        {
          name: "Citrus Cured Salmon",
          description: "Fresh Atlantic salmon cured with citrus zest, served with dill cream.",
          price: 18.0,
          category: "Appetizers",
          image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=400&auto=format&fit=crop",
          isAvailable: true
        },
        {
          name: "Pan Seared Sea Bass",
          description: "Crispy skin sea bass on a bed of braised leeks and white wine sauce.",
          price: 32.0,
          category: "Main Course",
          image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400&auto=format&fit=crop",
          isAvailable: true
        },
        {
          name: "Stuffed Strawberry Crepe",
          description: "Warm crepes stuffed with sweet strawberries, mascarpone, and chocolate drizzle.",
          price: 9.5,
          category: "Desserts",
          image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=400&auto=format&fit=crop",
          isAvailable: true
        },
        {
          name: "Truffle Fries",
          description: "Crispy golden fries tossed in white truffle oil and parmesan cheese.",
          price: 7.5,
          category: "Sides",
          image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=400&auto=format&fit=crop",
          isAvailable: true
        },
        {
          name: "Premium Mocktail",
          description: "Fresh fruit blend with mint and sparkling water.",
          price: 6.0,
          category: "Beverages",
          image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=400&auto=format&fit=crop",
          isAvailable: true
        }
      ]);
      console.log("Seeded menu items successfully.");
    }
  } catch (error) {
    console.error("Error seeding database:", error.message);
  }
};
