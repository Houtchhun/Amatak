"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function UserManagementTable() {
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [editRole, setEditRole] = useState("")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    if (typeof window !== "undefined") {
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
      setUsers(storedUsers)
    }
  }

  const handleEditClick = (user) => {
    setEditingUser(user)
    setEditRole(user.role)
  }

  const handleSaveEdit = () => {
    if (editingUser) {
      const updatedUsers = users.map((user) =>
        user.phone === editingUser.phone ? { ...user, role: editRole } : user
      )
      setUsers(updatedUsers)
      if (typeof window !== "undefined") {
        localStorage.setItem("users", JSON.stringify(updatedUsers))
      }
      setEditingUser(null)
      setEditRole("")
    }
  }

  const handleDeleteUser = (phone) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter((user) => user.phone !== phone)
      setUsers(updatedUsers)
      if (typeof window !== "undefined") {
        localStorage.setItem("users", JSON.stringify(updatedUsers))
      }
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow p-8 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">User Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {users.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-3 px-6 text-center">No users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.phone} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{user.phone}</td>
                  <td className="py-3 px-6 text-left">
                    {editingUser && editingUser.phone === user.phone ? (
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className="capitalize">{user.role}</span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {editingUser && editingUser.phone === user.phone ? (
                      <Button onClick={handleSaveEdit} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2">
                        Save
                      </Button>
                    ) : (
                      <Button onClick={() => handleEditClick(user)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2">
                        Edit
                      </Button>
                    )}
                    <Button onClick={() => handleDeleteUser(user.phone)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
