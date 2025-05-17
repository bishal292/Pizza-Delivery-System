import AdminHeader from '@/components/AdminHeader'
import Footer from '@/components/Footer'
import React from 'react'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div className='flex flex-col justify-between overflow-x-hidden'>
      <AdminHeader />
      <div className='flex-1'>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default AdminLayout
