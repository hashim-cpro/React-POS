import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import LoginButton from "./LoginButton";
import bellIcon from "../assets/bell.svg";
import { useSelector } from "react-redux";
import profileIcon from "../assets/ProfilePlaceholder.svg";
import horizontalLine from "../assets/line2.svg";

export default function Layout() {
  const profilePictureUrl = useSelector(
    (state) => state.userdata.profilePictureUrl
  );
  const [ProfileModalisCollapsed, setProfileModalisCollapsed] = useState(true);

  return (
    <div className="flex h-screen bg-[#f6f8fc] relative">
      <Sidebar />
      <div className="fixed sm:top-[12px] top-[7px] right-[50px] sm:right-[24px] w-[116px] h-[46px] sm:bg-white rounded-[10px] flex items-center justify-between px-2 py-1 sm:shadow z-20 ">
        <div className="w-[35px] h-[35px] flex items-center justify-center rounded-full hover:bg-[#9747FF1A] cursor-pointer relative">
          <span className="h-[10px] w-[10px] bg-[#FF5364] absolute top-[5px] right-[8px] rounded-full"></span>
          <img src={bellIcon} alt="notifications icon" />
        </div>
        <img src={horizontalLine} alt="|" />
        <span
          className="cursor-pointer border-white hover:border-[#9747FF1A] border-[3px] rounded-full"
          onClick={() => {
            setProfileModalisCollapsed(!ProfileModalisCollapsed);
          }}
        >
          {profilePictureUrl === "" ? (
            <img
              src={profileIcon}
              alt="Profile Icon"
              className="h-[31px] border-[2px] border-[#9747FF] rounded-full"
            />
          ) : (
            <img
              src={profilePictureUrl}
              alt="Profile Picture"
              className="h-[32px] rounded-full "
            />
          )}
        </span>
      </div>
      {ProfileModalisCollapsed ? null : <LoginButton isCollapsed={false} />}

      <main
        className="flex-1 overflow-x-hidden overflow-y-auto bg-lightgraybg p-6 absolute top-0 left-0 sm:static"
        onClick={() => {
          setProfileModalisCollapsed(true);
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
