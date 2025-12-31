import {
  createWorkflow,
  createStep,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

interface ResetPasswordInput {
  user_id: string
  new_password: string
}

const resetAdminPasswordStep = createStep(
  "reset-admin-password-step",
  async (input: ResetPasswordInput, { container }) => {
    const authModule = container.resolve(Modules.AUTH)

    // Find auth identity for user
    const authIdentities = await authModule.listAuthIdentities({
      app_metadata: {
        user_id: input.user_id,
      },
    })

    if (authIdentities.length === 0) {
      throw new Error(`No auth identity found for user ${input.user_id}`)
    }

    const authIdentity = authIdentities[0]

    // Update password
    await authModule.updateAuthIdentities({
      id: authIdentity.id,
      provider_metadata: {
        password: input.new_password,
      },
    })

    return new StepResponse({ success: true, user_id: input.user_id })
  }
)

export const resetAdminPasswordWorkflow = createWorkflow(
  "reset-admin-password",
  (input: ResetPasswordInput) => {
    const result = resetAdminPasswordStep(input)
    return new WorkflowResponse(result)
  }
)
