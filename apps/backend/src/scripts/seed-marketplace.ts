import { ExecArgs } from "@medusajs/framework/types"
import { createVendorWorkflow } from "../workflows/vendor/create-vendor"
import { createListingWorkflow } from "../workflows/vendor/create-listing"

export default async function ({ container }: ExecArgs) {
  console.log("Starting marketplace seed...")

  // Create Farmers
  const farmer1 = await createVendorWorkflow(container).run({
    input: {
      email: "john.kariuki@farm.ke",
      business_name: "Kariuki Family Farm",
      actor_type: "farmer",
      phone_number: "+254712345678",
      location: "Kiambu",
      verification_status: "verified",
      metadata: {
        farm_size: "5 acres",
        crops: ["cabbage", "tomatoes", "maize"],
      },
    },
  })
  console.log("Created farmer:", farmer1.result.business_name)

  const farmer2 = await createVendorWorkflow(container).run({
    input: {
      email: "grace.wanjiku@greenfarm.ke",
      business_name: "Green Valley Farms",
      actor_type: "farmer",
      phone_number: "+254723456789",
      location: "Nakuru",
      verification_status: "verified",
      metadata: {
        farm_size: "10 acres",
        crops: ["tomatoes", "kale", "onions"],
      },
    },
  })
  console.log("Created farmer:", farmer2.result.business_name)

  const farmer3 = await createVendorWorkflow(container).run({
    input: {
      email: "peter.mwangi@harvest.ke",
      business_name: "Mwangi Agro",
      actor_type: "farmer",
      phone_number: "+254734567890",
      location: "Meru",
      verification_status: "verified",
      metadata: {
        farm_size: "8 acres",
        crops: ["maize", "beans"],
      },
    },
  })
  console.log("Created farmer:", farmer3.result.business_name)

  // Create Gig Workers (Vehicle Rentals)
  const gigWorker1 = await createVendorWorkflow(container).run({
    input: {
      email: "david.omondi@transport.ke",
      business_name: "Omondi Transport Services",
      actor_type: "gig_worker",
      phone_number: "+254745678901",
      location: "Nairobi",
      verification_status: "verified",
      metadata: {
        vehicle_type: "pickup_truck",
        license_plate: "KCA 123B",
      },
    },
  })
  console.log("Created gig worker:", gigWorker1.result.business_name)

  const gigWorker2 = await createVendorWorkflow(container).run({
    input: {
      email: "mary.akinyi@logistics.ke",
      business_name: "Akinyi Haulage",
      actor_type: "gig_worker",
      phone_number: "+254756789012",
      location: "Mombasa",
      verification_status: "verified",
      metadata: {
        vehicle_type: "truck",
        license_plate: "KBZ 456C",
      },
    },
  })
  console.log("Created gig worker:", gigWorker2.result.business_name)

  // Create Storage Operators
  const storage1 = await createVendorWorkflow(container).run({
    input: {
      email: "info@nairobi-coldchain.ke",
      business_name: "Nairobi Cold Chain",
      actor_type: "storage_operator",
      phone_number: "+254767890123",
      location: "Nairobi",
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
      email: "contact@thika-warehouse.ke",
      business_name: "Thika Warehouse Co.",
      actor_type: "storage_operator",
      phone_number: "+254778901234",
      location: "Thika",
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
      email: "james.kamau@agriequip.ke",
      business_name: "Kamau Equipment Rentals",
      actor_type: "equipment_owner",
      phone_number: "+254789012345",
      location: "Nakuru",
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
      description: "Premium quality cabbage, freshly harvested",
      listing_type: "harvest",
      status: "active",
      price_amount: 5000,
      price_currency: "kes",
      quantity: 500,
      unit: "kg",
      location: "Kiambu",
      metadata: {
        crop_type: "cabbage",
        grade: "A",
        harvest_date: "2024-01-15",
        gps_coordinates: "-1.1715, 36.8315",
      },
    },
  })
  console.log("Created listing: Fresh Cabbage")

  await createListingWorkflow(container).run({
    input: {
      vendor_id: farmer2.result.id,
      title: "Organic Tomatoes - Grade A",
      description: "Sweet, organic tomatoes perfect for fresh markets",
      listing_type: "harvest",
      status: "active",
      price_amount: 8000,
      price_currency: "kes",
      quantity: 300,
      unit: "kg",
      location: "Nakuru",
      metadata: {
        crop_type: "tomatoes",
        grade: "A",
        harvest_date: "2024-01-14",
        gps_coordinates: "-0.3031, 36.0800",
      },
    },
  })
  console.log("Created listing: Organic Tomatoes")

  await createListingWorkflow(container).run({
    input: {
      vendor_id: farmer3.result.id,
      title: "Yellow Maize - Grade B",
      description: "Quality maize suitable for animal feed",
      listing_type: "harvest",
      status: "active",
      price_amount: 3500,
      price_currency: "kes",
      quantity: 1000,
      unit: "kg",
      location: "Meru",
      metadata: {
        crop_type: "maize",
        grade: "B",
        harvest_date: "2024-01-10",
        gps_coordinates: "0.0469, 37.6489",
      },
    },
  })
  console.log("Created listing: Yellow Maize")

  // Create Vehicle Listings
  await createListingWorkflow(container).run({
    input: {
      vendor_id: gigWorker1.result.id,
      title: "Pickup Truck - 1.5 Ton Capacity",
      description: "Reliable pickup for farm produce transportation",
      listing_type: "vehicle",
      status: "active",
      price_amount: 5000,
      price_currency: "kes",
      location: "Nairobi",
      metadata: {
        vehicle_type: "pickup_truck",
        capacity_kg: 1500,
        daily_rate: 5000,
        hourly_rate: 800,
        license_plate: "KCA 123B",
        available: true,
      },
    },
  })
  console.log("Created listing: Pickup Truck")

  await createListingWorkflow(container).run({
    input: {
      vendor_id: gigWorker2.result.id,
      title: "Heavy Duty Truck - 5 Ton",
      description: "Large capacity truck for bulk transport",
      listing_type: "vehicle",
      status: "active",
      price_amount: 12000,
      price_currency: "kes",
      location: "Mombasa",
      metadata: {
        vehicle_type: "truck",
        capacity_kg: 5000,
        daily_rate: 12000,
        hourly_rate: 1500,
        license_plate: "KBZ 456C",
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
      description: "Temperature-controlled storage for perishables",
      listing_type: "storage",
      status: "active",
      price_amount: 8000,
      price_currency: "kes",
      location: "Nairobi",
      metadata: {
        storage_type: "cold_storage",
        capacity_kg: 100000,
        daily_rate: 8000,
        monthly_rate: 200000,
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
      description: "Secure dry storage for grains and dry goods",
      listing_type: "storage",
      status: "active",
      price_amount: 5000,
      price_currency: "kes",
      location: "Thika",
      metadata: {
        storage_type: "dry_warehouse",
        capacity_kg: 50000,
        daily_rate: 5000,
        monthly_rate: 120000,
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
      description: "Powerful tractor for land preparation",
      listing_type: "equipment",
      status: "active",
      price_amount: 15000,
      price_currency: "kes",
      location: "Nakuru",
      metadata: {
        equipment_type: "tractor",
        horsepower: 75,
        daily_rate: 15000,
        weekly_rate: 90000,
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
      description: "Industrial plough for large scale farming",
      listing_type: "equipment",
      status: "active",
      price_amount: 3000,
      price_currency: "kes",
      location: "Nakuru",
      metadata: {
        equipment_type: "plough",
        daily_rate: 3000,
        weekly_rate: 18000,
        available: true,
      },
    },
  })
  console.log("Created listing: Heavy Duty Plough")

  console.log("\n✓ Marketplace seed completed successfully!")
  console.log("Created 8 vendors and 10 listings across all marketplaces")
}
