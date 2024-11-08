import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const AdminAuth = () => {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLoading(false);
  });

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        toast.error("Invalid Email");
        return false;
      }
    }
    if (password.length < 3) {
      toast.error("Password must be at least 3 characters long");
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        toast.error("Invalid Email");
        return false;
      }
    }
    if (!name.length) {
      toast.error("Name is required");
      return false;
    }
    if (!secretKey.length) {
      toast.error("Secret Key is required");
      return false;
    }
    if (password.length < 3) {
      toast.error("Password must be at least 3 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  // Login function to authenticate the user along with the toast notification for error handling.
  const handleLogin = async () => {
    setIsSubmitting(true);
    try {
      if (validateLogin()) {
        toast.success("Logging in...");        
      }
    } catch (error) {
        if (error.response.status) {
            const status = error.response.status;
            if (status === 400) {
            toast.error("All fields are required");
            } else if (status === 401) {
            toast.error("Invalid credentials");
            } else {
            toast.error("An unknown error occurred");
            }
        }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async () => {
    try {
      if (validateSignup()) {
        toast.success("Signing up...");
      }
    } catch (error) {
      if (error.response.status) {
        const status = error.response.status;
        if (status === 400) {
          toast.error("All fields are required");
        } else if (status === 409) {
          toast.error("User already exists with given email");
        } else {
          toast.error("An unknown error occurred");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-96 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Admin Auth</h1>

        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2 mb-10">
            <TabsTrigger value="login">Log In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="flex gap-3 flex-col">
            <Input
              placeholder="Enter Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <Input
              placeholder="Enter Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <Button
              className="w-full bg-indigo-600 text-white py-2 rounded-md mt-4"
              onClick={handleLogin}
            >
              Login
            </Button>
          </TabsContent>
          <TabsContent value="signup" className="flex gap-3 flex-col">
            <Input
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <Input
              placeholder="Enter email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <Input
              placeholder="Enter Secret Key"
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <Input
              placeholder="Enter password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <Input
              placeholder="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <Button
              className="w-full bg-indigo-600 text-white py-2 rounded-md mt-4"
              onClick={handleSignup}
            >
              Sign up
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminAuth;
