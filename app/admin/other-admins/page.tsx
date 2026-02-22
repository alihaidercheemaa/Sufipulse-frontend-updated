"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Users, Plus, Edit, Trash2, X, UserCog, Shield, Key } from "lucide-react"
import { registerSubadmin, deleteSubadmin, updateSubadmin, getAllSubadmins } from "@/services/auth"
import { SectionHeader, GridCard, EmptyState, LoadingState, StatusBadge } from "@/components/ui"

interface Admin {
  id: number
  name: string
  email: string
  role: string
  permissions: {
    kalams: string[]
    requests: string[]
    partnership_proposal: string[]
    vocalist: string[]
    writer: string[]
    notification: string[]
    blog: string[]
    recognitions: string[]
  }
  created_at: string
}

interface AdminFormData {
  name: string
  email: string
  password: string
  permissions: {
    kalams: string[]
    requests: string[]
    partnership_proposal: string[]
    vocalist: string[]
    writer: string[]
    notification: string[]
    blog: string[]
    recognitions: string[]
  }
}

const permissionOptions = {
  kalams: ["view"],
  requests: ["view"],
  partnership_proposal: ["view"],
  vocalist: ["view"],
  writer: ["view"],
  notification: ["view"],
  blog: ["view"],
  recognitions: ["view"],
}

const defaultPermissions: AdminFormData["permissions"] = {
  kalams: [],
  requests: [],
  partnership_proposal: [],
  vocalist: [],
  writer: [],
  notification: [],
  blog: [],
  recognitions: [],
}

export default function OtherAdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
  const [getLoading, setGetLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [formData, setFormData] = useState<AdminFormData>({
    name: "",
    email: "",
    password: "",
    permissions: { ...defaultPermissions },
  })

  useEffect(() => {
    const fetchAdmins = async () => {
      setGetLoading(true)
      try {
        const response = await getAllSubadmins()
        const subadmins: Admin[] = response.data.subadmins.map((a: any) => ({
          ...a,
          permissions: {
            ...defaultPermissions,
            ...a.permissions,
          },
        }))
        setAdmins(subadmins)
      } catch (error) {
        console.error("Failed to fetch admins:", error)
      } finally {
        setGetLoading(false)
      }
    }

    fetchAdmins()
  }, [])

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      permissions: { ...defaultPermissions },
    })
  }

  const handleAddNew = () => {
    resetForm()
    setEditingAdmin(null)
    setShowAddForm(true)
  }

  const handleEdit = (admin: Admin) => {
    setFormData({
      name: admin.name,
      email: admin.email,
      password: "",
      permissions: {
        ...defaultPermissions,
        ...admin.permissions,
      },
    })
    setEditingAdmin(admin)
    setShowAddForm(true)
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingAdmin(null)
    resetForm()
  }

  const handleDelete = async (adminId: number) => {
    setGetLoading(true)
    try {
      await deleteSubadmin(String(adminId))
      setAdmins(admins.filter((admin) => admin.id !== adminId))
    } catch (error) {
      console.error("Failed to delete admin:", error)
    } finally {
      setGetLoading(false)
    }

    setShowDeleteConfirm(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    if (editingAdmin) {
      try {
        const response = await updateSubadmin({ id: editingAdmin.id, ...formData })
        setAdmins(
          admins.map((admin) => (admin.id === editingAdmin.id ? { ...admin, ...formData } : admin))
        )
      } catch (err: any) {
        console.log(err.response?.data?.detail || err.message)
      } finally {
        setLoading(false)
      }
    } else {
      try {
        const response = await registerSubadmin(formData)
        const newAdmin: Admin = {
          ...response.data.user,
          role: "sub-admin",
          created_at: new Date().toISOString(),
          permissions: {
            ...defaultPermissions,
            ...response.data.user.permissions,
          },
        }
        setAdmins([...admins, newAdmin])
      } catch (err: any) {
        console.log(err.response?.data?.detail || err.message)
      } finally {
        setLoading(false)
      }
    }

    setShowAddForm(false)
    setEditingAdmin(null)
    resetForm()
  }

  const handlePermissionChange = (
    category: keyof typeof permissionOptions,
    permission: string,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [category]: checked
          ? [...(prev.permissions[category] || []), permission]
          : (prev.permissions[category] || []).filter((p) => p !== permission),
      },
    }))
  }

  const getPermissionsSummary = (permissions: Admin["permissions"]) => {
    if (!permissions) return "0 permissions"
    const totalPermissions = Object.values(permissions).flat().length
    return `${totalPermissions} permissions`
  }

  if (getLoading) {
    return <LoadingState message="Loading sub-admins..." />
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <SectionHeader
        title="Sub Admins"
        description="Manage sub-admin accounts and permissions"
        icon={<UserCog className="w-6 h-6" />}
        action={
          !showAddForm && (
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Admin
            </button>
          )
        }
      />

      {/* Stats Cards */}
      {!showAddForm && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <GridCard hover={false} className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-700">Total Admins</p>
                <p className="text-2xl font-bold text-emerald-900">{admins.length}</p>
              </div>
            </div>
          </GridCard>
          <GridCard hover={false} className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Active</p>
                <p className="text-2xl font-bold text-blue-900">{admins.length}</p>
              </div>
            </div>
          </GridCard>
          <GridCard hover={false} className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Key className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700">Permission Sets</p>
                <p className="text-2xl font-bold text-purple-900">
                  {new Set(admins.map((a) => JSON.stringify(a.permissions))).size}
                </p>
              </div>
            </div>
          </GridCard>
          <GridCard hover={false} className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <UserCog className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-700">Avg Permissions</p>
                <p className="text-2xl font-bold text-amber-900">
                  {admins.length > 0
                    ? Math.round(
                        admins.reduce((acc, a) => acc + Object.values(a.permissions).flat().length, 0) /
                          admins.length
                      )
                    : 0}
                </p>
              </div>
            </div>
          </GridCard>
        </div>
      )}

      {showAddForm && (
        <GridCard hover={false}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              {editingAdmin ? <Edit className="w-6 h-6 text-emerald-600" /> : <Plus className="w-6 h-6 text-emerald-600" />}
              {editingAdmin ? "Edit Admin" : "Add New Admin"}
            </h2>
            <button
              onClick={handleCancel}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!editingAdmin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter password"
                  />
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                Permissions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(permissionOptions).map(([category, permissions]) => (
                  <div
                    key={category}
                    className="bg-gradient-to-br from-emerald-50 to-emerald-100/30 border border-emerald-200 rounded-xl p-4"
                  >
                    <h4 className="text-sm font-semibold text-emerald-900 mb-3 capitalize">
                      {category.replace(/_/g, " ")}
                    </h4>
                    <div className="space-y-2">
                      {permissions.map((permission) => (
                        <label
                          key={permission}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={formData.permissions[
                              category as keyof typeof permissionOptions
                            ]?.includes(permission)}
                            onChange={(e) =>
                              handlePermissionChange(
                                category as keyof typeof permissionOptions,
                                permission,
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500"
                          />
                          <span className="text-sm text-emerald-800 capitalize group-hover:text-emerald-900 transition-colors">
                            {permission}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? (editingAdmin ? "Updating..." : "Adding...") : editingAdmin ? "Update Admin" : "Add Admin"}
              </button>
            </div>
          </form>
        </GridCard>
      )}

      {!showAddForm && (
        <>
          {admins.length === 0 ? (
            <GridCard hover={false}>
              <EmptyState
                icon={<UserCog className="w-8 h-8" />}
                title="No Sub-admins Found"
                description="There are currently no sub-admins. Click 'Add Admin' to create one."
                action={
                  <button
                    onClick={handleAddNew}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Add Admin
                  </button>
                }
              />
            </GridCard>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {admins.map((admin) => (
                <GridCard key={admin.id} hover={false} className="group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {admin.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{admin.name}</h3>
                        <p className="text-sm text-slate-600">{admin.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(admin.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <StatusBadge status="active" />
                    <span className="text-sm text-slate-600">
                      {getPermissionsSummary(admin.permissions)}
                    </span>
                  </div>

                  {/* Permissions Preview */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(admin.permissions)
                        .filter(([_, perms]) => perms.length > 0)
                        .slice(0, 4)
                        .map(([category, perms]) => (
                          <span
                            key={category}
                            className="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium"
                          >
                            {category.replace(/_/g, " ")}
                          </span>
                        ))}
                      {Object.values(admin.permissions).flat().length > 4 && (
                        <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-500 rounded-md text-xs">
                          +{Object.values(admin.permissions).flat().length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </GridCard>
              ))}
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Delete Admin</h3>
            <p className="text-sm text-slate-600 text-center mb-6">
              Are you sure you want to delete this admin? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
