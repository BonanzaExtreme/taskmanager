import { useEffect, useRef, useState } from "react";
import ProfileAvatar from "./ProfileAvatar";
import ProfileInfo from "./ProfileInfo";
import ProfileDropdownToggle from "./ProfileDropdownToggle";
import { NavLink } from "react-router-dom";
import "./profileMenu.css";

const ProfileMenu = ({ name, role, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSignOut = () => {
    setIsOpen(false);
    onSignOut();
  };

  return (
    <div className="profile-wrapper" ref={wrapperRef}>
      <NavLink
        to="/settings"
        className="profile-link"
        aria-label="Open settings"
        onClick={() => setIsOpen(false)}
      >
        <ProfileAvatar />
      </NavLink>

      <ProfileInfo name={name} role={role} />

      <ProfileDropdownToggle onClick={toggleMenu} isOpen={isOpen} />

      {isOpen && (
        <div className="profile-dropdown" role="menu">
          <NavLink
            to="/settings"
            className="profile-dropdown-link"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </NavLink>
          <button
            type="button"
            className="profile-dropdown-item"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
