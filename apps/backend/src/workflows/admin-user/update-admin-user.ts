import {
  createWorkflow,
  createStep,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

interface UpdateAdminUserInput {
  user_id: string
  first_name?: string
  last_name?: string
  role?: "admin" | "super_admin" | "moderator"
  is_active?: boolean
}

const updateAdminUserStep = createStep(
  "update-admin-user-step",
  async (input: UpdateAdminUserInput, { container }) => {
    const userModule = container.resolve(Modules.USER)

    // Get current user data for rollback
    const [currentUser] = await userModule.listUsers({
      id: [input.user_id],
    })

    if (!currentUser) {
      throw new Error(`User with ID ${input.user_id} not found`)
    }

    // Update user
    const updatedUser = await userModule.updateUsers({
      id: input.user_id,
      first_name: input.first_name,
      last_name: input.last_name,
      metadata: {
        ...currentUser.metadata,
        role: input.role || currentUser.metadata?.role,
        is_active: input.is_active !== undefined ? input.is_active : true,
      },
    })

    return new StepResponse(updatedUser, {
      userId: input.user_id,
      previousData: {
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        metadata: currentUser.metadata,
      },
    })
  },
  async (compensateData, { container }) => {
    if (!compensateData) return

    const userModule = container.resolve(Modules.USER)

    // Rollback to previous values
    await userModule.updateUsers({
      id: compensateData.userId,
      ...compensateData.previousData,
    })
  }
)

export const updateAdminUserWorkflow = createWorkflow(
  "update-admin-user",
  (input: UpdateAdminUserInput) => {
    const result = updateAdminUserStep(input)
    return new WorkflowResponse(result)
  }
)
