import AdminHeader from '@/components/AdminHeader'
import React from 'react'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div className='overflow-x-hidden'>
      <AdminHeader />
      <Outlet />
    </div>
  )
}

export default AdminLayout
