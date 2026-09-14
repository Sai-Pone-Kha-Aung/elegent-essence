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
  login: (email: string, password: string) => { success: boolean; user?: User; error?: string };
  signup: (data: { name: string; email: string; password: string }) => { success: boolean; error?: string };
  logout: () => void;
}

const SESSION_KEY = "ee_session";

const getSavedSession = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(SESSION_KEY);
  }
  return null;
};

const saveSession = (email: string | null) => {
  if (typeof window !== "undefined") {
    if (email) {
      localStorage.setItem(SESSION_KEY, email);
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }
};

const saveUsers = (users: User[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("ee_users", JSON.stringify(users));
  }
  return { users };
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
          const parsed = JSON.parse(stored) as User[];
          const userMap = new Map<string, User>();

          // Populate from stored users keyed by normalized email
          for (const u of parsed) {
            if (u && u.email) {
              userMap.set(u.email.toLowerCase(), u);
            }
          }

          // Merge updates from INITIAL_USERS
          for (const initUser of INITIAL_USERS) {
            if (initUser && initUser.id) {
              // If ID matches a previously stored user with a different email, clean up old entry
              for (const [emailKey, u] of Array.from(userMap.entries())) {
                if (u.id === initUser.id && emailKey !== initUser.email.toLowerCase()) {
                  userMap.delete(emailKey);
                }
              }
            }
            if (initUser && initUser.email) {
              const emailKey = initUser.email.toLowerCase();
              const existing = userMap.get(emailKey);
              if (existing) {
                userMap.set(emailKey, { ...existing, ...initUser });
              } else {
                userMap.set(emailKey, initUser);
              }
            }
          }

          users = Array.from(userMap.values());
          localStorage.setItem("ee_users", JSON.stringify(users));
        } catch (error) {
          console.error("Error parsing stored users:", error);
        }
      } else {
        localStorage.setItem("ee_users", JSON.stringify(INITIAL_USERS));
      }

      const activeEmail = getSavedSession();
      let activeUser: User | null = null;
      if (activeEmail) {
        activeUser =
          users.find(
            (u) =>
              u.email.toLowerCase() === activeEmail.toLowerCase() &&
              u.status === UserStatus.ACTIVE
          ) || null;
        if (!activeUser) {
          saveSession(null);
        }
      }

      set({
        users,
        profile: activeUser,
        isInitialized: true,
      });
    }
  },

  login: (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const user = get().users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, error: "No account found with this email address." };
    }

    if (user.password && user.password !== password) {
      return { success: false, error: "Incorrect password. Please try again." };
    }

    if (user.status === UserStatus.SUSPENDED) {
      return {
        success: false,
        error: "This account has been suspended. Please contact customer support.",
      };
    }

    saveSession(user.email);
    set({ profile: user });
    return { success: true, user };
  },

  signup: ({ name, email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName) {
      return { success: false, error: "Please enter your full name." };
    }

    if (!cleanEmail) {
      return { success: false, error: "Please enter a valid email address." };
    }

    if (!password || password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }

    const existingUser = get().users.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (existingUser) {
      return { success: false, error: "An account with this email already exists." };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password,
      role: Role.CUSTOMER,
      status: UserStatus.ACTIVE,
      joined: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }),
    };

    const updatedUsers = [...get().users, newUser];
    saveUsers(updatedUsers);
    saveSession(newUser.email);

    set({
      users: updatedUsers,
      profile: newUser,
    });

    return { success: true };
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

    // If active user was just suspended, log them out
    if (updatedProfile?.status === UserStatus.SUSPENDED) {
      saveSession(null);
      set({
        ...saveUsers(updatedUsers),
        profile: null,
      });
      return;
    }

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
    const cleanEmail = user.email.trim().toLowerCase();
    const existing = get().users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) return;

    const newUser: User = {
      ...user,
      id: user.id || `user-${Date.now()}`,
      email: cleanEmail,
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
    saveSession(null);
    set({ profile: null });
  },
}));