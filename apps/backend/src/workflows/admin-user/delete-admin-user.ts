import {
  createWorkflow,
  createStep,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

interface DeleteAdminUserInput {
  user_id: string
}

const deleteAdminUserStep = createStep(
  "delete-admin-user-step",
  async (input: DeleteAdminUserInput, { container }) => {
    const userModule = container.resolve(Modules.USER)
    const authModule = container.resolve(Modules.AUTH)

    // Get user data for rollback
    const [user] = await userModule.listUsers({
      id: [input.user_id],
    })

    if (!user) {
      throw new Error(`User with ID ${input.user_id} not found`)
    }

    // Get auth identities
    const authIdentities = await authModule.listAuthIdentities({
      app_metadata: {
        user_id: input.user_id,
      },
    })

    // Delete auth identities
    if (authIdentities.length > 0) {
      await authModule.deleteAuthIdentities(authIdentities.map((ai) => ai.id))
    }

    // Delete user
    await userModule.deleteUsers([input.user_id])

    return new StepResponse(
      { success: true },
      {
        user,
        authIdentities,
      }
    )
  },
  async (compensateData, { container }) => {
    if (!compensateData) return

    const userModule = container.resolve(Modules.USER)
    const authModule = container.resolve(Modules.AUTH)

    // Restore user
    await userModule.createUsers(compensateData.user)

    // Restore auth identities
    for (const authIdentity of compensateData.authIdentities) {
      await authModule.createAuthIdentities(authIdentity)
    }
  }
)

export const deleteAdminUserWorkflow = createWorkflow(
  "delete-admin-user",
  (input: DeleteAdminUserInput) => {
    const result = deleteAdminUserStep(input)
    return new WorkflowResponse(result)
  }
)
