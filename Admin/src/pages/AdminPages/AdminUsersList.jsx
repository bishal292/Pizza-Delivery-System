import React, { useEffect, useState } from "react";
import { apiClient } from "../../utils/api-client";
import {
  ADMIN_DELETE_USER,
  ADMIN_GET_ALL_USERS,
  ADMIN_SEARCH_USER,
  ADMIN_UPDATE_USER,
} from "../../utils/constant";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import LoadingScreen from "@/components/LoadingScreen";
import { Mail } from "lucide-react";

const AdminUsersList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [updatedFields, setUpdatedFields] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmationUserId, setConfirmationUserId] = useState(null);
  const [limit, setLimit] = useState(25);
  const [searchQuery, setSearchQuery] = useState(
    new URLSearchParams(location.search).get("id") || ""
  );
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (reset = false) => {
    try {
      setLoading(true);
      const response = await apiClient.get(ADMIN_GET_ALL_USERS, {
        params: { limit, skip },
      });
      if (response.status === 200) {
        setUsers((prevUsers) =>
          reset ? response.data : [...prevUsers, ...response.data]
        );
        setSkip(skip + limit);
        setHasMore(response.data.length === limit);
      } else if (response.status === 204) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(ADMIN_SEARCH_USER, {
        params: { q: searchQuery },
      });
      if (response.data) {
        setSearchResults(response.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUsers([]);
    setSkip(0);
    fetchUsers(true);
  }, [limit]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 3) {
        fetchSearchResults();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn); // Cleanup the timeout on component unmount or query change
  }, [searchQuery]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("id");
    if (query && query !== searchQuery) {
      setSearchQuery(query);
    }
  }, [location.search]);

  const handleDelete = async () => {
    try {
      const response = await apiClient.delete(
        `${ADMIN_DELETE_USER}?id=${confirmationUserId}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("User Deleted Successfully");
        setUsers(users.filter((user) => user.id !== confirmationUserId));
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setConfirmationUserId(null);
    }
  };

  const handleUpdate = (user) => {
    setEditUser(user);
    setUpdatedFields({ name: user.name, email: user.email, password: "" });
    setIsEditing(true);
  };

  const handleSaveUpdate = async () => {
    try {
      if (
        !updatedFields.name &&
        !updatedFields.email &&
        !updatedFields.password
      ) {
        toast.error("Please enter some fields to update.");
        return;
      }
      if (updatedFields.name === editUser.name) {
        delete updatedFields.name;
      }
      if (updatedFields.email === editUser.email) {
        delete updatedFields.email;
      }
      if (
        !updatedFields.name &&
        !updatedFields.email &&
        !updatedFields.password
      ) {
        toast.error("Some feilds must be different to update.");
        return;
      }
      if (updatedFields.name && updatedFields.name.length < 3) {
        toast.error("Name must be at least 3 characters long.");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (updatedFields.email && !emailRegex.test(updatedFields.email)) {
        toast.error("Please Enter A Valid email");
      }

      if (updatedFields.password && updatedFields.password.length < 5) {
        toast.error("Password must be at least 5 characters long.");
        return;
      }

      const response = await apiClient.patch(
        `${ADMIN_UPDATE_USER}?id=${editUser.id}`,
        {
          ...updatedFields,
        },
        { withCredentials: true }
      );
      if (response.status === 200 && response.data?.user) {
        setUsers(
          users.map((user) => {
            if (user.id === editUser.id) {
              user.name = response.data.user.name;
              user.email = response.data.user.email;
            }
            return user;
          })
        );
        toast.success("User Updated Successfully");
      }
    } catch (error) {
      toast.error(error.response?.data || error.message);
    } finally {
      setIsEditing(false);
      setEditUser(null);
      setUpdatedFields({ name: "", email: "", password: "" });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditUser(null);
    setUpdatedFields({ name: "", email: "", password: "" });
  };

  const handleShowMore = () => {
    fetchUsers();
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);
    setSkip(0); // Reset skip when searching
    if (query.length >= 3) {
      navigate(`?id=${query}`);
    } else {
      navigate(location.pathname); // Remove query from URL if input is cleared
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="mr-2">Search:</label>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-2 border border-gray-300 rounded"
            placeholder="Search by name or email"
          />
        </div>
        <div>
          <label className="mr-2">Limit:</label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(parseInt(e.target.value));
              setSkip(0); // Reset skip when limit changes
            }}
            className="p-2 border border-gray-300 rounded"
            disabled={loading} // Disable dropdown during loading
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {loading && <LoadingScreen message="Fetching Users..." />}

      {!loading && searchQuery.trim().length >= 3 && (
        <div>
          <h2 className="text-xl text-center font-bold mb-4">Search Results</h2>
          {searchResults.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border border-gray-300">#</th>
                  <th className="p-3 border border-gray-300">Name</th>
                  <th className="p-3 border border-gray-300">Email</th>
                  <th className="p-3 border border-gray-300">Total Orders</th>
                  <th className="p-3 border border-gray-300">Cart</th>
                  <th className="p-3 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b bg-slate-100 border-gray-300"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.totalOrder}</td>
                    <td className="p-3">
                      {user.cart ? (
                        <Link
                          href={`/admin/cart/${user.cart}`}
                          onClick={() => handleCartClick(user.cart)}
                          className="text-blue-500 underline"
                        >
                          View Cart
                        </Link>
                      ) : (
                        "No Cart"
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleUpdate(user)}
                        className="mr-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmationUserId(user.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">
              No such user found matching with the details.
            </p>
          )}
        </div>
      )}

      {/* Normal Users List */}
      <h2 className="text-xl font-bold mb-4">All Users</h2>
      {users && users.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300 mb-6">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border border-gray-300 text-center">#</th>
              <th className="p-3 border border-gray-300 text-center">Name</th>
              <th className="p-3 border border-gray-300 text-center">Email</th>
              <th className="p-3 border border-gray-300 text-center">Total Orders</th>
              <th className="p-3 border border-gray-300 text-center">Cart</th>
              <th className="p-3 border border-gray-300 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="border-b border-gray-300">
                <td className="p-3 text-center">{index + 1}</td>
                <td className="p-3 text-center">{user.name}</td>
                <td className="text-blue-500 p-3 text-center" ><a href={`mailto:${user.email}`} >{user.email}</a></td>
                <td className="p-3 text-center">
                  {user.totalOrder > 0 ? (
                    <Link to={`/admin/user/orders/${user.id}`}
                    className="text-blue-500 underline font-bold"
                    > {user.totalOrder}</Link>
                  ) : (
                    user.totalOrder
                  )}
                </td>
                <td className="p-3 text-center">
                  {user.cart ? (
                    <Link
                      to={`/admin/cart/${user.cart}`}
                      // onClick={() => handleCartClick(user.cart)}
                      className="text-blue-500 underline"
                    >
                      View Cart
                    </Link>
                  ) : (
                    "No Cart"
                  )}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleUpdate(user)}
                    className="mr-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmationUserId(user.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">No users found.</p>
      )}

      {!loading && hasMore && (
        <div className="text-center mt-4">
          <button
            onClick={handleShowMore}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Show More...
          </button>
        </div>
      )}

      {/* Confirmation Overlay */}
      {confirmationUserId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this user?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setConfirmationUserId(null)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <div className="mb-4">
              <label className="block text-gray-700">
                PrevName: {editUser.name}
              </label>
              <input
                type="text"
                value={updatedFields.name}
                onChange={(e) =>
                  setUpdatedFields({ ...updatedFields, name: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                PrevEmail: <b>{editUser.email}</b>{" "}
              </label>
              <input
                type="email"
                value={updatedFields.email}
                onChange={(e) =>
                  setUpdatedFields({ ...updatedFields, email: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={updatedFields.password}
                onChange={(e) =>
                  setUpdatedFields({
                    ...updatedFields,
                    password: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCancel}
                className="mr-3 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersList;
