import { Button } from '@/components/ui/button'
import { useAppStore } from '@/Store/store';
import { apiClient } from '@/utils/api-client';
import { ADMIN_AUTH_LOGOUT } from '@/utils/constant';
import React from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner';

const AdminDashboard = () => {
  const {userInfo , setUserInfo} = useAppStore();
  const logout = async() => {
    try{
      const response = await apiClient.get(ADMIN_AUTH_LOGOUT,{withCredentials:true});
      if(response && response.status === 200){
        setUserInfo(null);
        toast.success("Logged Out Successfully");
      }
    }catch(error){
      console.log(error);
    }
  }
  return (
    <div>
      <Link to="/admin/inventory">
      <Button>Inventory</Button>
      <Button onClick={logout} >Log Out</Button>
      </Link>
    </div>
  )
}

export default AdminDashboard
