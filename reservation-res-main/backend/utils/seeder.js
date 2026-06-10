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
    let menuCount = await Menu.countDocuments();
    const legacyCheck = await Menu.findOne({ rating: { $exists: true } });
    if (menuCount > 0 && !legacyCheck) {
      console.log("Legacy menu items found. Deleting and re-seeding with upgraded schema...");
      await Menu.deleteMany({});
      menuCount = 0;
    }

    if (menuCount === 0) {
      console.log("Seeding default menu items...");
      await Menu.create([
        {
          name: "Roasted Lamb Rump",
          description: "Tender lamb served with seasonal root vegetables and rich red wine jus.",
          price: 28.5,
          category: "Dinner",
          image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop",
          isAvailable: true,
          rating: 4.8,
          prepTime: "25 mins",
          calories: 620,
          ingredients: ["Premium Lamb Rump", "Rosemary", "Garlic cloves", "Red wine", "Olive oil", "Baby carrots", "Parsnips"],
          nutritionalInfo: { protein: "42g", fat: "28g", carbs: "12g", fiber: "3g" },
          chefRecommendation: "Pairs best with a dry Cabernet Sauvignon or a full-bodied Merlot.",
          servingSize: "1 plate (350g)",
          allergens: ["None"],
          reviews: [
            { username: "Alice Cooper", rating: 5, comment: "The lamb was cooked to absolute perfection! So tender and juicy.", date: new Date("2026-05-15") },
            { username: "David Miller", rating: 4.5, comment: "Loved the rosemary and red wine jus. Extremely savory.", date: new Date("2026-05-20") }
          ],
          aboutDish: "Our Roasted Lamb Rump is selected from local grass-fed organic farms. Slowly seared to lock in natural juices, and roasted to medium-rare perfection. Glazed in a home-cooked red wine jus that simmered for 12 hours.",
          whyLove: "Customers adore this dish for its melt-in-the-mouth texture and rich earthy tones that make for a satisfying, comforting dinner.",
          chefNotes: "Letting the meat rest for exactly 7 minutes before carving makes all the difference. It preserves all the flavor and keeps it exceptionally tender.",
          tag: "Best Seller"
        },
        {
          name: "Citrus Cured Salmon",
          description: "Fresh Atlantic salmon cured with citrus zest, served with dill cream.",
          price: 18.0,
          category: "Appetizers",
          image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=400&auto=format&fit=crop",
          isAvailable: true,
          rating: 4.7,
          prepTime: "15 mins",
          calories: 340,
          ingredients: ["Atlantic Salmon", "Orange zest", "Lemon juice", "Fresh dill", "Sea salt", "Cracked pepper", "Sour cream"],
          nutritionalInfo: { protein: "26g", fat: "14g", carbs: "8g", fiber: "1g" },
          chefRecommendation: "Enjoy with a chilled glass of Sauvignon Blanc or Pinot Grigio.",
          servingSize: "1 plate (200g)",
          allergens: ["Fish", "Dairy"],
          reviews: [
            { username: "Sophie Turner", rating: 5, comment: "The orange and lemon zest really brightness up the salmon flavor. Fresh and beautiful!", date: new Date("2026-06-01") },
            { username: "Liam N.", rating: 4, comment: "Excellent appetizer. Dill cream has a great tanginess.", date: new Date("2026-06-03") }
          ],
          aboutDish: "Hand-sliced Atlantic salmon cured in a dry rub of kosher salt, sugar, orange zest, and lemon peel for 24 hours. Served cold with a house-crafted whipped sour cream infused with fresh dill.",
          whyLove: "It is light, clean, and perfectly balanced, providing a delightful acidity that whets the appetite for the main course.",
          chefNotes: "We use organic blood oranges when in season to give the cure a slightly sweeter, berry-like hint.",
          tag: "Chef Recommended"
        },
        {
          name: "Pan Seared Sea Bass",
          description: "Crispy skin sea bass on a bed of braised leeks and white wine sauce.",
          price: 32.0,
          category: "Breakfast",
          image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400&auto=format&fit=crop",
          isAvailable: true,
          rating: 4.9,
          prepTime: "20 mins",
          calories: 410,
          ingredients: ["Chilean Sea Bass", "Leeks", "White wine", "Unsalted butter", "Garlic", "Lemon zest", "Thyme"],
          nutritionalInfo: { protein: "34g", fat: "18g", carbs: "10g", fiber: "2g" },
          chefRecommendation: "Complements a dry Chardonnay or sparkling mineral water with lime.",
          servingSize: "1 plate (300g)",
          allergens: ["Fish", "Dairy"],
          reviews: [
            { username: "Robert Downey", rating: 5, comment: "Hands down the best sea bass I have ever eaten. The skin is incredibly crispy!", date: new Date("2026-05-28") },
            { username: "Emma Watson", rating: 5, comment: "The white wine butter sauce is divine. I wanted to lick the plate clean.", date: new Date("2026-05-29") }
          ],
          aboutDish: "Succulent sea bass fillet, pan-seared skin-down to create a thin, crispy crust while keeping the flakey fish underneath perfectly tender. Rested on a creamy bed of slowly braised sweet leeks.",
          whyLove: "Known for its buttery richness and crispy texture, this dish is a premium breakfast favorite that feels elegant and light.",
          chefNotes: "Make sure the pan is smoking hot before adding the fish, skin side down, and press gently for the first 30 seconds.",
          tag: "Trending"
        },
        {
          name: "Stuffed Strawberry Crepe",
          description: "Warm crepes stuffed with sweet strawberries, mascarpone, and chocolate drizzle.",
          price: 9.5,
          category: "Desserts",
          image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=400&auto=format&fit=crop",
          isAvailable: true,
          rating: 4.6,
          prepTime: "12 mins",
          calories: 290,
          ingredients: ["All-purpose flour", "Milk", "Eggs", "Fresh strawberries", "Mascarpone cheese", "Dark chocolate", "Powdered sugar"],
          nutritionalInfo: { protein: "8g", fat: "12g", carbs: "38g", fiber: "3g" },
          chefRecommendation: "Pair with an Espresso, Macchiato, or sweet dessert wine.",
          servingSize: "2 crepes",
          allergens: ["Dairy", "Gluten", "Eggs"],
          reviews: [
            { username: "Jessica Alba", rating: 4.5, comment: "Delightfully sweet! The mascarpone filling is rich but not overwhelming.", date: new Date("2026-06-02") },
            { username: "Michael B.", rating: 5, comment: "Absolute heaven in every bite. The fresh strawberries are so sweet.", date: new Date("2026-06-05") }
          ],
          aboutDish: "Thin French crepes cooked golden brown, stuffed with a decadent filling of sweetened whipped Italian mascarpone cheese and freshly sliced strawberries, finished with a heavy drizzle of warm Belgian dark chocolate.",
          whyLove: "A perfect sweet treat that satisfies dessert cravings with fresh fruit freshness and creamy luxury.",
          chefNotes: "We whip a touch of orange blossom water into the mascarpone to give the filling a subtle floral note.",
          tag: "New Arrival"
        },
        {
          name: "Beef Burger Meal",
          description: "Juicy beef patty with cheddar cheese, caramelized onions, house sauce, and fries.",
          price: 16.5,
          category: "Lunch",
          image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop",
          isAvailable: true,
          rating: 4.8,
          prepTime: "18 mins",
          calories: 820,
          ingredients: ["Angus Beef Patty", "Brioche Bun", "Cheddar Cheese", "Caramelized Onions", "House Burger Sauce", "Lettuce", "Russet Potatoes"],
          nutritionalInfo: { protein: "48g", fat: "38g", carbs: "65g", fiber: "5g" },
          chefRecommendation: "Excellent with a cold lager or a classic lemonade.",
          servingSize: "1 burger + side fries",
          allergens: ["Gluten", "Dairy", "Eggs"],
          reviews: [
            { username: "John Smith", rating: 5, comment: "Proper gourmet burger! Thick patty, very juicy, cheese is perfectly melted.", date: new Date("2026-05-10") },
            { username: "Emily R.", rating: 4, comment: "Caramelized onions make the burger. Fries were super crispy too.", date: new Date("2026-05-18") }
          ],
          aboutDish: "A premium 200g flame-grilled Angus beef patty topped with sharp melted cheddar, sweet slow-cooked caramelized onions, crisp lettuce, and our secret recipe smoky house sauce, all inside a toasted buttery brioche bun.",
          whyLove: "A classic done exceptionally well. It's the ultimate comforting, hearty lunch that guarantees satisfaction.",
          chefNotes: "We grind our beef fresh daily using a custom 80/20 chuck to brisket blend for optimal juiciness and texture.",
          tag: "Best Seller"
        },
        {
          name: "Mussels Soup",
          description: "Fresh mussels cooked in white wine, garlic, and cream broth, served with crusty bread.",
          price: 21.0,
          category: "Appetizers",
          image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=400&auto=format&fit=crop",
          isAvailable: true,
          rating: 4.5,
          prepTime: "15 mins",
          calories: 280,
          ingredients: ["Black Mussels", "White Wine", "Heavy Cream", "Garlic", "Shallots", "Parsley", "Baguette slice"],
          nutritionalInfo: { protein: "22g", fat: "14g", carbs: "15g", fiber: "1g" },
          chefRecommendation: "Enjoy with a dry French Muscadet or mineral water.",
          servingSize: "1 bowl (400g)",
          allergens: ["Shellfish", "Dairy", "Gluten"],
          reviews: [
            { username: "Charles L.", rating: 4, comment: "Broad garlic flavors. Make sure to use the bread to dip in the broth!", date: new Date("2026-04-20") },
            { username: "Sarah K.", rating: 5, comment: "Mussels were very clean and sweet. The cream broth is outstanding.", date: new Date("2026-05-02") }
          ],
          aboutDish: "Freshly harvested blue mussels steamed in a fragrant broth of white wine, crushed garlic cloves, sweet minced shallots, and fresh cream, finished with a handful of chopped flat-leaf Italian parsley.",
          whyLove: "Loved for the rich, buttery herbal broth that perfectly complements the briny, sweet taste of fresh mussels.",
          chefNotes: "Discard any mussels that do not open during the steaming process—this is essential for food safety.",
          tag: "None"
        },
        {
          name: "Italian Spaghetti",
          description: "Al dente spaghetti tossed in rich house marinara sauce, fresh basil, and parmesan.",
          price: 19.5,
          category: "Dinner",
          image: "https://images.unsplash.com/photo-1563379971899-660589a01cc3?q=80&w=400&auto=format&fit=crop",
          isAvailable: true,
          rating: 4.8,
          prepTime: "20 mins",
          calories: 510,
          ingredients: ["Spaghetti", "San Marzano tomatoes", "Olive oil", "Garlic", "Fresh basil leaves", "Parmigiano-Reggiano"],
          nutritionalInfo: { protein: "18g", fat: "11g", carbs: "78g", fiber: "4g" },
          chefRecommendation: "Pairs beautifully with Chianti Classico or sparkling water.",
          servingSize: "1 plate (320g)",
          allergens: ["Gluten", "Dairy"],
          reviews: [
            { username: "Laura M.", rating: 5, comment: "Classic done perfectly. The sauce has that rich, slow-simmered taste.", date: new Date("2026-05-11") },
            { username: "Tony S.", rating: 4.5, comment: "As good as my grandmother used to make. Fresh basil makes a huge difference.", date: new Date("2026-05-19") }
          ],
          aboutDish: "Traditional Italian pasta served al dente, tossed in a slow-simmered marinara made from imported sweet San Marzano tomatoes, extra virgin olive oil, garlic, and freshly torn basil. Topped with aged Parmigiano-Reggiano.",
          whyLove: "A universally loved, comforting Italian masterpiece that highlights simple, high-quality ingredients.",
          chefNotes: "We finish cooking the pasta directly inside the sauce pan with a splash of starchy pasta water to ensure the sauce emulsifies and clings to the spaghetti.",
          tag: "Trending"
        },
        {
          name: "Grilled Fish",
          description: "Whole grilled sea bream seasoned with lemon, oregano, and garlic olive oil.",
          price: 26.0,
          category: "Dinner",
          image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?q=80&w=400&auto=format&fit=crop",
          isAvailable: true,
          rating: 4.6,
          prepTime: "22 mins",
          calories: 380,
          ingredients: ["Sea Bream", "Lemon juice", "Wild Greek oregano", "Garlic cloves", "Extra virgin olive oil", "Sea salt"],
          nutritionalInfo: { protein: "38g", fat: "16g", carbs: "2g", fiber: "0g" },
          chefRecommendation: "Complements a dry Pinot Grigio or iced herbal tea.",
          servingSize: "1 whole fish",
          allergens: ["Fish"],
          reviews: [
            { username: "Lucas G.", rating: 5, comment: "Very smoky flavor from the grill. Super fresh and clean seasoning.", date: new Date("2026-05-04") },
            { username: "Anna P.", rating: 4, comment: "Tastes like Mediterranean summer. Simple but incredibly flavorful.", date: new Date("2026-05-12") }
          ],
          aboutDish: "Fresh, sustainably caught whole sea bream stuffed with lemon wheels and wild Greek oregano, grilled over charcoal for a smoky finish. Drizzled with lemon-herb emulsion.",
          whyLove: "Highly appreciated for its rustic preparation, moist texture, and clean, citrusy, charred flavor profile.",
          chefNotes: "Slash the skin of the fish three times on each side to ensure even cooking and to let the olive oil marinade penetrate deep.",
          tag: "None"
        }
      ]);
      console.log("Seeded menu items successfully.");
    }
  } catch (error) {
    console.error("Error seeding database:", error.message);
  }
};
