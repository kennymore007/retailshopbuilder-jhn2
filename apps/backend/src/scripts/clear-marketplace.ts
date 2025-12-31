import { ExecArgs } from "@medusajs/framework/types";
import { VENDOR_MODULE } from "../modules/vendor";

export default async function({ container }: ExecArgs) {
  console.log("🧹 Clearing marketplace data...");
  
  const listingModule = container.resolve(VENDOR_MODULE);
  
  // Get all listings
  const listings = await listingModule.listListings();
  console.log(`Found ${listings.length} listings`);
  
  // Delete all listings
  if (listings.length > 0) {
    await listingModule.deleteListings(listings.map(l => l.id));
    console.log(`✅ Deleted ${listings.length} listings`);
  }
  
  // Get all vendors
  const vendors = await listingModule.listVendors();
  console.log(`Found ${vendors.length} vendors`);
  
  // Delete all vendors
  if (vendors.length > 0) {
    await listingModule.deleteVendors(vendors.map(v => v.id));
    console.log(`✅ Deleted ${vendors.length} vendors`);
  }
  
  console.log("\n✅ Marketplace cleared successfully!");
}
