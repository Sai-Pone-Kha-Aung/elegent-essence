"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { INITIAL_USERS } from "@/lib/data";

interface ProfileContextType {
  profile: User | null;
  users: User[];
  saveProfile: (updates: Partial<User>) => void;
  toggleSuspendUser: (email: string) => void;
  changeUserRole: (email: string, role: "Customer" | "Admin") => void;
  addUser: (user: Omit<User, "joined">) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("ee_users");
    if (stored) {
      const parsedUsers = JSON.parse(stored) as User[];
      setUsers(parsedUsers);
      const john = parsedUsers.find((u) => u.email === "john.doe@example.com");
      setProfile(john || parsedUsers[0]);
    } else {
      setUsers(INITIAL_USERS);
      const john = INITIAL_USERS.find((u) => u.email === "john.doe@example.com");
      setProfile(john || INITIAL_USERS[0]);
      localStorage.setItem("ee_users", JSON.stringify(INITIAL_USERS));
    }
  }, []);

  const saveUsersState = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem("ee_users", JSON.stringify(newUsers));
    
    // Also sync profile if it changed
    if (profile) {
      const updatedJohn = newUsers.find((u) => u.email === profile.email);
      if (updatedJohn) {
        setProfile(updatedJohn);
      }
    }
  };

  const saveProfile = (updates: Partial<User>) => {
    if (!profile) return;
    const updatedUsers = users.map((u) => {
      if (u.email === profile.email) {
        return { ...u, ...updates };
      }
      return u;
    });
    saveUsersState(updatedUsers);
  };

  const toggleSuspendUser = (email: string) => {
    const updatedUsers = users.map((u) => {
      if (u.email === email) {
        return {
          ...u,
          status: u.status === "Active" ? ("Suspended" as const) : ("Active" as const),
        };
      }
      return u;
    });
    saveUsersState(updatedUsers);
  };

  const changeUserRole = (email: string, role: "Customer" | "Admin") => {
    const updatedUsers = users.map((u) => {
      if (u.email === email) {
        return { ...u, role };
      }
      return u;
    });
    saveUsersState(updatedUsers);
  };

  const addUser = (user: Omit<User, "joined">) => {
    const newUser: User = {
      ...user,
      joined: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }),
    };
    saveUsersState([...users, newUser]);
  };

  return (
    <ProfileContext.Provider
      value={{ profile, users, saveProfile, toggleSuspendUser, changeUserRole, addUser }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
