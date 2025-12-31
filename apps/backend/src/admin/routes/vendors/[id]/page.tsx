import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Badge, Button, Input, Textarea, Label } from "@medusajs/ui"
import { ArrowLeft, CheckCircleSolid, XCircleSolid } from "@medusajs/icons"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"

type Vendor = {
  id: string
  handle: string
  name: string
  description: string | null
  status: "pending" | "approved" | "rejected" | "suspended"
  created_at: string
  updated_at: string
  metadata: {
    business_email?: string
    business_phone?: string
    business_address?: string
    business_registration?: string
    tax_id?: string
    bank_account_number?: string
    bank_code?: string
    bank_account_name?: string
  }
}

const VendorDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<Vendor>>({})

  const { data: vendor, isLoading } = useQuery({
    queryKey: ["vendor", id],
    queryFn: async () => {
      const response = await fetch(`/admin/vendors/${id}`, {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch vendor")
      const data = await response.json()
      return data.vendor as Vendor
    },
    enabled: !!id,
  })

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Vendor>) => {
      const response = await fetch(`/admin/vendors/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to update vendor")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", id] })
      queryClient.invalidateQueries({ queryKey: ["vendors"] })
      setIsEditing(false)
    },
  })

  const approveMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/admin/vendors/${id}/approve`, {
        method: "POST",
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to approve vendor")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", id] })
      queryClient.invalidateQueries({ queryKey: ["vendors"] })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/admin/vendors/${id}/reject`, {
        method: "POST",
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to reject vendor")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", id] })
      queryClient.invalidateQueries({ queryKey: ["vendors"] })
    },
  })

  const suspendMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/admin/vendors/${id}/suspend`, {
        method: "POST",
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to suspend vendor")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", id] })
      queryClient.invalidateQueries({ queryKey: ["vendors"] })
    },
  })

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <p className="text-ui-fg-subtle">Loading vendor...</p>
        </div>
      </Container>
    )
  }

  if (!vendor) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-ui-fg-subtle mb-4">Vendor not found</p>
          <Button onClick={() => navigate("/vendors")}>
            Back to Vendors
          </Button>
        </div>
      </Container>
    )
  }

  const getStatusBadge = (status: Vendor["status"]) => {
    const variants = {
      pending: { color: "orange" as const, label: "Pending" },
      approved: { color: "green" as const, label: "Approved" },
      rejected: { color: "red" as const, label: "Rejected" },
      suspended: { color: "grey" as const, label: "Suspended" },
    }
    const { color, label } = variants[status]
    return <Badge color={color}>{label}</Badge>
  }

  const handleSave = () => {
    updateMutation.mutate(formData)
  }

  const startEditing = () => {
    setFormData({
      name: vendor.name,
      description: vendor.description,
      metadata: { ...vendor.metadata },
    })
    setIsEditing(true)
  }

  return (
    <Container>
      <div className="mb-6">
        <Button
          variant="transparent"
          onClick={() => navigate("/vendors")}
          className="mb-4"
        >
          <ArrowLeft />
          Back to Vendors
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <Heading level="h1">{vendor.name}</Heading>
            <div className="flex items-center gap-3 mt-2">
              {getStatusBadge(vendor.status)}
              <span className="text-sm text-ui-fg-subtle">
                Handle: <code>{vendor.handle}</code>
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {vendor.status === "pending" && (
              <>
                <Button
                  variant="secondary"
                  onClick={() => approveMutation.mutate()}
                  disabled={approveMutation.isPending}
                >
                  <CheckCircleSolid />
                  Approve
                </Button>
                <Button
                  variant="danger"
                  onClick={() => rejectMutation.mutate()}
                  disabled={rejectMutation.isPending}
                >
                  <XCircleSolid />
                  Reject
                </Button>
              </>
            )}
            {vendor.status === "approved" && (
              <Button
                variant="danger"
                onClick={() => suspendMutation.mutate()}
                disabled={suspendMutation.isPending}
              >
                <XCircleSolid />
                Suspend
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Basic Information */}
        <div className="bg-ui-bg-base border border-ui-border-base rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Heading level="h2">Basic Information</Heading>
            {!isEditing ? (
              <Button variant="secondary" onClick={startEditing}>
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label>Vendor Name</Label>
              {isEditing ? (
                <Input
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              ) : (
                <p className="text-ui-fg-base mt-1">{vendor.name}</p>
              )}
            </div>

            <div>
              <Label>Description</Label>
              {isEditing ? (
                <Textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              ) : (
                <p className="text-ui-fg-base mt-1">
                  {vendor.description || "No description provided"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-ui-bg-base border border-ui-border-base rounded-lg p-6">
          <Heading level="h2" className="mb-4">
            Contact Information
          </Heading>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <p className="text-ui-fg-base mt-1">
                {vendor.metadata?.business_email || "Not provided"}
              </p>
            </div>
            <div>
              <Label>Phone</Label>
              <p className="text-ui-fg-base mt-1">
                {vendor.metadata?.business_phone || "Not provided"}
              </p>
            </div>
            <div className="col-span-2">
              <Label>Address</Label>
              <p className="text-ui-fg-base mt-1">
                {vendor.metadata?.business_address || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-ui-bg-base border border-ui-border-base rounded-lg p-6">
          <Heading level="h2" className="mb-4">
            Business Information
          </Heading>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Business Registration</Label>
              <p className="text-ui-fg-base mt-1">
                {vendor.metadata?.business_registration || "Not provided"}
              </p>
            </div>
            <div>
              <Label>Tax ID</Label>
              <p className="text-ui-fg-base mt-1">
                {vendor.metadata?.tax_id || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Bank Information */}
        <div className="bg-ui-bg-base border border-ui-border-base rounded-lg p-6">
          <Heading level="h2" className="mb-4">
            Bank Information
          </Heading>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Account Name</Label>
              <p className="text-ui-fg-base mt-1">
                {vendor.metadata?.bank_account_name || "Not provided"}
              </p>
            </div>
            <div>
              <Label>Account Number</Label>
              <p className="text-ui-fg-base mt-1">
                {vendor.metadata?.bank_account_number || "Not provided"}
              </p>
            </div>
            <div>
              <Label>Bank Code</Label>
              <p className="text-ui-fg-base mt-1">
                {vendor.metadata?.bank_code || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="bg-ui-bg-base border border-ui-border-base rounded-lg p-6">
          <Heading level="h2" className="mb-4">
            Timeline
          </Heading>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Created</Label>
              <p className="text-ui-fg-base mt-1">
                {new Date(vendor.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <Label>Last Updated</Label>
              <p className="text-ui-fg-base mt-1">
                {new Date(vendor.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default VendorDetailPage
