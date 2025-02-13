import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/Store/store";
import { apiClient } from "@/utils/api-client";
import { ADMIN_AUTH_FORGOT_PASS, ADMIN_AUTH_LOGIN, ADMIN_AUTH_RESET_PASS, ADMIN_AUTH_SIGNUP } from "@/utils/constant";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AdminAuth = ({ action }) => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpgenerated, setOtpgenerated] = useState(false);

  useEffect(() => {
    if (userInfo && userInfo.role === "admin") {
      navigate("/admin/dashboard");
    }
    setLoading(false);
  }, [userInfo]);

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
    if (validateLogin()) {
      try {
        const response = await apiClient.post(ADMIN_AUTH_LOGIN, {
          email,
          password,
        });
        if (response.status === 200 && response.data) {
          setUserInfo(response.data);

          toast.success("Logged in successfully");
          navigate("/admin/dashboard");
        }
      } catch (error) {
        console.error("Error during login:", error);
        if (error.response) {
          const status = error.response.status;
          if (status === 401) {
            toast.error("Invalid credentials");
          } else {
            toast.error("An unknown error occurred");
          }
        } else {
          toast.error("Network error. Please try again later.");
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false); // Stop loading if validation fails
    }
  };

  const handleSignup = async () => {
    setIsSubmitting(true);
    if (validateSignup()) {
      try {
        const response = await apiClient.post(ADMIN_AUTH_SIGNUP, {
          name,
          email,
          password,
          confirmPassword,
          secretKey,
        });
        console.log(response);
        if (response.status === 201 && response.data) {
          setUserInfo(response.data);
          toast.success("Admin Created successfully");
          navigate("/admin/dashboard");
        }
      } catch (error) {
        console.error("Error during Signup :", error);
        if (error.response) {
          const status = error.response.status;
          if (status === 400) {
            toast.error("User Already Exists with this email or invalid email");
          } else if (status === 401) {
            toast.error("Invalid Secret Key");
          } else {
            toast.error("An unknown error occurred");
          }
        } else {
          toast.error("Network error. Please try again later.");
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    setIsSubmitting(true);
    if (!email.length) {
      toast.error("Email is required");
      setIsSubmitting(false);
      return false;
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        setIsSubmitting(false);
        toast.error("Invalid Email");
        return false;
      }
    }
    try {
      const response = await apiClient.post(ADMIN_AUTH_FORGOT_PASS, { email });
      if (response.status === 200) {
        setOtpgenerated(true);
        toast.success("OTP sent to your email");
        navigate("/admin/auth/resetPassword");
      }
    } catch (error) {
      console.error("Error during forgot password:", error);
      if (error.response) {
        if (error.response.data.message) {
          setOtpgenerated(true);
          toast.error(error.response.data.message);
        }
        if (error.response.status === 400) {
          toast.error("User not found with this email");
        } else if (error.response.status === 409) {
          toast.error("OTP already sent to your email");
          navigate("/admin/auth/resetPassword");
        }
      } else {
        toast.error("Network error. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (
      otp.length < 6 ||
      !email.length ||
      !password.length ||
      !confirmPassword.length
    ) {
      toast.error("All fields is required");
      return;
    }
    if (password != confirmPassword) {
      toast.error("Password and Confirm Password must be same");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await apiClient.patch(ADMIN_AUTH_RESET_PASS, {
        email,
        otp,
        password,
        confirmPassword,
      });
      if (response.status === 200) {
        toast.success("Password reset successfully");
        navigate("/admin/auth/login");
      }
    } catch (error) {
      console.error("Error during reset password:", error);
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          toast.error("Invalid OTP");
        } else if (status === 409) {
          toast.error("Old and new password cannot be same");
        } else {
          toast.error("An unknown error occurred");
        }
      } else {
        toast.error("Network error. Please try again later.");
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
        {(() => {
          switch (action) {
            case "login":
            case "signup":
              return (
                <Tabs value={`${action}`}>
                  <TabsList className="grid w-full grid-cols-2 ">
                    <TabsTrigger value="login">
                      <Link to="/admin/auth/login" className="w-full">
                        Log In
                      </Link>
                    </TabsTrigger>
                    <TabsTrigger value="signup">
                      <Link to="/admin/auth/signup" className="w-full">
                        Sign Up
                      </Link>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="login" className="flex gap-3 flex-col">
                    <Input
                      placeholder="Enter Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-7 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <Input
                      placeholder="Enter Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />

                    <Link
                      to="/admin/auth/forgot"
                      className="text-indigo-600 text-sm font-bold"
                    >
                      Forgot password?
                    </Link>
                    <div>
                      Don't have an account?{" "}
                      <Link
                        to="/admin/auth/signup"
                        className="text-indigo-600 text-sm font-bold"
                      >
                        Register Here..
                      </Link>
                    </div>

                    <Button
                      className="w-full bg-indigo-600 text-white py-2 rounded-md mt-4"
                      onClick={handleLogin}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Please Wait..." : "Login"}
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
                      placeholder="Admin Secret Key"
                      type="password"
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

                    <div>
                      Already have an account?{" "}
                      <Link
                        to="/admin/auth/login"
                        className="text-indigo-600 text-sm font-bold"
                      >
                        Login Here..
                      </Link>
                    </div>

                    <Button
                      className="w-full bg-indigo-600 text-white py-2 rounded-md mt-4"
                      onClick={handleSignup}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Signing Up..." : "Sign Up"}
                    </Button>
                  </TabsContent>
                </Tabs>
              );
            case "forgot":
              return (
                <div>
                  <Input
                    placeholder="Enter email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 mb-3 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <div className="my-2">
                    Remember your Password?
                    <Link
                      to="/admin/auth/login"
                      className="text-indigo-600 text-sm font-bold"
                    >
                      Login Here..
                    </Link>
                  </div>
                  <div>
                    Already have an OTP ?{" "}
                    <Link
                      to="/admin/auth/resetPassword"
                      className="text-indigo-600 text-sm font-bold"
                    >
                      Click Here..
                    </Link>
                  </div>
                  <Button
                    className="w-full bg-indigo-600 text-white py-2 rounded-md mt-4"
                    onClick={handleForgotPassword}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Generating OTP..." : "Generate OTP"}
                  </Button>
                </div>
              );
            case "resetPassword":
              return (
                <>
                  <div className="flex flex-col gap-5 w-full">
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>

                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Email"
                    />
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new Password"
                    />
                    <Input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                    />
                  </div>
                  <div className="my-1 mt-3">
                    Didn't receive OTP?
                    <Link
                      to="/admin/auth/forgot"
                      className="text-indigo-600 text-sm font-bold"
                    >
                      Resend OTP
                    </Link>
                  </div>
                  <Button
                    className="w-full bg-indigo-600 text-white py-2 rounded-md mt-4"
                    onClick={handleResetPassword}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting Request..." : "Submit"}
                  </Button>
                </>
              );
            default:
              return <h1>Invalid Action</h1>;
          }
        })()}
      </div>
    </div>
  );
};

export default AdminAuth;
