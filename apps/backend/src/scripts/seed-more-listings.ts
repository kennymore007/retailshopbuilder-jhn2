import { ExecArgs } from "@medusajs/framework/types";
import { createVendorWorkflow } from "../workflows/vendor/create-vendor";
import { createListingWorkflow } from "../workflows/vendor/create-listing";

export default async function({ container }: ExecArgs) {
  console.log("🌾 Seeding more marketplace listings...");

  // Create more farmers
  const farmers = [
    {
      business_name: "Nyeri Fresh Produce",
      actor_type: "farmer",
      location: "Nyeri",
      phone_number: "+254722334455",
      email: "info@nyerifresh.ke"
    },
    {
      business_name: "Eldoret Grain Traders",
      actor_type: "farmer",
      location: "Eldoret",
      phone_number: "+254733445566",
      email: "sales@eldoretgrain.ke"
    },
    {
      business_name: "Murang'a Coffee Cooperative",
      actor_type: "farmer",
      location: "Murang'a",
      phone_number: "+254744556677",
      email: "coop@murangacoffee.ke"
    },
    {
      business_name: "Machakos Horticultural",
      actor_type: "farmer",
      location: "Machakos",
      phone_number: "+254755667788",
      email: "contact@machakoshort.ke"
    },
    {
      business_name: "Kisii Tea Estates",
      actor_type: "farmer",
      location: "Kisii",
      phone_number: "+254766778899",
      email: "info@kisiitea.ke"
    },
    {
      business_name: "Kericho Valley Farms",
      actor_type: "farmer",
      location: "Kericho",
      phone_number: "+254777889900",
      email: "farms@kerichovalley.ke"
    },
    {
      business_name: "Bungoma Maize Growers",
      actor_type: "farmer",
      location: "Bungoma",
      phone_number: "+254788990011",
      email: "maize@bungoma.ke"
    },
    {
      business_name: "Nakuru Dairy & Greens",
      actor_type: "farmer",
      location: "Nakuru",
      phone_number: "+254799001122",
      email: "dairy@nakurugreens.ke"
    }
  ];

  const vendorIds: string[] = [];

  // Create farmers
  for (const farmer of farmers) {
    try {
      const { result } = await createVendorWorkflow(container).run({
        input: farmer
      });
      vendorIds.push(result.id);
      console.log(`✅ Created farmer: ${farmer.business_name}`);
    } catch (error) {
      console.log(`⚠️  Skipping ${farmer.business_name}:`, error.message);
    }
  }

  // Create diverse harvest listings
  const harvestListings = [
    {
      title: "Fresh Kale - Premium Grade",
      description: "Crisp, fresh kale harvested this morning. Perfect for salads and cooking. Rich in vitamins and grown with organic methods.",
      listing_type: "harvest",
      price_amount: 8,
      price_currency: "ngn",
      unit: "kg",
      quantity: 200,
      location: "Nyeri",
      metadata: {
        crop_type: "Kale",
        grade: "A",
        harvest_date: "2025-01-13",
        storage_conditions: "Refrigerated",
        certifications: ["Organic Certified", "GlobalGAP"]
      }
    },
    {
      title: "White Maize Grain - Grade B",
      description: "Quality white maize suitable for milling into flour. Properly dried and stored. Great for posho and ugali production.",
      listing_type: "harvest",
      price_amount: 4.2,
      price_currency: "ngn",
      unit: "kg",
      quantity: 3000,
      location: "Eldoret",
      metadata: {
        crop_type: "Maize",
        grade: "B",
        harvest_date: "2024-12-20",
        storage_conditions: "Dry warehouse",
        certifications: ["KEBS Certified"]
      }
    },
    {
      title: "Arabica Coffee Beans - AA Grade",
      description: "Premium Arabica coffee beans from high altitude farms. Excellent flavor profile with fruity notes. Washed and sun-dried.",
      listing_type: "harvest",
      price_amount: 85,
      price_currency: "ngn",
      unit: "kg",
      quantity: 150,
      location: "Murang'a",
      metadata: {
        crop_type: "Coffee",
        grade: "AA",
        harvest_date: "2025-01-05",
        storage_conditions: "Cool, dry storage",
        certifications: ["Fair Trade", "Rainforest Alliance"]
      }
    },
    {
      title: "Green Bell Peppers",
      description: "Fresh, crunchy green bell peppers. Excellent for cooking, salads, and export. No pesticide residue.",
      listing_type: "harvest",
      price_amount: 12,
      price_currency: "ngn",
      unit: "kg",
      quantity: 400,
      location: "Machakos",
      metadata: {
        crop_type: "Bell Peppers",
        grade: "A",
        harvest_date: "2025-01-14",
        storage_conditions: "Cool storage",
        certifications: ["GlobalGAP", "HACCP"]
      }
    },
    {
      title: "Purple Tea Leaves - Premium",
      description: "Rare purple tea leaves rich in antioxidants. Hand-picked and processed. Perfect for specialty tea blends.",
      listing_type: "harvest",
      price_amount: 65,
      price_currency: "ngn",
      unit: "kg",
      quantity: 80,
      location: "Kisii",
      metadata: {
        crop_type: "Tea",
        grade: "Premium",
        harvest_date: "2025-01-12",
        storage_conditions: "Airtight containers",
        certifications: ["Organic Certified"]
      }
    },
    {
      title: "Red Onions - Bulk Sale",
      description: "Large quantity of quality red onions. Perfect for wholesalers and processors. Well-cured and ready for market.",
      listing_type: "harvest",
      price_amount: 6.5,
      price_currency: "ngn",
      unit: "kg",
      quantity: 2000,
      location: "Kericho",
      metadata: {
        crop_type: "Onions",
        grade: "A",
        harvest_date: "2024-12-28",
        storage_conditions: "Ventilated shed",
        certifications: ["KEBS Approved"]
      }
    },
    {
      title: "Sweet Potatoes - Orange Flesh",
      description: "Nutritious orange-fleshed sweet potatoes. High in Vitamin A. Great for schools and institutional buyers.",
      listing_type: "harvest",
      price_amount: 5,
      price_currency: "ngn",
      unit: "kg",
      quantity: 1500,
      location: "Bungoma",
      metadata: {
        crop_type: "Sweet Potatoes",
        grade: "A",
        harvest_date: "2025-01-08",
        storage_conditions: "Ambient storage",
        certifications: ["Quality Assured"]
      }
    },
    {
      title: "Fresh Spinach - Baby Leaves",
      description: "Tender baby spinach leaves. Perfect for salads and quick cooking. Hydroponic grown with no soil contamination.",
      listing_type: "harvest",
      price_amount: 15,
      price_currency: "ngn",
      unit: "kg",
      quantity: 100,
      location: "Nakuru",
      metadata: {
        crop_type: "Spinach",
        grade: "Premium",
        harvest_date: "2025-01-15",
        storage_conditions: "Refrigerated",
        certifications: ["Hydroponic Certified"]
      }
    },
    {
      title: "Passion Fruit - Export Quality",
      description: "Grade A passion fruits ready for export or local processing. Uniform size, perfect ripeness. Sweet and aromatic.",
      listing_type: "harvest",
      price_amount: 18,
      price_currency: "ngn",
      unit: "kg",
      quantity: 600,
      location: "Nyeri",
      metadata: {
        crop_type: "Passion Fruit",
        grade: "A",
        harvest_date: "2025-01-13",
        storage_conditions: "Cool, ventilated",
        certifications: ["GlobalGAP", "HACCP"]
      }
    },
    {
      title: "Irish Potatoes - Washed",
      description: "Clean, washed Irish potatoes. Ideal for hotels, restaurants, and supermarkets. Multiple varieties available.",
      listing_type: "harvest",
      price_amount: 7,
      price_currency: "ngn",
      unit: "kg",
      quantity: 3500,
      location: "Eldoret",
      metadata: {
        crop_type: "Potatoes",
        grade: "A",
        harvest_date: "2025-01-10",
        storage_conditions: "Cool, dark storage",
        certifications: ["KEBS Certified"]
      }
    },
    {
      title: "Carrots - Baby & Regular",
      description: "Fresh carrots in various sizes. Crunchy and sweet. Perfect for salads, juicing, and cooking.",
      listing_type: "harvest",
      price_amount: 9,
      price_currency: "ngn",
      unit: "kg",
      quantity: 800,
      location: "Machakos",
      metadata: {
        crop_type: "Carrots",
        grade: "A",
        harvest_date: "2025-01-11",
        storage_conditions: "Refrigerated",
        certifications: ["Quality Assured"]
      }
    },
    {
      title: "Black Tea - CTC Grade",
      description: "CTC processed black tea for strong brew. Perfect for local market and blending. Consistent quality.",
      listing_type: "harvest",
      price_amount: 45,
      price_currency: "ngn",
      unit: "kg",
      quantity: 500,
      location: "Kericho",
      metadata: {
        crop_type: "Tea",
        grade: "CTC",
        harvest_date: "2025-01-09",
        storage_conditions: "Airtight packaging",
        certifications: ["KTDA Certified"]
      }
    }
  ];

  // Add more equipment and vehicle listings
  const equipmentListings = [
    {
      title: "Harrow - 20 Disc",
      description: "Heavy-duty disc harrow for land preparation. Suitable for large farms. Well-maintained equipment.",
      listing_type: "equipment",
      price_amount: 800,
      price_currency: "ngn",
      unit: "day",
      quantity: 1,
      location: "Nakuru",
      metadata: {
        equipment_type: "Harrow",
        condition: "Good",
        daily_rate: true
      }
    },
    {
      title: "Planter - 4-Row Maize",
      description: "Precision maize planter with fertilizer attachment. Increases planting efficiency. Operator available.",
      listing_type: "equipment",
      price_amount: 1200,
      price_currency: "ngn",
      unit: "day",
      quantity: 1,
      location: "Eldoret",
      metadata: {
        equipment_type: "Planter",
        condition: "Excellent",
        daily_rate: true
      }
    },
    {
      title: "Water Pump - 4 inch Diesel",
      description: "Powerful diesel water pump for irrigation. Can pump up to 100m distance. Fuel-efficient.",
      listing_type: "equipment",
      price_amount: 600,
      price_currency: "ngn",
      unit: "day",
      quantity: 2,
      location: "Machakos",
      metadata: {
        equipment_type: "Pump",
        condition: "Good",
        daily_rate: true
      }
    }
  ];

  const vehicleListings = [
    {
      title: "Isuzu NQR - 7 Ton Capacity",
      description: "Clean Isuzu truck for agricultural produce transport. Tarpaulin cover included. Experienced driver available.",
      listing_type: "vehicle",
      price_amount: 2500,
      price_currency: "ngn",
      unit: "day",
      quantity: 1,
      location: "Nairobi",
      metadata: {
        vehicle_type: "Truck",
        capacity: "7 tons",
        condition: "Excellent"
      }
    },
    {
      title: "Mitsubishi Canter - Refrigerated",
      description: "Refrigerated truck for perishable goods. Temperature controlled. Ideal for vegetables and dairy.",
      listing_type: "vehicle",
      price_amount: 3500,
      price_currency: "ngn",
      unit: "day",
      quantity: 1,
      location: "Nakuru",
      metadata: {
        vehicle_type: "Refrigerated Truck",
        capacity: "5 tons",
        condition: "Excellent"
      }
    }
  ];

  const storageListings = [
    {
      title: "Grain Silo - 100 Ton Capacity",
      description: "Modern grain storage silo with fumigation system. Perfect for maize, wheat, and beans. Pest-free guarantee.",
      listing_type: "storage",
      price_amount: 50,
      price_currency: "ngn",
      unit: "ton/month",
      quantity: 100,
      location: "Eldoret",
      metadata: {
        storage_type: "Silo",
        capacity: "100 tons",
        features: "Fumigation, Aeration"
      }
    }
  ];

  // Create listings
  let harvestCount = 0;
  for (let i = 0; i < harvestListings.length; i++) {
    const listing = harvestListings[i];
    const vendorId = vendorIds[i % vendorIds.length]; // Distribute across vendors
    
    try {
      await createListingWorkflow(container).run({
        input: {
          ...listing,
          vendor_id: vendorId
        }
      });
      harvestCount++;
      console.log(`✅ Created harvest listing: ${listing.title}`);
    } catch (error) {
      console.log(`⚠️  Skipping ${listing.title}:`, error.message);
    }
  }

  let equipmentCount = 0;
  for (const listing of equipmentListings) {
    const vendorId = vendorIds[Math.floor(Math.random() * vendorIds.length)];
    
    try {
      await createListingWorkflow(container).run({
        input: {
          ...listing,
          vendor_id: vendorId
        }
      });
      equipmentCount++;
      console.log(`✅ Created equipment listing: ${listing.title}`);
    } catch (error) {
      console.log(`⚠️  Skipping ${listing.title}:`, error.message);
    }
  }

  let vehicleCount = 0;
  for (const listing of vehicleListings) {
    const vendorId = vendorIds[Math.floor(Math.random() * vendorIds.length)];
    
    try {
      await createListingWorkflow(container).run({
        input: {
          ...listing,
          vendor_id: vendorId
        }
      });
      vehicleCount++;
      console.log(`✅ Created vehicle listing: ${listing.title}`);
    } catch (error) {
      console.log(`⚠️  Skipping ${listing.title}:`, error.message);
    }
  }

  let storageCount = 0;
  for (const listing of storageListings) {
    const vendorId = vendorIds[Math.floor(Math.random() * vendorIds.length)];
    
    try {
      await createListingWorkflow(container).run({
        input: {
          ...listing,
          vendor_id: vendorId
        }
      });
      storageCount++;
      console.log(`✅ Created storage listing: ${listing.title}`);
    } catch (error) {
      console.log(`⚠️  Skipping ${listing.title}:`, error.message);
    }
  }

  console.log("\n📊 Summary:");
  console.log(`   Harvest listings: ${harvestCount}`);
  console.log(`   Equipment listings: ${equipmentCount}`);
  console.log(`   Vehicle listings: ${vehicleCount}`);
  console.log(`   Storage listings: ${storageCount}`);
  console.log("\n✨ Seeding complete!");
}
