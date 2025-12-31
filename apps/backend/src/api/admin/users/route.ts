import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { createAdminUserWorkflow } from "../../../workflows/admin-user/create-admin-user"

// List all admin users
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const userModule = req.scope.resolve(Modules.USER)

  const { limit = 20, offset = 0, q } = req.query

  // Build filters
  const filters: any = {}
  if (q) {
    filters.email = { $ilike: `%${q}%` }
  }

  const [users, count] = await userModule.listAndCountUsers(filters, {
    skip: Number(offset),
    take: Number(limit),
    order: { created_at: "DESC" },
  })

  res.json({
    users: users.map((user) => ({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.metadata?.role || "admin",
      is_active: user.metadata?.is_active !== false,
      created_at: user.created_at,
      updated_at: user.updated_at,
    })),
    count,
    limit: Number(limit),
    offset: Number(offset),
  })
}

// Create new admin user
export const POST = async (
  req: AuthenticatedMedusaRequest<{
    email: string
    password: string
    first_name: string
    last_name: string
    role?: "admin" | "super_admin" | "moderator"
  }>,
  res: MedusaResponse
) => {
  const currentUserId = req.auth_context?.actor_id

  // Check if current user is super_admin
  const userModule = req.scope.resolve(Modules.USER)
  const [currentUser] = await userModule.listUsers({
    id: [currentUserId],
  })

  const isSuperAdmin = currentUser?.metadata?.role === "super_admin"

  if (!isSuperAdmin) {
    return res.status(403).json({
      message: "Only super admins can create admin users",
    })
  }

  // Validate input
  const { email, password, first_name, last_name, role } = req.validatedBody

  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({
      message: "Email, password, first_name, and last_name are required",
    })
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long",
    })
  }

  try {
    const { result } = await createAdminUserWorkflow(req.scope).run({
      input: {
        email,
        password,
        first_name,
        last_name,
        role: role || "admin",
      },
    })

    res.status(201).json({
      message: "Admin user created successfully",
      user: {
        id: result.user.id,
        email: result.user.email,
        first_name: result.user.first_name,
        last_name: result.user.last_name,
        role: result.user.metadata?.role,
      },
    })
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to create admin user",
    })
  }
}
