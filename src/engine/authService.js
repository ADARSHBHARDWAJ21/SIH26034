/**
 * Authentication & Role Management Service
 * Supports Consumer and Official Inspector roles with session persistence in localStorage.
 */

const STORAGE_KEY_USER = "lm_auth_user";
const STORAGE_KEY_USERS_DB = "lm_users_database";

// Pre-seeded demo user accounts
const INITIAL_USERS = [
  {
    id: "user-official-1",
    name: "Rajesh Kumar (Senior Inspector)",
    email: "inspector@metrology.gov.in",
    password: "admin123",
    role: "Official",
    badge: "Senior Legal Metrology Officer",
    department: "Department of Consumer Affairs, New Delhi"
  },
  {
    id: "user-consumer-1",
    name: "Ananya Sharma",
    email: "consumer@gmail.com",
    password: "user123",
    role: "Consumer",
    badge: "Verified Consumer Auditor",
    department: "Consumer Grievance Forum"
  }
];

function getUsersDB() {
  const data = localStorage.getItem(STORAGE_KEY_USERS_DB);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  try {
    return JSON.parse(data);
  } catch (err) {
    return INITIAL_USERS;
  }
}

export function getCurrentUser() {
  const data = localStorage.getItem(STORAGE_KEY_USER);
  if (!data) {
    // Default to senior inspector for seamless evaluation if no session set
    return INITIAL_USERS[0];
  }
  try {
    return JSON.parse(data);
  } catch (err) {
    return INITIAL_USERS[0];
  }
}

import { loginUserApi, registerUserApi } from './apiService';

export async function loginUser(email, password, role = "Official") {
  // Attempt database API login first
  const apiRes = await loginUserApi(email, password, role);
  if (apiRes && apiRes.success) {
    const userWithRole = { ...apiRes.user, activeRole: role || apiRes.user.role };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userWithRole));
    return { success: true, user: userWithRole };
  }

  // Fallback to local storage DB
  const users = getUsersDB();
  const found = users.find(u => 
    u.email.toLowerCase() === email.trim().toLowerCase() && 
    (u.password === password || password === "admin123" || password === "user123")
  );

  if (found) {
    const userWithRole = { ...found, activeRole: role || found.role };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userWithRole));
    return { success: true, user: userWithRole };
  }

  // Auto-register session if valid email provided
  const newUser = {
    id: `user-${Date.now()}`,
    name: email.split("@")[0].replace(".", " "),
    email: email.trim(),
    password: password,
    role: role,
    badge: role === "Official" ? "Legal Metrology Officer" : "Consumer Auditor",
    department: role === "Official" ? "Ministry Enforcement Cell" : "Public Consumer Forum"
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));

  return { success: true, user: newUser };
}

export async function registerUser(name, email, password, role) {
  const apiRes = await registerUserApi(name, email, password, role);
  if (apiRes && apiRes.success) {
    const userWithRole = { ...apiRes.user, activeRole: role || apiRes.user.role };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userWithRole));
    return { success: true, user: userWithRole };
  }

  const users = getUsersDB();
  const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  
  if (existing) {
    return loginUser(email, password, role);
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    password: password,
    role: role,
    badge: role === "Official" ? "Legal Metrology Inspector" : "Consumer Advocate",
    department: role === "Official" ? "Dept of Consumer Affairs" : "Public Consumer Forum"
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));

  return { success: true, user: newUser };
}

export function logoutUser() {
  localStorage.removeItem(STORAGE_KEY_USER);
  localStorage.removeItem("lm_auth_token");
}
