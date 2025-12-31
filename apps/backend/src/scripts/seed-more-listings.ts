import { ExecArgs } from "@medusajs/framework/types";
import { createVendorWorkflow } from "../workflows/vendor/create-vendor";
import { createListingWorkflow } from "../workflows/vendor/create-listing";

export default async function({ container }: ExecArgs) {
  console.log("🌾 Seeding more Nigerian marketplace listings...");

  // Create more farmers with Nigerian names and locations
  const farmers = [
    {
      business_name: "Onitsha Fresh Produce",
      actor_type: "farmer",
      location: "Lagos",
      phone_number: "+2348022334455",
      email: "info@onitshafresh.ng"
    },
    {
      business_name: "Kano Grain Traders",
      actor_type: "farmer",
      location: "Abuja",
      phone_number: "+2348033445566",
      email: "sales@kanograin.ng"
    },
    {
      business_name: "Enugu Cassava Cooperative",
      actor_type: "farmer",
      location: "Port Harcourt",
      phone_number: "+2348044556677",
      email: "coop@enumgucassava.ng"
    },
    {
      business_name: "Oyo Horticultural Hub",
      actor_type: "farmer",
      location: "Ibadan",
      phone_number: "+2348055667788",
      email: "contact@oyohort.ng"
    },
    {
      business_name: "Delta Palm Oil Estates",
      actor_type: "farmer",
      location: "Lagos",
      phone_number: "+2348066778899",
      email: "info@deltapalm.ng"
    },
    {
      business_name: "Plateau Vegetable Farms",
      actor_type: "farmer",
      location: "Abuja",
      phone_number: "+2348077889900",
      email: "farms@plateauveg.ng"
    },
    {
      business_name: "Benue Yam Growers",
      actor_type: "farmer",
      location: "Ibadan",
      phone_number: "+2348088990011",
      email: "yam@benue.ng"
    },
    {
      business_name: "Kaduna Rice Mills",
      actor_type: "farmer",
      location: "Lagos",
      phone_number: "+2348099001122",
      email: "rice@kadunarice.ng"
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

  // Create diverse harvest listings with Nigerian crops
  const harvestListings = [
    {
      title: "Fresh Ugu (Pumpkin Leaves) - Premium Grade",
      description: "Crisp, fresh ugu harvested this morning. Perfect for soups and cooking. Rich in vitamins and grown with organic methods.",
      listing_type: "harvest",
      price_amount: 16000000,
      price_currency: "ngn",
      unit: "kg",
      quantity: 200,
      location: "Lagos",
      metadata: {
        crop_type: "Ugu",
        grade: "A",
        harvest_date: "2025-01-13",
        storage_conditions: "Refrigerated",
        certifications: ["Organic Certified"]
      }
    },
    {
      title: "White Yam Tubers - Grade A",
      description: "Large, quality white yam tubers from Benue farms. Ideal for pounding, frying, or boiling.",
      listing_type: "harvest",
      price_amount: 90000000,
      price_currency: "ngn",
      unit: "kg",
      quantity: 1500,
      location: "Ibadan",
      metadata: {
        crop_type: "Yam",
        grade: "A",
        harvest_date: "2025-01-10",
        tuber_size: "Large",
        certifications: ["Quality Tested"]
      }
    },
    {
      title: "Palm Oil - Crude Red Grade",
      description: "Fresh palm oil extracted from premium quality palm fruits. Rich color and authentic flavor.",
      listing_type: "harvest",
      price_amount: 100000000,
      price_currency: "ngn",
      unit: "litre",
      quantity: 500,
      location: "Lagos",
      metadata: {
        crop_type: "Palm Oil",
        grade: "A",
        extraction_date: "2025-01-12",
        purity: "100%",
        certifications: ["NAFDAC Approved"]
      }
    },
    {
      title: "Fresh Pepper (Ata Rodo) - Hot",
      description: "Spicy red pepper perfect for Nigerian stews and soups. Freshly harvested and carefully sorted.",
      listing_type: "harvest",
      price_amount: 30000000,
      price_currency: "ngn",
      unit: "kg",
      quantity: 150,
      location: "Abuja",
      metadata: {
        crop_type: "Pepper",
        variety: "Ata Rodo",
        grade: "A",
        harvest_date: "2025-01-14",
        heat_level: "Hot"
      }
    },
    {
      title: "Cassava Tubers - Fresh Grade A",
      description: "Quality cassava tubers suitable for garri, fufu, and other cassava products. Freshly harvested.",
      listing_type: "harvest",
      price_amount: 40000000,
      price_currency: "ngn",
      unit: "kg",
      quantity: 2000,
      location: "Port Harcourt",
      metadata: {
        crop_type: "Cassava",
        grade: "A",
        harvest_date: "2025-01-11",
        variety: "TME 419",
        moisture_content: "Low"
      }
    },
    {
      title: "Plantain (Unripe) - Export Quality",
      description: "Unripe plantain perfect for chips, dodo, and cooking. Carefully selected for size and quality.",
      listing_type: "harvest",
      price_amount: 36000000,
      price_currency: "ngn",
      unit: "kg",
      quantity: 800,
      location: "Lagos",
      metadata: {
        crop_type: "Plantain",
        ripeness: "Unripe",
        grade: "A",
        harvest_date: "2025-01-13",
        bunch_size: "Large"
      }
    },
    {
      title: "Nigerian Rice (Ofada) - Premium",
      description: "Locally grown Ofada rice with authentic aroma and taste. Stone-free and well processed.",
      listing_type: "harvest",
      price_amount: 80000000,
      price_currency: "ngn",
      unit: "kg",
      quantity: 1000,
      location: "Lagos",
      metadata: {
        crop_type: "Rice",
        variety: "Ofada",
        grade: "Premium",
        harvest_date: "2024-12-20",
        processing: "Stone-free"
      }
    },
    {
      title: "Fresh Waterleaf - Grade A",
      description: "Fresh waterleaf for soups and cooking. Harvested same day and carefully washed.",
      listing_type: "harvest",
      price_amount: 14400000,
      price_currency: "ngn",
      unit: "kg",
      quantity: 180,
      location: "Abuja",
      metadata: {
        crop_type: "Waterleaf",
        grade: "A",
        harvest_date: "2025-01-14",
        storage_conditions: "Refrigerated"
      }
    },
    {
      title: "Groundnut (Peanuts) - Roasted Quality",
      description: "Premium groundnuts suitable for oil extraction or direct consumption. Well dried and sorted.",
      listing_type: "harvest",
      price_amount: 48000000,
      price_currency: "ngn",
      unit: "kg",
      quantity: 600,
      location: "Abuja",
      metadata: {
        crop_type: "Groundnut",
        grade: "A",
        harvest_date: "2024-12-28",
        moisture_content: "10%",
        certifications: ["Quality Tested"]
      }
    },
    {
      title: "Fresh Ewedu (Jute Leaves)",
      description: "Traditional ewedu leaves for soups. Freshly harvested and sorted for quality.",
      listing_type: "harvest",
      price_amount: 9600000,
      price_currency: "ngn",
      unit: "kg",
      quantity: 120,
      location: "Ibadan",
      metadata: {
        crop_type: "Ewedu",
        grade: "A",
        harvest_date: "2025-01-14",
        leaf_quality: "Tender"
      }
    },
    {
      title: "Garden Eggs (White) - Fresh",
      description: "Fresh white garden eggs for cooking and stews. Carefully sorted and packaged.",
      listing_type: "harvest",
      price_amount: 20000000,
      price_currency: "ngn",
      unit: "kg",
      quantity: 250,
      location: "Lagos",
      metadata: {
        crop_type: "Garden Egg",
        variety: "White",
        grade: "A",
        harvest_date: "2025-01-13"
      }
    },
    {
      title: "Sweet Potatoes - Yellow Variety",
      description: "Sweet yellow potatoes rich in nutrients. Perfect for boiling, frying, or baking.",
      listing_type: "harvest",
      price_amount: 28000000,
      price_currency: "ngn",
      unit: "kg",
      quantity: 700,
      location: "Ibadan",
      metadata: {
        crop_type: "Sweet Potato",
        variety: "Yellow",
        grade: "A",
        harvest_date: "2025-01-12"
      }
    }
  ];

  // Create harvest listings
  let harvestCount = 0;
  for (let i = 0; i < harvestListings.length && i < vendorIds.length; i++) {
    try {
      await createListingWorkflow(container).run({
        input: {
          vendor_id: vendorIds[i % vendorIds.length],
          status: "active",
          ...harvestListings[i]
        }
      });
      harvestCount++;
      console.log(`✅ Created harvest listing: ${harvestListings[i].title}`);
    } catch (error) {
      console.log(`⚠️  Error creating listing:`, error.message);
    }
  }

  // Create equipment listings
  const equipmentOwners = [
    {
      business_name: "Lagos Equipment Rentals",
      actor_type: "equipment_owner",
      location: "Lagos",
      phone_number: "+2348011223344",
      email: "rentals@lagosequip.ng"
    },
    {
      business_name: "Abuja Farm Machinery",
      actor_type: "equipment_owner",
      location: "Abuja",
      phone_number: "+2348022334455",
      email: "machinery@abujafarm.ng"
    }
  ];

  const equipmentVendorIds: string[] = [];
  for (const owner of equipmentOwners) {
    try {
      const { result } = await createVendorWorkflow(container).run({
        input: owner
      });
      equipmentVendorIds.push(result.id);
      console.log(`✅ Created equipment owner: ${owner.business_name}`);
    } catch (error) {
      console.log(`⚠️  Skipping ${owner.business_name}`);
    }
  }

  const equipmentListings = [
    {
      title: "Harrow (20 Disc) - Heavy Duty",
      description: "Professional 20-disc harrow for land preparation. Well maintained and ready for use.",
      listing_type: "equipment",
      price_amount: 25000,
      price_currency: "ngn",
      location: "Lagos",
      metadata: {
        equipment_type: "Harrow",
        disc_count: 20,
        daily_rate: 25000,
        weekly_rate: 150000,
        available: true
      }
    },
    {
      title: "Maize Planter (4-Row)",
      description: "Efficient 4-row maize planter for large scale farming. Speeds up planting operations.",
      listing_type: "equipment",
      price_amount: 30000,
      price_currency: "ngn",
      location: "Abuja",
      metadata: {
        equipment_type: "Planter",
        rows: 4,
        daily_rate: 30000,
        weekly_rate: 180000,
        available: true
      }
    },
    {
      title: "Water Pump - Diesel 3HP",
      description: "Reliable diesel water pump for irrigation. Low fuel consumption and high efficiency.",
      listing_type: "equipment",
      price_amount: 15000,
      price_currency: "ngn",
      location: "Lagos",
      metadata: {
        equipment_type: "Water Pump",
        power: "3HP",
        fuel_type: "Diesel",
        daily_rate: 15000,
        weekly_rate: 90000,
        available: true
      }
    }
  ];

  let equipmentCount = 0;
  for (let i = 0; i < equipmentListings.length && equipmentVendorIds.length > 0; i++) {
    try {
      await createListingWorkflow(container).run({
        input: {
          vendor_id: equipmentVendorIds[i % equipmentVendorIds.length],
          status: "active",
          ...equipmentListings[i]
        }
      });
      equipmentCount++;
      console.log(`✅ Created equipment listing: ${equipmentListings[i].title}`);
    } catch (error) {
      console.log(`⚠️  Error creating equipment listing`);
    }
  }

  // Create vehicle listings
  const vehicleOwners = [
    {
      business_name: "Lagos Metro Logistics",
      actor_type: "gig_worker",
      location: "Lagos",
      phone_number: "+2348033445566",
      email: "metro@lagoslogistics.ng"
    },
    {
      business_name: "Port Harcourt Haulage",
      actor_type: "gig_worker",
      location: "Port Harcourt",
      phone_number: "+2348044556677",
      email: "haulage@phhaulage.ng"
    }
  ];

  const vehicleVendorIds: string[] = [];
  for (const owner of vehicleOwners) {
    try {
      const { result } = await createVendorWorkflow(container).run({
        input: owner
      });
      vehicleVendorIds.push(result.id);
      console.log(`✅ Created vehicle owner: ${owner.business_name}`);
    } catch (error) {
      console.log(`⚠️  Skipping ${owner.business_name}`);
    }
  }

  const vehicleListings = [
    {
      title: "Isuzu NQR - 7 Ton Truck",
      description: "Reliable Isuzu truck for medium to heavy loads. Well maintained with excellent fuel economy.",
      listing_type: "vehicle",
      price_amount: 45000,
      price_currency: "ngn",
      location: "Lagos",
      metadata: {
        vehicle_type: "Truck",
        capacity_kg: 7000,
        make: "Isuzu",
        model: "NQR",
        daily_rate: 45000,
        hourly_rate: 6000,
        available: true
      }
    },
    {
      title: "Mitsubishi Canter - Refrigerated",
      description: "Refrigerated truck for cold chain transportation. Ideal for perishable farm produce.",
      listing_type: "vehicle",
      price_amount: 60000,
      price_currency: "ngn",
      location: "Port Harcourt",
      metadata: {
        vehicle_type: "Refrigerated Truck",
        capacity_kg: 3000,
        make: "Mitsubishi",
        model: "Canter",
        temperature_range: "-5 to 8°C",
        daily_rate: 60000,
        hourly_rate: 8000,
        available: true
      }
    }
  ];

  let vehicleCount = 0;
  for (let i = 0; i < vehicleListings.length && vehicleVendorIds.length > 0; i++) {
    try {
      await createListingWorkflow(container).run({
        input: {
          vendor_id: vehicleVendorIds[i % vehicleVendorIds.length],
          status: "active",
          ...vehicleListings[i]
        }
      });
      vehicleCount++;
      console.log(`✅ Created vehicle listing: ${vehicleListings[i].title}`);
    } catch (error) {
      console.log(`⚠️  Error creating vehicle listing`);
    }
  }

  // Create storage listing
  const storageOwners = [
    {
      business_name: "Ibadan Storage Solutions",
      actor_type: "storage_operator",
      location: "Ibadan",
      phone_number: "+2348055667788",
      email: "storage@ibadanstorage.ng"
    }
  ];

  const storageVendorIds: string[] = [];
  for (const owner of storageOwners) {
    try {
      const { result } = await createVendorWorkflow(container).run({
        input: owner
      });
      storageVendorIds.push(result.id);
      console.log(`✅ Created storage operator: ${owner.business_name}`);
    } catch (error) {
      console.log(`⚠️  Skipping ${owner.business_name}`);
    }
  }

  const storageListings = [
    {
      title: "Grain Silo - 100 Ton Capacity",
      description: "Modern grain storage silo with ventilation system. Perfect for storing rice, maize, and other grains.",
      listing_type: "storage",
      price_amount: 25000,
      price_currency: "ngn",
      location: "Ibadan",
      metadata: {
        storage_type: "Silo",
        capacity_kg: 100000,
        grain_types: ["Rice", "Maize", "Wheat"],
        daily_rate: 25000,
        monthly_rate: 600000,
        available_capacity: 75000,
        features: ["Ventilation System", "Pest Control", "Security"]
      }
    }
  ];

  let storageCount = 0;
  for (let i = 0; i < storageListings.length && storageVendorIds.length > 0; i++) {
    try {
      await createListingWorkflow(container).run({
        input: {
          vendor_id: storageVendorIds[i % storageVendorIds.length],
          status: "active",
          ...storageListings[i]
        }
      });
      storageCount++;
      console.log(`✅ Created storage listing: ${storageListings[i].title}`);
    } catch (error) {
      console.log(`⚠️  Error creating storage listing`);
    }
  }

  console.log("\n✅ Nigerian marketplace seeding completed!");
  console.log(`📊 Summary:`);
  console.log(`   - ${vendorIds.length} farmers created`);
  console.log(`   - ${harvestCount} harvest listings created`);
  console.log(`   - ${equipmentCount} equipment listings created`);
  console.log(`   - ${vehicleCount} vehicle listings created`);
  console.log(`   - ${storageCount} storage listings created`);
  console.log(`   - Total listings: ${harvestCount + equipmentCount + vehicleCount + storageCount}`);
}
