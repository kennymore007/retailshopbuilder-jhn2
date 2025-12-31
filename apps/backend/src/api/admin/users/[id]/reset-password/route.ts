import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { resetAdminPasswordWorkflow } from "../../../../../workflows/admin-user/reset-admin-password"

export const POST = async (
  req: AuthenticatedMedusaRequest<{
    new_password: string
  }>,
  res: MedusaResponse
) => {
  const currentUserId = req.auth_context?.actor_id
  const userId = req.params.id

  // Check if current user is super_admin or resetting their own password
  const userModule = req.scope.resolve(Modules.USER)
  const [currentUser] = await userModule.listUsers({
    id: [currentUserId],
  })

  const isSuperAdmin = currentUser?.metadata?.role === "super_admin"
  const isSelfReset = currentUserId === userId

  if (!isSuperAdmin && !isSelfReset) {
    return res.status(403).json({
      message: "You can only reset your own password",
    })
  }

  const { new_password } = req.validatedBody

  if (!new_password || new_password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long",
    })
  }

  try {
    await resetAdminPasswordWorkflow(req.scope).run({
      input: {
        user_id: userId,
        new_password,
      },
    })

    res.json({ message: "Password reset successfully" })
  } catch (error) {
    res.status(400).json({
      message: error.message || "Failed to reset password",
    })
  }
}
