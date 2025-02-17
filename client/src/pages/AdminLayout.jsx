import AdminHeader from '@/components/AdminHeader'
import React from 'react'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div>
      <AdminHeader />
      <Outlet />
    </div>
  )
}

export default AdminLayout
