import {
  createWorkflow,
  createStep,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { MedusaError } from "@medusajs/framework/utils"

interface CreateAdminUserInput {
  email: string
  password: string
  first_name: string
  last_name: string
  role?: "admin" | "super_admin" | "moderator"
}

const createAdminUserStep = createStep(
  "create-admin-user-step",
  async (input: CreateAdminUserInput, { container }) => {
    const userModule = container.resolve(Modules.USER)
    const authModule = container.resolve(Modules.AUTH)

    // Check if user already exists
    const existingUsers = await userModule.listUsers({
      email: input.email,
    })

    if (existingUsers.length > 0) {
      throw new MedusaError(
        MedusaError.Types.DUPLICATE_ERROR,
        `User with email ${input.email} already exists`
      )
    }

    // Create user
    const user = await userModule.createUsers({
      email: input.email,
      first_name: input.first_name,
      last_name: input.last_name,
      metadata: {
        role: input.role || "admin",
        created_at: new Date().toISOString(),
      },
    })

    // Create auth identity with password
    const authIdentity = await authModule.createAuthIdentities({
      provider: "emailpass",
      entity_id: user.id,
      provider_metadata: {
        password: input.password,
      },
      app_metadata: {
        actor_type: "user",
        user_id: user.id,
      },
    })

    return new StepResponse(
      { user, authIdentity },
      { userId: user.id, authIdentityId: authIdentity.id }
    )
  },
  async (compensateData, { container }) => {
    if (!compensateData) return

    const userModule = container.resolve(Modules.USER)
    const authModule = container.resolve(Modules.AUTH)

    // Rollback: Delete user and auth identity
    try {
      await authModule.deleteAuthIdentities([compensateData.authIdentityId])
      await userModule.deleteUsers([compensateData.userId])
    } catch (error) {
      console.error("Failed to rollback user creation:", error)
    }
  }
)

export const createAdminUserWorkflow = createWorkflow(
  "create-admin-user",
  (input: CreateAdminUserInput) => {
    const result = createAdminUserStep(input)
    return new WorkflowResponse(result)
  }
)
