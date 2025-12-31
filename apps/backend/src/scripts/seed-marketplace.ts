import { ExecArgs } from "@medusajs/framework/types"
import { createVendorWorkflow } from "../workflows/vendor/create-vendor"
import { createListingWorkflow } from "../workflows/vendor/create-listing"

export default async function ({ container }: ExecArgs) {
  console.log("Starting Nigerian marketplace seed...")

  // Create Farmers
  const farmer1 = await createVendorWorkflow(container).run({
    input: {
      email: "chukwu.okafor@farmng.com",
      business_name: "Okafor Family Farm",
      actor_type: "farmer",
      phone_number: "+2348012345678",
      location: "Lagos",
      verification_status: "verified",
      metadata: {
        farm_size: "5 hectares",
        crops: ["cabbage", "tomatoes", "cassava"],
      },
    },
  })
  console.log("Created farmer:", farmer1.result.business_name)

  const farmer2 = await createVendorWorkflow(container).run({
    input: {
      email: "amina.ibrahim@greenfarms.ng",
      business_name: "Ibrahim Green Farms",
      actor_type: "farmer",
      phone_number: "+2348023456789",
      location: "Abuja",
      verification_status: "verified",
      metadata: {
        farm_size: "10 hectares",
        crops: ["tomatoes", "pepper", "onions"],
      },
    },
  })
  console.log("Created farmer:", farmer2.result.business_name)

  const farmer3 = await createVendorWorkflow(container).run({
    input: {
      email: "adeola.bello@harvestng.com",
      business_name: "Bello Agro Ventures",
      actor_type: "farmer",
      phone_number: "+2348034567890",
      location: "Ibadan",
      verification_status: "verified",
      metadata: {
        farm_size: "8 hectares",
        crops: ["yam", "cassava", "maize"],
      },
    },
  })
  console.log("Created farmer:", farmer3.result.business_name)

  // Create Gig Workers (Vehicle Rentals)
  const gigWorker1 = await createVendorWorkflow(container).run({
    input: {
      email: "emeka.nwankwo@transport.ng",
      business_name: "Nwankwo Transport Services",
      actor_type: "gig_worker",
      phone_number: "+2348045678901",
      location: "Lagos",
      verification_status: "verified",
      metadata: {
        vehicle_type: "pickup_truck",
        license_plate: "LAG 123 AB",
      },
    },
  })
  console.log("Created gig worker:", gigWorker1.result.business_name)

  const gigWorker2 = await createVendorWorkflow(container).run({
    input: {
      email: "fatima.abubakar@logistics.ng",
      business_name: "Abubakar Haulage Ltd",
      actor_type: "gig_worker",
      phone_number: "+2348056789012",
      location: "Port Harcourt",
      verification_status: "verified",
      metadata: {
        vehicle_type: "truck",
        license_plate: "PHC 456 CD",
      },
    },
  })
  console.log("Created gig worker:", gigWorker2.result.business_name)

  // Create Storage Operators
  const storage1 = await createVendorWorkflow(container).run({
    input: {
      email: "info@lagoscoldchain.ng",
      business_name: "Lagos Cold Chain Solutions",
      actor_type: "storage_operator",
      phone_number: "+2348067890123",
      location: "Lagos",
      verification_status: "verified",
      metadata: {
        storage_type: "cold_storage",
        capacity_tons: 500,
      },
    },
  })
  console.log("Created storage operator:", storage1.result.business_name)

  const storage2 = await createVendorWorkflow(container).run({
    input: {
      email: "contact@abujawarehouse.ng",
      business_name: "Abuja Warehouse Co.",
      actor_type: "storage_operator",
      phone_number: "+2348078901234",
      location: "Abuja",
      verification_status: "verified",
      metadata: {
        storage_type: "dry_warehouse",
        capacity_tons: 300,
      },
    },
  })
  console.log("Created storage operator:", storage2.result.business_name)

  // Create Equipment Owners
  const equipment1 = await createVendorWorkflow(container).run({
    input: {
      email: "olu.adeyemi@agriequip.ng",
      business_name: "Adeyemi Equipment Rentals",
      actor_type: "equipment_owner",
      phone_number: "+2348089012345",
      location: "Ibadan",
      verification_status: "verified",
      metadata: {
        equipment_types: ["tractor", "plough"],
      },
    },
  })
  console.log("Created equipment owner:", equipment1.result.business_name)

  // Create Harvest Listings
  await createListingWorkflow(container).run({
    input: {
      vendor_id: farmer1.result.id,
      title: "Fresh Cabbage - Grade A",
      description: "Premium quality cabbage, freshly harvested from Lagos farms",
      listing_type: "harvest",
      status: "active",
      price_amount: 25000000,
      price_currency: "ngn",
      quantity: 500,
      unit: "kg",
      location: "Lagos",
      metadata: {
        crop_type: "cabbage",
        grade: "A",
        harvest_date: "2024-01-15",
        gps_coordinates: "6.5244, 3.3792",
      },
    },
  })
  console.log("Created listing: Fresh Cabbage")

  await createListingWorkflow(container).run({
    input: {
      vendor_id: farmer2.result.id,
      title: "Organic Tomatoes - Grade A",
      description: "Sweet, organic tomatoes perfect for fresh markets and restaurants",
      listing_type: "harvest",
      status: "active",
      price_amount: 45000000,
      price_currency: "ngn",
      quantity: 300,
      unit: "kg",
      location: "Abuja",
      metadata: {
        crop_type: "tomatoes",
        grade: "A",
        harvest_date: "2024-01-14",
        gps_coordinates: "9.0765, 7.3986",
      },
    },
  })
  console.log("Created listing: Organic Tomatoes")

  await createListingWorkflow(container).run({
    input: {
      vendor_id: farmer3.result.id,
      title: "Yellow Maize - Grade B",
      description: "Quality maize suitable for food processing and animal feed",
      listing_type: "harvest",
      status: "active",
      price_amount: 50000000,
      price_currency: "ngn",
      quantity: 1000,
      unit: "kg",
      location: "Ibadan",
      metadata: {
        crop_type: "maize",
        grade: "B",
        harvest_date: "2024-01-10",
        gps_coordinates: "7.3775, 3.9470",
      },
    },
  })
  console.log("Created listing: Yellow Maize")

  // Create Vehicle Listings
  await createListingWorkflow(container).run({
    input: {
      vendor_id: gigWorker1.result.id,
      title: "Pickup Truck - 1.5 Ton Capacity",
      description: "Reliable pickup truck for farm produce transportation within Lagos",
      listing_type: "vehicle",
      status: "active",
      price_amount: 2500000,
      price_currency: "ngn",
      location: "Lagos",
      metadata: {
        vehicle_type: "pickup_truck",
        capacity_kg: 1500,
        daily_rate: 15000,
        hourly_rate: 2000,
        license_plate: "LAG 123 AB",
        available: true,
      },
    },
  })
  console.log("Created listing: Pickup Truck")

  await createListingWorkflow(container).run({
    input: {
      vendor_id: gigWorker2.result.id,
      title: "Heavy Duty Truck - 5 Ton",
      description: "Large capacity truck for bulk transport across Nigeria",
      listing_type: "vehicle",
      status: "active",
      price_amount: 35000,
      price_currency: "ngn",
      location: "Port Harcourt",
      metadata: {
        vehicle_type: "truck",
        capacity_kg: 5000,
        daily_rate: 35000,
        hourly_rate: 4500,
        license_plate: "PHC 456 CD",
        available: true,
      },
    },
  })
  console.log("Created listing: Heavy Duty Truck")

  // Create Storage Listings
  await createListingWorkflow(container).run({
    input: {
      vendor_id: storage1.result.id,
      title: "Cold Storage - 100 Ton Capacity",
      description: "Temperature-controlled storage for perishables in Lagos",
      listing_type: "storage",
      status: "active",
      price_amount: 20000,
      price_currency: "ngn",
      location: "Lagos",
      metadata: {
        storage_type: "cold_storage",
        capacity_kg: 100000,
        daily_rate: 20000,
        monthly_rate: 500000,
        temperature_range: "2-8°C",
        available_capacity: 60000,
      },
    },
  })
  console.log("Created listing: Cold Storage")

  await createListingWorkflow(container).run({
    input: {
      vendor_id: storage2.result.id,
      title: "Dry Warehouse - 50 Ton",
      description: "Secure dry storage for grains and dry goods in Abuja",
      listing_type: "storage",
      status: "active",
      price_amount: 12000,
      price_currency: "ngn",
      location: "Abuja",
      metadata: {
        storage_type: "dry_warehouse",
        capacity_kg: 50000,
        daily_rate: 12000,
        monthly_rate: 300000,
        available_capacity: 30000,
      },
    },
  })
  console.log("Created listing: Dry Warehouse")

  // Create Equipment Listings
  await createListingWorkflow(container).run({
    input: {
      vendor_id: equipment1.result.id,
      title: "John Deere Tractor - 75HP",
      description: "Powerful tractor for land preparation and farming",
      listing_type: "equipment",
      status: "active",
      price_amount: 40000,
      price_currency: "ngn",
      location: "Ibadan",
      metadata: {
        equipment_type: "tractor",
        horsepower: 75,
        daily_rate: 40000,
        weekly_rate: 250000,
        year: 2020,
        available: true,
      },
    },
  })
  console.log("Created listing: John Deere Tractor")

  await createListingWorkflow(container).run({
    input: {
      vendor_id: equipment1.result.id,
      title: "Heavy Duty Plough",
      description: "Industrial plough for large scale farming operations",
      listing_type: "equipment",
      status: "active",
      price_amount: 8000,
      price_currency: "ngn",
      location: "Ibadan",
      metadata: {
        equipment_type: "plough",
        daily_rate: 8000,
        weekly_rate: 50000,
        available: true,
      },
    },
  })
  console.log("Created listing: Heavy Duty Plough")

  console.log("\n✓ Nigerian marketplace seed completed successfully!")
  console.log("Created 8 vendors and 10 listings across all marketplaces")
}
