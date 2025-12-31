import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * List Admin Users Script
 * 
 * This script lists all admin users in the system.
 * Run it with: npx medusa exec ./src/scripts/list-admin-users.ts
 */

export default async function ({ container }: ExecArgs) {
  const userModule = container.resolve(Modules.USER)

  console.log("👥 Listing Admin Users...")
  console.log("================================\n")

  try {
    const users = await userModule.listUsers({}, {
      order: { created_at: "DESC" },
    })

    if (users.length === 0) {
      console.log("❌ No users found!")
      console.log("\n💡 Create a super admin:")
      console.log("   npx medusa exec ./src/scripts/create-super-admin.ts")
      return
    }

    console.log(`Found ${users.length} user(s):\n`)

    users.forEach((user, index) => {
      const role = user.metadata?.role || "admin"
      const isActive = user.metadata?.is_active !== false
      const status = isActive ? "✅ Active" : "❌ Inactive"
      
      console.log(`${index + 1}. ${user.first_name} ${user.last_name}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Role: ${role.toUpperCase()}`)
      console.log(`   Status: ${status}`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`)
      console.log()
    })

    console.log("================================")
    console.log(`Total: ${users.length} user(s)`)
    console.log("================================")

  } catch (error) {
    console.error("\n❌ Failed to list users:")
    console.error(error)
  }
}
