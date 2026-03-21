const ProfileInfo = ({ name, role }) => {
  return (
    <div className="profile-name">
      {name}
      <span className="profile-role">{role}</span>
    </div>
  );
};

export default ProfileInfo;
