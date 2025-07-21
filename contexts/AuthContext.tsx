"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simple validation
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    console.log("Logging in with email:", email);
    console.log("Logging in with password:", password);
    // Special admin account
    if (email === "admin@example.com" && password === "password!") {
      const adminUser = { id: "admin-001", email: "admin@example.com" };
      setUser(adminUser);
      localStorage.setItem("user", JSON.stringify(adminUser));
      console.log("Admin user logged in");
      return;
    }

    // In a real app, you would make an API call here
    // For now, we'll use localStorage as a simple database
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const existingUser = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!existingUser) {
      throw new Error("Invalid email or password");
    }

    const loggedInUser = { id: existingUser.id, email: existingUser.email };
    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
  };

  const signup = async (email: string, password: string) => {
    // Simple validation
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u: any) => u.email === email)) {
      throw new Error("User already exists");
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In a real app, you would hash this
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Log the user in
    const loggedInUser = { id: newUser.id, email: newUser.email };
    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
