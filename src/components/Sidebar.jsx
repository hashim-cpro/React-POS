import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  HomeIcon,
  ShoppingCartIcon,
  CubeIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Logo from "../assets/Logo.svg";
import LoginButton from "./LoginButton";

export default function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      path: "/",
      icon: <HomeIcon className="h-5 w-5 stroke-customsteel" />,
    },
    {
      name: "Sales",
      path: "/sales",
      icon: <ShoppingCartIcon className="h-5 w-5 stroke-customsteel" />,
    },
    {
      name: "Inventory",
      path: "/inventory",
      icon: <CubeIcon className="h-5 w-5 stroke-customsteel" />,
    },
    {
      name: "Purchases",
      path: "/purchases",
      icon: <DocumentTextIcon className="h-5 w-5 stroke-customred" />,
    },
    {
      name: "Expenses",
      path: "/expenses",
      icon: <BanknotesIcon className="h-5 w-5 stroke-customred" />,
    },
  ];

  return (
    <div
      className={`bg-white shadow-lg transition-all duration-300 ease-in-out relative flex flex-col h-screen ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className={`p-4 ${isCollapsed ? "px-2" : ""}`}>
        <img
          src={Logo}
          alt="Logo"
          className={`transition-all duration-300 ${
            isCollapsed ? "w-12" : "w-full"
          }`}
        />
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-16 bg-white rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors"
      >
        {isCollapsed ? (
          <ChevronRightIcon className="h-4 w-4" />
        ) : (
          <ChevronLeftIcon className="h-4 w-4" />
        )}
      </button>

      <nav className="mt-4 flex items-center flex-col flex-1">
        {navigation.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-2 font-phantom w-[95%] rounded-lg text-primary hover:bg-customsmoke group relative ${
              location.pathname === item.path
                ? "bg-customcyan hover:bg-customcyan"
                : ""
            } ${isCollapsed ? "justify-center" : ""}`}
          >
            {item.icon}
            <span
              className={`ml-2 transition-all duration-300 ${
                isCollapsed ? "hidden" : "block"
              }`}
            >
              {item.name}
            </span>
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                {item.name}
              </div>
            )}
          </Link>
        ))}
        <LoginButton isCollapsed={isCollapsed} />
      </nav>
    </div>
  );
}
