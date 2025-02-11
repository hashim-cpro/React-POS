import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import LoginButton from "./LoginButton";
import bellIcon from "../assets/bell.svg";
import { useSelector } from "react-redux";
import profileIcon from "../assets/ProfilePlaceholder.svg";
import horizontalLine from "../assets/line2.svg";
import { initializeTheme } from "../utils/theme";

export default function Layout() {
  const user = useSelector((state) => state.auth.user);
  const profilePictureUrl = useSelector(
    (state) => state.userdata.profilePictureUrl
  );
  const themePreference = useSelector((state) => state.userdata.settings.theme);
  const [ProfileModalisCollapsed, setProfileModalisCollapsed] = useState(true);

  useEffect(() => {
    initializeTheme(themePreference);
  }, [themePreference]);

  return (
    <div className="flex h-screen overflow-x-hidden bg-bg-primary relative">
      <Sidebar />
      {user ? (
        <div className="fixed sm:top-[12px] top-[7px] right-[5px] sm:right-[24px] sm:w-[116px] w-[95px] h-[46px] sm:bg-bg-secondary rounded-[10px] flex items-center justify-between px-2 py-1 sm:shadow z-20">
          <div
            className="w-[35px] h-[35px] flex items-center justify-center rounded-full hover:bg-hover-bg cursor-pointer relative"
            onClick={() => alert("Notifications go here, (working on it)")}
          >
            <span className="h-[10px] w-[10px] bg-accent-secondary absolute top-[5px] right-[8px] rounded-full"></span>
            <img
              src={bellIcon}
              alt="notifications icon"
              className="filter-icon"
            />
          </div>
          <img
            src={horizontalLine}
            alt="|"
            className="sm:inline-block hidden"
          />
          <span
            className="cursor-pointer border-bg-secondary hover:border-hover-bg border-[3px] rounded-full"
            onClick={() => {
              setProfileModalisCollapsed(!ProfileModalisCollapsed);
            }}
          >
            {profilePictureUrl === "" ? (
              <img
                src={profileIcon}
                alt="Profile Icon"
                className="h-[31px] border-[2px] border-accent-primary rounded-full"
              />
            ) : (
              <img
                src={profilePictureUrl}
                alt="Profile Picture"
                className="h-[32px] rounded-full"
              />
            )}
          </span>
        </div>
      ) : (
        <LoginButton isCollapsed={false} />
      )}
      {ProfileModalisCollapsed ? null : <LoginButton isCollapsed={false} />}

      <main
        className="flex-1 overflow-x-hidden overflow-y-auto bg-bg-primary p-[75px_24px_85px_24px] sm:p-[70px_24px] absolute top-0 left-0 sm:static w-screen sm:w-auto"
        onClick={() => {
          setProfileModalisCollapsed(true);
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
