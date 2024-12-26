import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import LogoIcon from "../assets/icon.svg";
import LogoText from "../assets/order-up.svg";
import lineSVG from "../assets/line.svg";
import dashboardIcon from "../assets/dashboard.svg";
import settingsIcon from "../assets/settings.svg";
import salesIcon from "../assets/sales.svg";
import inventoryIcon from "../assets/inventory.svg";
import purchasesIcon from "../assets/purchase.svg";
import expensesIcon from "../assets/expense.svg";

export default function Sidebar() {
  const location = useLocation();
  const [navisCollapsed, setnavisCollapsed] = useState(true);
  const navigation = [
    {
      name: "Dashboard",
      path: "/",
      icon: (
        <img src={dashboardIcon} alt="dashboard icon" className="w-[17px]" />
      ),
    },
    {
      name: "Sales",
      path: "/sales",
      icon: <img src={salesIcon} alt="sales icon" className="w-[17px]" />,
    },
    {
      name: "Inventory",
      path: "/inventory",
      icon: (
        <img src={inventoryIcon} alt="inventory icon" className="w-[17px]" />
      ),
    },
    {
      name: "Purchases",
      path: "/purchases",
      icon: (
        <img src={purchasesIcon} alt="purchases icon" className="w-[17px]" />
      ),
    },
    {
      name: "Expenses",
      path: "/expenses",
      icon: <img src={expensesIcon} alt="expenses icon" className="w-[17px]" />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <img src={settingsIcon} alt="settings icon" className="w-[17px]" />,
    },
  ];

  return (
    <div
      className={`bg-white flex sm:w-[140px] sm:h-[calc(100%-8px)] w-[calc(100%-10px)] h-[50px] sm:flex-col flex-row  justify-between items-center flex-shrink-0 sm:m-[4px_5px] rounded-[10px] shadow sticky sm:static top-[5px] left-[5px] z-20`}
    >
      <div className={`m-[0_0_0_-15px] sm:m-0 cursor-pointer`}>
        <a
          href="/"
          className="flex items-center justify-center sm:flex-col scale-75 sm:scale-100"
        >
          <img src={LogoIcon} alt="Icon" className="m-[-10px_0_0_0] sm:m-0" />
          <img src={LogoText} alt="OrderUp" className="sm:h-[25px] h-[30px]" />
        </a>
      </div>
      <button
        className="relative group sm:hidden z-10"
        onClick={() => {
          setnavisCollapsed(!navisCollapsed);
        }}
      >
        <div className="scale-75 relative flex flex-col overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all bg-[#9747FF] ring-0 ring-gray-300 hover:ring-4 ring-opacity-30 duration-200 shadow-md">
          <div
            className={
              "transform transition-all duration-150 overflow-hidden -translate-y-5" +
              (navisCollapsed ? "" : " translate-y-3")
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 animate-bounce text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 15l7-7 7 7"
              />
            </svg>
          </div>

          <div className="flex flex-col items-end justify-between w-[20px] h-[20px] transform transition-all duration-300 origin-center overflow-hidden -translate-y-3">
            <div
              className={
                "bg-white mb-1.5 h-[2px] w-7 transform transition-all duration-300 origin-left " +
                (navisCollapsed ? "" : "translate-y-6")
              }
            ></div>
            <div
              className={
                "bg-white mb-1.5 h-[2px] w-3  transform transition-all duration-300 origin-left delay-75 " +
                (navisCollapsed ? "" : "translate-y-6")
              }
            ></div>
            <div
              className={
                "bg-white h-[2px] w-7 transform transition-all duration-300 origin-left  delay-100 " +
                (navisCollapsed ? "" : "translate-y-6")
              }
            ></div>
          </div>
        </div>
      </button>
      <nav
        className={
          "sm:flex items-center justify-center flex-col flex-1 m-[15px_0] fixed sm:static bottom-0 left-0 w-full sm:w-[140px] h-[100%] sm:h-auto bg-white sm:rounded-tl-[10px] sm:rounded-bl-[10px] sm:shadow-none shadow-lg -z-10" +
          (navisCollapsed ? " hidden" : " flex")
        }
      >
        {navigation.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center justify-center flex-col text-[13px] font-poppins  font-[400] w-[95px] h-[68px] rounded-[6px] m-[5px_0] group relative ${
              location.pathname === item.path
                ? "bg-[#9747FF] text-white hover:bg-[#9747FF] "
                : "text-primary    hover:bg-[#9747FF1A]"
            } `}
          >
            <span className="w-[30px] h-[30px] flex items-center justify-center bg-white rounded-[15px]">
              {item.icon}
            </span>
            <span className={`transition-all duration-300 `}>{item.name}</span>
            <img
              src={lineSVG}
              alt="___"
              className={`absolute top-0 left-1/2 transform -translate-x-1/2 ${
                location.pathname === item.path || index === 0 ? "hidden" : ""
              }`}
            />
          </Link>
        ))}
      </nav>
    </div>
  );
}
