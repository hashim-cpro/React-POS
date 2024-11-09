import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ShoppingCartIcon,
  CubeIcon,
  DocumentTextIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      path: "/",
      icon: <HomeIcon className="h-5 w-5 mr-2" />,
    },
    {
      name: "Sales",
      path: "/sales",
      icon: <ShoppingCartIcon className="h-5 w-5 mr-2" />,
    },
    {
      name: "Inventory",
      path: "/inventory",
      icon: <CubeIcon className="h-5 w-5 mr-2" />,
    },
    {
      name: "Purchases",
      path: "/purchases",
      icon: <DocumentTextIcon className="h-5 w-5 mr-2" />,
    },
    {
      name: "Expenses",
      path: "/expenses",
      icon: <BanknotesIcon className="h-5 w-5 mr-2" />,
    },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4">
        <h2 className="text-xl font-bold">POS System</h2>
      </div>
      <nav className="mt-4">
        {navigation.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
              location.pathname === item.path ? "bg-gray-100" : ""
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
