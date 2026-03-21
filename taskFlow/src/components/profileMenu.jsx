import { useState } from "react";
import ProfileAvatar from "./ProfileAvatar";
import ProfileInfo from "./ProfileInfo";
import ProfileDropdownToggle from "./ProfileDropdownToggle";
import { NavLink } from "react-router-dom";
import "./profileMenu.css";

const ProfileMenu = ({ name, role, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <div className="profile-wrapper">
      <NavLink
        to="/settings"
        className="profile-link"
        aria-label="Open settings"
      >
        <ProfileAvatar />
      </NavLink>

      <ProfileInfo name={name} role={role} />

      <ProfileDropdownToggle onClick={toggleMenu} isOpen={isOpen} />

      {isOpen && (
        <div className="profile-dropdown" role="menu">
          <button
            type="button"
            className="profile-dropdown-item"
            onClick={onSignOut}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
