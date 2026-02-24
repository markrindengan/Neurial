"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LucideIcon, Home, Briefcase, User, Mail, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
    name: string;
    url: string;
    icon: LucideIcon;
}

interface TubelightNavbarProps {
    items?: NavItem[];
    className?: string;
}

const defaultItems: NavItem[] = [
    { name: "Home", url: "/", icon: Home },
    { name: "Services", url: "#services", icon: Briefcase },
    { name: "About", url: "#about", icon: User },
    { name: "Contact", url: "#contact", icon: Mail },
];

export function TubelightNavbar({ items = defaultItems, className }: TubelightNavbarProps) {
    const [activeTab, setActiveTab] = useState(items[0].name);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
        setActiveTab(item.name);

        if (item.url === "/") {
            if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        } else if (item.url.startsWith("#")) {
            e.preventDefault();
            const target = document.querySelector(item.url);
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <>
            {/* Logo - only visible on desktop */}
            <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50 hidden md:block">
                <Link
                    to="/"
                    onClick={() => {
                        setActiveTab(items[0].name);
                        if (window.location.pathname === "/") {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                    }}
                    className="flex items-center gap-3"
                >
                    <img src="/neurial-mark.png" alt="Neurial" className="w-12 h-12 object-contain" />
                    <span className="font-display text-2xl font-bold tracking-tight">Neurial</span>
                </Link>
            </div>
            <div
                className={cn(
                    "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6",
                    className,
                )}
            >
                <div className="flex items-center gap-3 bg-background/5 border border-border/50 backdrop-blur-xl py-1.5 px-2 rounded-full shadow-lg">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.name;

                        return (
                            <Link
                                key={item.name}
                                to={item.url}
                                onClick={(e) => handleNavClick(e, item)}
                                className={cn(
                                    "relative cursor-pointer text-sm font-semibold px-5 py-2.5 rounded-full transition-colors",
                                    "text-foreground/80 hover:text-[#10b981]",
                                    isActive && "bg-[#10b981]/10 text-[#10b981]",
                                )}
                            >
                                <span className="hidden md:inline">{item.name}</span>
                                <span className="md:hidden">
                                    <Icon size={20} strokeWidth={2.5} />
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="lamp"
                                        className="absolute inset-0 w-full bg-[#10b981]/10 rounded-full -z-10"
                                        initial={false}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30,
                                        }}
                                    >
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-[#10b981] rounded-t-full">
                                            <div className="absolute w-14 h-8 bg-[#10b981]/30 rounded-full blur-xl -top-3 -left-2" />
                                            <div className="absolute w-10 h-8 bg-[#10b981]/25 rounded-full blur-lg -top-2" />
                                            <div className="absolute w-6 h-6 bg-[#10b981]/20 rounded-full blur-md top-0 left-2" />
                                        </div>
                                    </motion.div>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default TubelightNavbar;
