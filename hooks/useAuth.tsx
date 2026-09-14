"use client";
import { useEffect } from "react";
import { useProfileStore } from "@/store/useProfileStore";
import { useRouter } from "next/navigation";
import { Role } from "@/types";

export function useAuth() {
  const {
    profile,
    initializeProfile,
    users,
    isInitialized,
    login,
    signup,
    logout,
  } = useProfileStore();
  const router = useRouter();

  useEffect(() => {
    initializeProfile();
  }, [initializeProfile]);

  const isLoggedIn = !!profile;
  const isAdmin = profile?.role === Role.ADMIN;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return {
    profile,
    users,
    isLoggedIn,
    isAdmin,
    isInitialized,
    userRole: profile?.role,
    login,
    signup,
    logout: handleLogout,
  };
}