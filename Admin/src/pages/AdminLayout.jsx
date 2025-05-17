import AdminHeader from '@/components/AdminHeader'
import Footer from '@/components/Footer'
import React from 'react'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div className='overflow-x-hidden'>
      <AdminHeader />
      <Outlet />
      <Footer />
    </div>
  )
}

export default AdminLayout
