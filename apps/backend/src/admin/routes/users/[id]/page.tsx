import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Container, Heading, Button, Input, Label, toast } from "@medusajs/ui"
import { ArrowLeft } from "@medusajs/icons"

interface AdminUser {
  id: string
  email: string
  first_name: string
  last_name: string
  role: "admin" | "super_admin" | "moderator"
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function EditUserPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    role: "admin" as "admin" | "super_admin" | "moderator",
    is_active: true,
  })
  const [newPassword, setNewPassword] = useState("")
  const [showPasswordReset, setShowPasswordReset] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [id])

  const fetchUser = async () => {
    try {
      const response = await fetch(`/admin/users/${id}`, {
        credentials: "include",
      })
      const data = await response.json()
      setUser(data.user)
      setFormData({
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        role: data.user.role,
        is_active: data.user.is_active,
      })
    } catch (error) {
      toast.error("Failed to fetch user")
      console.error("Error fetching user:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/admin/users/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("User updated successfully")
        navigate("/users")
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to update user")
      }
    } catch (error) {
      toast.error("Failed to update user")
      console.error("Error updating user:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    try {
      const response = await fetch(`/admin/users/${id}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ new_password: newPassword }),
      })

      if (response.ok) {
        toast.success("Password reset successfully")
        setNewPassword("")
        setShowPasswordReset(false)
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to reset password")
      }
    } catch (error) {
      toast.error("Failed to reset password")
      console.error("Error resetting password:", error)
    }
  }

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center py-12">
          Loading...
        </div>
      </Container>
    )
  }

  if (!user) {
    return (
      <Container>
        <div className="text-center py-12">
          <p className="text-gray-500">User not found</p>
          <Button onClick={() => navigate("/users")} className="mt-4">
            Back to Users
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="mb-6">
        <Button
          variant="secondary"
          size="small"
          onClick={() => navigate("/users")}
        >
          <ArrowLeft /> Back to Users
        </Button>
      </div>

      <Heading level="h1" className="mb-6">
        Edit User: {user.email}
      </Heading>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Information Form */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">User Information</h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label htmlFor="email">Email (Read-only)</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                type="text"
                required
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                type="text"
                required
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                className="w-full border rounded px-3 py-2"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as any,
                  })
                }
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
            <Button type="submit" variant="primary" isLoading={saving}>
              Save Changes
            </Button>
          </form>
        </div>

        {/* Password Reset */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Security</h2>
          
          {!showPasswordReset ? (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Reset this user's password. They will need to use the new
                password to log in.
              </p>
              <Button
                variant="secondary"
                onClick={() => setShowPasswordReset(true)}
              >
                Reset Password
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="new_password">New Password</Label>
                <Input
                  id="new_password"
                  type="password"
                  minLength={8}
                  placeholder="Enter new password (min 8 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  onClick={handleResetPassword}
                  disabled={!newPassword || newPassword.length < 8}
                >
                  Confirm Reset
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowPasswordReset(false)
                    setNewPassword("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-medium mb-2">Account Details</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Created: {new Date(user.created_at).toLocaleString()}</p>
              <p>
                Last Updated: {new Date(user.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
