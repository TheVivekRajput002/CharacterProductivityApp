import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

/* ─── Menu Data ─── */
const mainMenu = [
    { icon: "🏠", label: "Home", path: "/" },
    { icon: "🔍", label: "Search", path: "/search" },
    { icon: "✅", label: "Tasks", path: "/tasks" },
    { icon: "📅", label: "Calendar", path: "/calendar" },
    { icon: "⚡", label: "Habits", path: "/habits" },
    { icon: "📊", label: "Stats", path: "/stats" },
];

const recentItems = [
    { icon: "📄", label: "Daily Plan" },
    { icon: "📝", label: "Workout Log" },
    { icon: "📋", label: "Reading List" },
];

const favoriteItems = [
    { icon: "⭐", label: "Goals 2026" },
    { icon: "⭐", label: "Project Ideas" },
];

/* ─── Sidebar Component ─── */
const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // Don't render on auth pages
    if (location.pathname === "/auth") return null;

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                className="sidebar-toggle"
                onClick={() => setIsOpen((prev) => !prev)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                animate={{ left: isOpen ? 274 : 14 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                aria-label="Toggle sidebar"
            >
                {isOpen ? "✕" : "☰"}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            className="sidebar-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Sidebar Panel */}
                        <motion.nav
                            className="sidebar"
                            initial={{ x: -270 }}
                            animate={{ x: 0 }}
                            exit={{ x: -270 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {/* User Section */}
                            <div className="sidebar-user">
                                <div className="sidebar-user-avatar">V</div>
                                <span className="sidebar-user-name">Vivek's Workspace</span>
                            </div>

                            <div className="sidebar-divider" />

                            {/* Main Menu */}
                            <ul className="sidebar-menu">
                                {mainMenu.map((item) => (
                                    <li
                                        key={item.label}
                                        className={`sidebar-menu-item${location.pathname === item.path ? " active" : ""}`}
                                        onClick={() => {
                                            navigate(item.path);
                                            setIsOpen(false);
                                        }}
                                    >
                                        <span className="sidebar-menu-item-icon">{item.icon}</span>
                                        {item.label}
                                    </li>
                                ))}
                            </ul>

                            <div className="sidebar-divider" />

                            {/* Recents */}
                            <div className="sidebar-section-label">Recents</div>
                            <ul className="sidebar-menu">
                                {recentItems.map((item) => (
                                    <li key={item.label} className="sidebar-menu-item">
                                        <span className="sidebar-menu-item-icon">{item.icon}</span>
                                        {item.label}
                                    </li>
                                ))}
                            </ul>

                            <div className="sidebar-divider" />

                            {/* Favorites */}
                            <div className="sidebar-section-label">Favorites</div>
                            <ul className="sidebar-menu">
                                {favoriteItems.map((item) => (
                                    <li key={item.label} className="sidebar-menu-item">
                                        <span className="sidebar-menu-item-icon">{item.icon}</span>
                                        {item.label}
                                    </li>
                                ))}
                            </ul>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
