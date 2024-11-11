import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ShoppingCartIcon,
  CubeIcon,
  DocumentTextIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import Logo from "../assets/Logo.svg";

export default function Sidebar() {
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      path: "/",
      icon: <HomeIcon className="h-5 w-5 mr-2 stroke-customsteel" />,
    },
    {
      name: "Sales",
      path: "/sales",
      icon: <ShoppingCartIcon className="h-5 w-5 mr-2 stroke-customsteel" />,
    },
    {
      name: "Inventory",
      path: "/inventory",
      icon: <CubeIcon className="h-5 w-5 mr-2 stroke-customsteel" />,
    },
    {
      name: "Purchases",
      path: "/purchases",
      icon: <DocumentTextIcon className="h-5 w-5 mr-2 stroke-customred" />,
    },
    {
      name: "Expenses",
      path: "/expenses",
      icon: <BanknotesIcon className="h-5 w-5 mr-2 stroke-customred" />,
    },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4">
        <img src={Logo} alt="Logo" />
      </div>
      <nav className="mt-4 flex items-center flex-col">
        {navigation.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-2 font-phantom w-[95%] rounded-lg text-primary hover:bg-customsmoke ${
              location.pathname === item.path
                ? "bg-customcyan hover:bg-customcyan"
                : ""
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
