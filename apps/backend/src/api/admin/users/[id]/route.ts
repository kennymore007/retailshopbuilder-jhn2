import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { updateAdminUserWorkflow } from "../../../../workflows/admin-user/update-admin-user"
import { deleteAdminUserWorkflow } from "../../../../workflows/admin-user/delete-admin-user"

// Get single admin user
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const userModule = req.scope.resolve(Modules.USER)
  const userId = req.params.id

  const [user] = await userModule.listUsers({
    id: [userId],
  })

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.metadata?.role || "admin",
      is_active: user.metadata?.is_active !== false,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  })
}

// Update admin user
export const POST = async (
  req: AuthenticatedMedusaRequest<{
    first_name?: string
    last_name?: string
    role?: "admin" | "super_admin" | "moderator"
    is_active?: boolean
  }>,
  res: MedusaResponse
) => {
  const currentUserId = req.auth_context?.actor_id
  const userId = req.params.id

  // Check if current user is super_admin
  const userModule = req.scope.resolve(Modules.USER)
  const [currentUser] = await userModule.listUsers({
    id: [currentUserId],
  })

  const isSuperAdmin = currentUser?.metadata?.role === "super_admin"

  if (!isSuperAdmin && currentUserId !== userId) {
    return res.status(403).json({
      message: "You can only update your own profile",
    })
  }

  try {
    const { result } = await updateAdminUserWorkflow(req.scope).run({
      input: {
        user_id: userId,
        ...req.validatedBody,
      },
    })

    res.json({
      message: "User updated successfully",
      user: {
        id: result.id,
        email: result.email,
        first_name: result.first_name,
        last_name: result.last_name,
        role: result.metadata?.role,
        is_active: result.metadata?.is_active,
      },
    })
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to update user",
    })
  }
}

// Delete admin user
export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const currentUserId = req.auth_context?.actor_id
  const userId = req.params.id

  // Prevent self-deletion
  if (currentUserId === userId) {
    return res.status(400).json({
      message: "You cannot delete your own account",
    })
  }

  // Check if current user is super_admin
  const userModule = req.scope.resolve(Modules.USER)
  const [currentUser] = await userModule.listUsers({
    id: [currentUserId],
  })

  const isSuperAdmin = currentUser?.metadata?.role === "super_admin"

  if (!isSuperAdmin) {
    return res.status(403).json({
      message: "Only super admins can delete users",
    })
  }

  try {
    await deleteAdminUserWorkflow(req.scope).run({
      input: { user_id: userId },
    })

    res.json({ message: "User deleted successfully" })
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to delete user",
    })
  }
}
