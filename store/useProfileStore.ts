import { create } from "zustand";
import { INITIAL_USERS } from "@/lib/data";
import { Role, User, UserStatus } from "@/types";

interface ProfileState {
  profile: User | null;
  users: User[];
  isInitialized: boolean;
  initializeProfile: () => void;
  saveProfile: (updates: Partial<User>) => void;
  toggleSuspendUser: (email: string) => void;
  changeUserRole: (email: string, role: Role) => void;
  addUser: (user: Omit<User, "joined">) => void;
  logout: () => void;
}

const saveUsers = (users: User[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("ee_users", JSON.stringify(users));
  }
  return { users };
};

const getDefaultProfile = (users: User[]) => {
  const john = users.find((user) => user.email === "john.doe@example.com");
  return john || users[0] || null;
};

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  users: [],
  isInitialized: false,

  initializeProfile: () => {
    if (get().isInitialized) return;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ee_users");
      let users = INITIAL_USERS;
      if (stored) {
        try {
          users = JSON.parse(stored) as User[];
        } catch (error) {
          console.error("Error parsing stored users:", error);
        }
      } else {
        localStorage.setItem("ee_users", JSON.stringify(INITIAL_USERS));
      }

      set({
        users,
        profile: getDefaultProfile(users),
        isInitialized: true,
      });
    }
  },

  saveProfile: (updates) => {
    const { profile, users } = get();
    if (!profile) return;

    const updatedUsers = users.map((user) => {
      if (user.email === profile.email) {
        return { ...user, ...updates };
      }
      return user;
    });

    const updatedProfile =
      updatedUsers.find((user) => user.email === profile.email) || profile;
    set({
      ...saveUsers(updatedUsers),
      profile: updatedProfile,
    });
  },

  toggleSuspendUser: (email) => {
    const { profile, users } = get();
    const updatedUsers = users.map((user) => {
      if (user.email === email) {
        return {
          ...user,
          status:
            user.status === "ACTIVE"
              ? ("SUSPENDED" as UserStatus)
              : ("ACTIVE" as UserStatus),
        };
      }
      return user;
    });

    const updatedProfile =
      profile?.email === email
        ? updatedUsers.find((user) => user.email === email) || profile
        : profile;

    set({
      ...saveUsers(updatedUsers),
      profile: updatedProfile || null,
    });
  },

  changeUserRole: (email, role) => {
    const { profile, users } = get();
    const updatedUsers = users.map((user) => {
      if (user.email === email) {
        return { ...user, role };
      }
      return user;
    });

    const updatedProfile =
      profile?.email === email
        ? updatedUsers.find((user) => user.email === email) || profile
        : profile;

    set({
      ...saveUsers(updatedUsers),
      profile: updatedProfile || null,
    });
  },

  addUser: (user) => {
    const newUser: User = {
      ...user,
      joined: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }),
    };

    const updatedUsers = [...get().users, newUser];
    set({
      ...saveUsers(updatedUsers),
      profile: get().profile,
    });
  },

  logout: () => {
    set({ profile: null });
  },
}));