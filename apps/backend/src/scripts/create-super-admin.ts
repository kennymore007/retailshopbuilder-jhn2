import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * Create Super Admin User Script
 * 
 * This script creates your first super admin user.
 * Run it with: npx medusa exec ./src/scripts/create-super-admin.ts
 * 
 * Default credentials:
 * Email: kehindeadebayotola@gmail.com
 * Password: AgriConnect2024!
 * 
 * IMPORTANT: Change the password after first login!
 */

export default async function ({ container }: ExecArgs) {
  const userModule = container.resolve(Modules.USER)
  const authModule = container.resolve(Modules.AUTH)

  const SUPER_ADMIN_EMAIL = "kehindeadebayotola@gmail.com"
  const DEFAULT_PASSWORD = "AgriConnect2024!"

  console.log("🚀 Creating Super Admin User...")
  console.log("================================")

  try {
    // Check if user already exists
    const existingUsers = await userModule.listUsers({
      email: SUPER_ADMIN_EMAIL,
    })

    if (existingUsers.length > 0) {
      console.log("⚠️  User already exists!")
      console.log("\nUser ID:", existingUsers[0].id)
      console.log("Email:", existingUsers[0].email)
      console.log("Name:", existingUsers[0].first_name, existingUsers[0].last_name)
      console.log("Role:", existingUsers[0].metadata?.role || "admin")
      
      // Update to super_admin if not already
      if (existingUsers[0].metadata?.role !== "super_admin") {
        await userModule.updateUsers({
          id: existingUsers[0].id,
          metadata: {
            ...existingUsers[0].metadata,
            role: "super_admin",
          },
        })
        console.log("\n✅ Updated role to super_admin")
      }

      console.log("\n💡 To reset password, use:")
      console.log(`   npx medusa exec ./src/scripts/reset-admin-password.ts`)
      
      return
    }

    // Create super admin user
    const user = await userModule.createUsers({
      email: SUPER_ADMIN_EMAIL,
      first_name: "Kehinde",
      last_name: "Adebayo",
      metadata: {
        role: "super_admin",
        created_by: "bootstrap",
        created_at: new Date().toISOString(),
      },
    })

    console.log("✅ User created!")
    console.log("User ID:", user.id)
    console.log("Email:", user.email)

    // Create auth identity with password
    await authModule.createAuthIdentities({
      provider: "emailpass",
      entity_id: user.id,
      provider_metadata: {
        password: DEFAULT_PASSWORD,
      },
      app_metadata: {
        actor_type: "user",
        user_id: user.id,
      },
    })

    console.log("✅ Password set!")
    
    console.log("\n================================")
    console.log("🎉 Super Admin Created Successfully!")
    console.log("================================")
    console.log("\n📧 Email:", SUPER_ADMIN_EMAIL)
    console.log("🔑 Password:", DEFAULT_PASSWORD)
    console.log("\n⚠️  IMPORTANT: Change your password after first login!")
    console.log("\n🌐 Admin Dashboard URL:")
    console.log("   Local: http://localhost:9000/app")
    console.log("   Production: https://your-domain.com/app")
    console.log("\n================================")

  } catch (error) {
    console.error("\n❌ Failed to create super admin:")
    console.error(error)
    
    if (error.message?.includes("duplicate")) {
      console.log("\n💡 User might already exist. Try resetting password:")
      console.log(`   npx medusa exec ./src/scripts/reset-admin-password.ts`)
    }
  }
}
