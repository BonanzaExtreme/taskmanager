import React, { useContext } from "react";
import "./settings.css";
import { ThemeContext } from "../../context/ThemeContextCreate";
import { FaTrash } from "react-icons/fa";
import { FaUpload } from "react-icons/fa";

const Settings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <section className="settings-page">
      <div className="settings-container">
        {/* LEFT PANEL */}
        <div className="settings-left">
          <ul>
            <li className="settings-item active">General</li>
            <li className="settings-item">Notifications</li>
            <li className="settings-item">Login & Security</li>
          </ul>
        </div>

        {/* RIGHT PANEL */}
        <div className="settings-right">
          <div className="settings-content">
            {/* Profile Row */}
            <div className="profile-row">
              <img
                src="https://via.placeholder.com/80"
                alt="profile"
                className="profile-img"
              />
              <div className="profile-actions">
                <button
                  className="btn delete"
                  style={{
                    color: "black",
                  }}
                >
                  <FaTrash />
                </button>
                <button className="upload">
                  <FaUpload /> Upload
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="settings-row">
              <div className="setting-left">
                <span>Name</span>
                <input type="text" placeholder="Enter your name" />
              </div>
              <div className="setting-right">
                <button>Edit</button>
              </div>
            </div>

            {/* Email */}
            <div className="settings-row">
              <div className="setting-left">
                <span>Email</span>
                <input type="email" placeholder="Enter your email" />
              </div>
              <div className="setting-right">
                <button>Edit</button>
              </div>
            </div>
            {/* Theme */}
            <div className="settings-row">
              <div className="setting-left">
                <span>Theme</span>
                <h3>Appearance</h3>
              </div>
              <div className="setting-right">
                <button onClick={toggleTheme}>
                  {theme === "light" ? "Light" : "Dark"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;
