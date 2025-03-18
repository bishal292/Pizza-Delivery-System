import React, { useEffect, useState } from 'react';
import { apiClient } from '../../utils/api-client';
import { ADMIN_DELETE_USER, ADMIN_GET_ALL_USERS } from '../../utils/constant';
import { useNavigate } from 'react-router-dom';

const AdminUsersList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get(ADMIN_GET_ALL_USERS);
        setUsers(response.data);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await apiClient.delete(`${ADMIN_DELETE_USER}/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const handleUpdate = (userId) => {
    navigate(`/admin/user/${userId}`);
  };

  return (
    <div>
      <h1>Users List</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Total Orders</th>
            <th>Cart</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.totalOrders}</td>
              <td>{user.cart}</td>
              <td>
                <button onClick={() => handleUpdate(user.id)}>Update</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersList;
