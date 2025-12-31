import { useState, useEffect } from "react"
import { Container, Heading, Button, Table, Badge, Input, toast } from "@medusajs/ui"
import { PencilSquare, Trash, Plus, ArrowPath } from "@medusajs/icons"
import { useNavigate } from "react-router-dom"

interface AdminUser {
  id: string
  email: string
  first_name: string
  last_name: string
  role: "admin" | "super_admin" | "moderator"
  is_active: boolean
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()
  }, [searchQuery])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set("q", searchQuery)

      const response = await fetch(`/admin/users?${params.toString()}`, {
        credentials: "include",
      })
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      toast.error("Failed to fetch users")
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}?`)) return

    try {
      const response = await fetch(`/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        toast.success("User deleted successfully")
        fetchUsers()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to delete user")
      }
    } catch (error) {
      toast.error("Failed to delete user")
      console.error("Error deleting user:", error)
    }
  }

  const getRoleBadge = (role: string) => {
    const colors = {
      super_admin: "red",
      admin: "blue",
      moderator: "green",
    }
    return (
      <Badge color={colors[role] || "grey"}>
        {role.replace("_", " ").toUpperCase()}
      </Badge>
    )
  }

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <Heading level="h1">Admin Users</Heading>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus /> Create User
        </Button>
      </div>

      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search by email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <ArrowPath className="animate-spin" />
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Role</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Created</Table.HeaderCell>
              <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={6} className="text-center py-8 text-gray-500">
                  No users found
                </Table.Cell>
              </Table.Row>
            ) : (
              users.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>
                    {user.first_name} {user.last_name}
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{getRoleBadge(user.role)}</Table.Cell>
                  <Table.Cell>
                    <Badge color={user.is_active ? "green" : "red"}>
                      {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => navigate(`/users/${user.id}`)}
                      >
                        <PencilSquare /> Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() =>
                          handleDelete(
                            user.id,
                            `${user.first_name} ${user.last_name}`
                          )
                        }
                      >
                        <Trash /> Delete
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      )}

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            fetchUsers()
          }}
        />
      )}
    </Container>
  )
}

function CreateUserModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "admin" as "admin" | "super_admin" | "moderator",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("User created successfully")
        onSuccess()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to create user")
      }
    } catch (error) {
      toast.error("Failed to create user")
      console.error("Error creating user:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create Admin User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              required
              minLength={8}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 8 characters
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              First Name
            </label>
            <Input
              type="text"
              required
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <Input
              type="text"
              required
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
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
          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading}>
              Create User
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
