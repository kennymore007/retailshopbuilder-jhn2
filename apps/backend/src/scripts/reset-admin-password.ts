import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * Reset Admin Password Script
 * 
 * This script resets the password for an admin user.
 * Run it with: npx medusa exec ./src/scripts/reset-admin-password.ts
 * 
 * You can modify the EMAIL and NEW_PASSWORD constants below.
 */

export default async function ({ container }: ExecArgs) {
  const userModule = container.resolve(Modules.USER)
  const authModule = container.resolve(Modules.AUTH)

  // CONFIGURE THESE:
  const EMAIL = "kehindeadebayotola@gmail.com"
  const NEW_PASSWORD = "NewPassword123!" // Change this!

  console.log("🔑 Resetting Admin Password...")
  console.log("================================")
  console.log("Email:", EMAIL)

  try {
    // Find user
    const users = await userModule.listUsers({
      email: EMAIL,
    })

    if (users.length === 0) {
      console.log("\n❌ User not found!")
      console.log("\n💡 Create a super admin first:")
      console.log("   npx medusa exec ./src/scripts/create-super-admin.ts")
      return
    }

    const user = users[0]
    console.log("\n✅ User found!")
    console.log("User ID:", user.id)
    console.log("Name:", user.first_name, user.last_name)
    console.log("Role:", user.metadata?.role || "admin")

    // Find auth identity
    const authIdentities = await authModule.listAuthIdentities({
      app_metadata: {
        user_id: user.id,
      },
    })

    if (authIdentities.length === 0) {
      console.log("\n❌ No auth identity found for user")
      
      // Create new auth identity
      console.log("\n🔧 Creating new auth identity...")
      await authModule.createAuthIdentities({
        provider: "emailpass",
        entity_id: user.id,
        provider_metadata: {
          password: NEW_PASSWORD,
        },
        app_metadata: {
          actor_type: "user",
          user_id: user.id,
        },
      })
      console.log("✅ Auth identity created with new password!")
    } else {
      // Update existing auth identity
      const authIdentity = authIdentities[0]
      await authModule.updateAuthIdentities({
        id: authIdentity.id,
        provider_metadata: {
          password: NEW_PASSWORD,
        },
      })
      console.log("\n✅ Password updated!")
    }

    console.log("\n================================")
    console.log("🎉 Password Reset Successful!")
    console.log("================================")
    console.log("\n📧 Email:", EMAIL)
    console.log("🔑 New Password:", NEW_PASSWORD)
    console.log("\n💡 You can now login to the admin dashboard")
    console.log("================================")

  } catch (error) {
    console.error("\n❌ Failed to reset password:")
    console.error(error)
  }
}
