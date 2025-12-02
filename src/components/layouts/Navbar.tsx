"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  FiLogOut,
  FiUser,
  FiCalendar,
  FiPlusCircle,
  FiGrid,
  FiUsers,
  FiStar,
  FiChevronDown,
  FiSettings,
  FiDollarSign,
  FiHeart,
  FiMessageSquare,
  FiHelpCircle,
  FiCreditCard,
  FiBell,
  FiPackage,
  FiTrendingUp,
  FiShield,
  FiFileText,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "host" | "admin";
  location?: string;
}

// Custom event names for auth state changes
const AUTH_EVENTS = {
  LOGIN: "auth-login",
  LOGOUT: "auth-logout",
  UPDATE: "auth-update",
} as const;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user: contextUser, logout } = useAuth();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Function to get user from localStorage
  const getUserFromLocalStorage = (): User | null => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.role) {
          return parsedUser;
        }
      }
    } catch (error) {
      console.error("Error reading user from localStorage:", error);
    }
    return null;
  };

  // Function to update user state
  const updateUserState = () => {
    const localStorageUser = getUserFromLocalStorage();

    // Prioritize localStorage user if it exists and has role
    if (localStorageUser) {
      setCurrentUser(localStorageUser);
    } else if (contextUser) {
      setCurrentUser(contextUser);
    } else {
      setCurrentUser(null);
    }
  };

  // Initialize and setup listeners
  useEffect(() => {
    // Initial update
    updateUserState();

    // Listen for storage changes (from other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user" || e.key === "token") {
        updateUserState();
      }
    };

    // Listen for custom auth events
    const handleAuthEvent = (e: Event) => {
      updateUserState();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(AUTH_EVENTS.LOGIN, handleAuthEvent);
    window.addEventListener(AUTH_EVENTS.LOGOUT, handleAuthEvent);
    window.addEventListener(AUTH_EVENTS.UPDATE, handleAuthEvent);

    // Setup an interval to check for auth state changes
    // This helps when localStorage is updated in the same tab
    const checkInterval = setInterval(() => {
      updateUserState();
    }, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(AUTH_EVENTS.LOGIN, handleAuthEvent);
      window.removeEventListener(AUTH_EVENTS.LOGOUT, handleAuthEvent);
      window.removeEventListener(AUTH_EVENTS.UPDATE, handleAuthEvent);
      clearInterval(checkInterval);
    };
  }, [contextUser]);

  // Trigger custom event when context user changes
  useEffect(() => {
    if (contextUser) {
      // Dispatch update event
      window.dispatchEvent(new Event(AUTH_EVENTS.UPDATE));
    }
  }, [contextUser]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setIsUserMenuOpen(false);
    setCurrentUser(null);

    // Dispatch logout event
    window.dispatchEvent(new Event(AUTH_EVENTS.LOGOUT));

    router.push("/");
  };

  const getUserRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return {
          text: "Admin",
          className:
            "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-300 border-yellow-500/30",
        };
      case "host":
        return {
          text: "Host",
          className:
            "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30",
        };
      default:
        return {
          text: "User",
          className:
            "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30",
        };
    }
  };

  // Menu items based on user role
  const getMenuItems = () => {
    const commonItems = [
      {
        label: "My Profile",
        icon: <FiUser className="w-4 h-4" />,
        link: "/profile",
      },
      {
        label: "My Events",
        icon: <FiCalendar className="w-4 h-4" />,
        link: "/my-events",
      },
      {
        label: "Notifications",
        icon: <FiBell className="w-4 h-4" />,
        link: "/notifications",
      },
      {
        label: "Settings",
        icon: <FiSettings className="w-4 h-4" />,
        link: "/settings",
      },
    ];

    const userSpecificItems = [
      {
        label: "Payment History",
        icon: <FiCreditCard className="w-4 h-4" />,
        link: "/payments",
      },
      {
        label: "My Reviews",
        icon: <FiStar className="w-4 h-4" />,
        link: "/reviews",
      },
      {
        label: "Saved Events",
        icon: <FiHeart className="w-4 h-4" />,
        link: "/saved-events",
      },
      {
        label: "Help & Support",
        icon: <FiHelpCircle className="w-4 h-4" />,
        link: "/support",
      },
    ];

    const hostSpecificItems = [
      {
        label: "Host Dashboard",
        icon: <FiGrid className="w-4 h-4" />,
        link: "/dashboard",
      },
      {
        label: "Participants",
        icon: <FiUsers className="w-4 h-4" />,
        link: "/host/participants",
      },
      {
        label: "Revenue Dashboard",
        icon: <FiDollarSign className="w-4 h-4" />,
        link: "/host/revenue",
      },
      {
        label: "Host Settings",
        icon: <FiSettings className="w-4 h-4" />,
        link: "/host/settings",
      },
      {
        label: "Host Analytics",
        icon: <FiTrendingUp className="w-4 h-4" />,
        link: "/host/analytics",
      },
    ];

    const adminSpecificItems = [
      {
        label: "Admin Dashboard",
        icon: <FiGrid className="w-4 h-4" />,
        link: "/admin/dashboard",
      },
      {
        label: "User Management",
        icon: <FiUsers className="w-4 h-4" />,
        link: "/admin/users",
      },
      {
        label: "Event Management",
        icon: <FiCalendar className="w-4 h-4" />,
        link: "/admin/events",
      },
      {
        label: "Security Log",
        icon: <FiShield className="w-4 h-4" />,
        link: "/admin/security",
      },
      {
        label: "System Settings",
        icon: <FiSettings className="w-4 h-4" />,
        link: "/admin/settings",
      },
      {
        label: "Reports & Analytics",
        icon: <FiFileText className="w-4 h-4" />,
        link: "/admin/reports",
      },
    ];

    const logoutItem = {
      label: "Logout",
      icon: <FiLogOut className="w-4 h-4" />,
      onClick: handleLogout,
      danger: true,
    };

    if (!currentUser) return [];

    let menuItems = [...commonItems];

    if (currentUser.role === "user") {
      menuItems = [...menuItems, ...userSpecificItems];
    } else if (currentUser.role === "host") {
      menuItems = [...menuItems, ...hostSpecificItems];
    } else if (currentUser.role === "admin") {
      menuItems = [...menuItems, ...adminSpecificItems];
    }

    menuItems.push({ type: "divider" });
    menuItems.push(logoutItem);

    return menuItems;
  };

  const menuItems = getMenuItems();

  // Use currentUser for display
  const displayUser = currentUser;

  return (
    <nav className="top-0 z-50 sticky bg-gradient-to-r from-[#234C6A]/90 via-[#D2C1B6]/90 to-[#96A78D]/90 shadow-lg backdrop-blur-md border-white/20 border-b">
      <div className="mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="group flex items-center space-x-2">
            <div className="flex justify-center items-center bg-white/20 group-hover:bg-white/30 backdrop-blur-sm rounded-lg w-8 h-8 transition-all duration-200">
              <span className="font-bold text-white text-lg">E</span>
            </div>
            <span className="font-bold text-white text-xl tracking-tight">
              EventBuddy
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/events"
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-white hover:scale-105 transition-all duration-200"
            >
              <FiCalendar />
              <span>Explore Events</span>
            </Link>

            {displayUser ? (
              <>
                {/* User specific links */}
                {displayUser.role === "user" && (
                  <Link
                    href="/my-events"
                    className="flex items-center space-x-2 text-white/90 hover:text-white hover:scale-105 transition-all duration-200"
                  >
                    <FiCalendar />
                    <span>My Events</span>
                  </Link>
                )}

                {/* Host specific links */}
                {displayUser.role === "host" && (
                  <>
                    <Link
                      href="/host/events"
                      className="flex items-center space-x-2 text-white/90 hover:text-white hover:scale-105 transition-all duration-200"
                    >
                      <FiCalendar />
                      <span>Hosted Events</span>
                    </Link>
                    <Link
                      href="/events/create"
                      className="flex items-center space-x-2 bg-gradient-to-r from-white/20 hover:from-white/30 to-white/10 hover:to-white/20 px-4 py-2 rounded-lg text-white hover:scale-105 transition-all duration-200"
                    >
                      <FiPlusCircle />
                      <span>Create Event</span>
                    </Link>
                  </>
                )}

                {/* Admin specific links */}
                {displayUser.role === "admin" && (
                  <>
                    <Link
                      href="/admin"
                      className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 hover:from-yellow-500/30 to-amber-500/10 hover:to-amber-500/20 px-4 py-2 rounded-lg text-white hover:scale-105 transition-all duration-200"
                    >
                      <FiGrid />
                      <span>Admin Dashboard</span>
                    </Link>
                    <Link
                      href="/admin/users"
                      className="flex items-center space-x-2 text-white/90 hover:text-white hover:scale-105 transition-all duration-200"
                    >
                      <FiUsers />
                      <span>Manage Users</span>
                    </Link>
                    <Link
                      href="/admin/events"
                      className="flex items-center space-x-2 text-white/90 hover:text-white hover:scale-105 transition-all duration-200"
                    >
                      <FiCalendar />
                      <span>Manage Events</span>
                    </Link>
                  </>
                )}

                {/* User profile section */}
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-white transition-all duration-200"
                    >
                      <div className="flex flex-shrink-0 justify-center items-center bg-white/20 rounded-full w-8 h-8">
                        <FiUser className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="font-medium text-sm">
                          {displayUser.name || displayUser.email?.split("@")[0]}
                        </span>
                        <div
                          className={`text-xs px-2 py-0.5 rounded-full border ${
                            getUserRoleBadge(displayUser.role).className
                          }`}
                        >
                          {getUserRoleBadge(displayUser.role).text}
                        </div>
                      </div>
                      <FiChevronDown
                        className={`transition-transform duration-200 ${
                          isUserMenuOpen ? "rotate-180" : ""
                        } w-4 h-4`}
                      />
                    </button>

                    {isUserMenuOpen && (
                      <div className="right-0 z-50 absolute bg-gradient-to-b from-[#234C6A]/95 to-[#96A78D]/95 shadow-xl backdrop-blur-md mt-2 py-2 border border-white/20 rounded-lg w-64">
                        <div className="px-4 py-3 border-white/10 border-b">
                          <p className="font-medium text-white text-sm">
                            {displayUser.name}
                          </p>
                          <p className="text-white/70 text-xs truncate">
                            {displayUser.email}
                          </p>
                          <div
                            className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full border ${
                              getUserRoleBadge(displayUser.role).className
                            }`}
                          >
                            {getUserRoleBadge(displayUser.role).text}
                          </div>
                        </div>

                        <div className="py-1 max-h-80 overflow-y-auto">
                          {menuItems.map((item, index) =>
                            item.type === "divider" ? (
                              <div
                                key={index}
                                className="my-1 border-white/10 border-t"
                              ></div>
                            ) : item.onClick ? (
                              <button
                                key={index}
                                onClick={() => {
                                  item.onClick?.();
                                  setIsUserMenuOpen(false);
                                }}
                                className={`flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-left transition-all duration-200 ${
                                  item.danger
                                    ? "hover:bg-gradient-to-r from-red-500/20 hover:from-red-500/30 to-rose-500/10 hover:to-rose-500/20 text-red-200"
                                    : "hover:bg-white/10 text-white"
                                }`}
                              >
                                {item.icon}
                                <span>{item.label}</span>
                              </button>
                            ) : (
                              <Link
                                key={index}
                                href={item.link || "#"}
                                className="flex items-center space-x-3 hover:bg-white/10 px-4 py-2.5 text-white text-sm transition-all duration-200"
                                onClick={() => setIsUserMenuOpen(false)}
                              >
                                {item.icon}
                                <span>{item.label}</span>
                              </Link>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // Not logged in state
              <>
                <Link
                  href="/become-host"
                  className="flex items-center space-x-2 bg-gradient-to-r from-white/10 hover:from-white/20 to-white/5 hover:to-white/10 px-4 py-2 rounded-lg text-white hover:scale-105 transition-all duration-200"
                >
                  <FiStar />
                  <span>Become a Host</span>
                </Link>
                <Link
                  href="/auth/login"
                  className="text-white/90 hover:text-white hover:scale-105 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-white/20 hover:from-white/30 to-white/10 hover:to-white/20 shadow-lg hover:shadow-xl px-4 py-2 rounded-lg text-white hover:scale-105 transition-all duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            <div className="flex flex-col justify-between w-6 h-6">
              <span
                className={`w-full h-0.5 bg-white transition-transform duration-300 ${
                  isOpen ? "rotate-45 translate-y-2.5" : ""
                }`}
              ></span>
              <span
                className={`w-full h-0.5 bg-white transition-opacity duration-300 ${
                  isOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`w-full h-0.5 bg-white transition-transform duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-2.5" : ""
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-gradient-to-b from-[#234C6A]/90 slide-in-from-top-5 via-[#D2C1B6]/90 to-[#96A78D]/90 backdrop-blur-md py-4 border-white/20 border-t animate-in duration-300">
            <div className="flex flex-col space-y-2">
              {displayUser && (
                <div className="bg-white/10 mb-2 px-4 py-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-shrink-0 justify-center items-center bg-white/20 rounded-full w-10 h-10">
                      <FiUser className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">
                        {displayUser.name}
                      </p>
                      <p className="text-white/70 text-xs truncate">
                        {displayUser.email}
                      </p>
                      <div
                        className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full border ${
                          getUserRoleBadge(displayUser.role).className
                        }`}
                      >
                        {getUserRoleBadge(displayUser.role).text}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Common links */}
              <Link
                href="/events"
                className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-lg text-white transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                <FiCalendar />
                <span>Explore Events</span>
              </Link>

              {displayUser ? (
                <>
                  {/* Role-specific mobile links */}
                  {displayUser.role === "user" && (
                    <Link
                      href="/my-events"
                      className="flex items-center space-x-3 hover:bg-white/10 px-4 py-3 rounded-lg text-white transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <FiCalendar />
                      <span>My Events</span>
                    </Link>
                  )}

                  {displayUser.role === "host" && (
                    <>
                      <Link
                        href="/host/events"
                        className="flex items-center space-x-3 hover:bg-white/10 px-4 py-3 rounded-lg text-white transition-all duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        <FiCalendar />
                        <span>Hosted Events</span>
                      </Link>
                      <Link
                        href="/events/create"
                        className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-lg text-white transition-all duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        <FiPlusCircle />
                        <span>Create Event</span>
                      </Link>
                    </>
                  )}

                  {displayUser.role === "admin" && (
                    <>
                      <Link
                        href="/admin"
                        className="flex items-center space-x-3 bg-gradient-to-r from-yellow-500/20 hover:from-yellow-500/30 to-amber-500/10 hover:to-amber-500/20 px-4 py-3 rounded-lg text-white transition-all duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        <FiGrid />
                        <span>Admin Dashboard</span>
                      </Link>
                      <Link
                        href="/admin/users"
                        className="flex items-center space-x-3 hover:bg-white/10 px-4 py-3 rounded-lg text-white transition-all duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        <FiUsers />
                        <span>Manage Users</span>
                      </Link>
                      <Link
                        href="/admin/events"
                        className="flex items-center space-x-3 hover:bg-white/10 px-4 py-3 rounded-lg text-white transition-all duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        <FiCalendar />
                        <span>Manage Events</span>
                      </Link>
                    </>
                  )}

                  {/* Mobile profile menu items */}
                  {menuItems.map((item, index) =>
                    item.type === "divider" ? null : item.onClick ? (
                      <button
                        key={index}
                        onClick={() => {
                          item.onClick?.();
                          setIsOpen(false);
                        }}
                        className={`flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200 ${
                          item.danger
                            ? "bg-gradient-to-r from-red-500/20 hover:from-red-500/30 to-rose-500/10 hover:to-rose-500/20 text-red-200 rounded-lg"
                            : "hover:bg-white/10 text-white rounded-lg"
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ) : (
                      <Link
                        key={index}
                        href={item.link || "#"}
                        className="flex items-center space-x-3 hover:bg-white/10 px-4 py-3 rounded-lg text-white transition-all duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    )
                  )}
                </>
              ) : (
                // Not logged in mobile links
                <>
                  <Link
                    href="/become-host"
                    className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-lg text-white transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <FiStar />
                    <span>Become a Host</span>
                  </Link>
                  <Link
                    href="/auth/login"
                    className="hover:bg-white/10 px-4 py-3 rounded-lg text-white transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-gradient-to-r from-white/20 hover:from-white/30 to-white/10 hover:to-white/20 shadow-lg hover:shadow-xl px-4 py-3 rounded-lg text-white hover:scale-[1.02] transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
