import { FaArrowDown } from "react-icons/fa6";

const ProfileDropdownToggle = ({ onClick, isOpen }) => {
  return (
    <button
      type="button"
      className="profile-section"
      onClick={onClick}
      aria-haspopup="menu"
      aria-expanded={isOpen}
    >
      <FaArrowDown className="dropdown-icon" />
    </button>
  );
};

export default ProfileDropdownToggle;
