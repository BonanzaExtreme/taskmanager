import { CgProfile } from "react-icons/cg";
import { useState } from "react";
import { useAuth } from "../context/useAuth";

const ProfileAvatar = ({ avatarUrl: avatarUrlProp = "" }) => {
  const { user } = useAuth();
  const avatarUrl = avatarUrlProp || user?.user_metadata?.avatar_url;
  const [imageFailed, setImageFailed] = useState(false);

  if (!avatarUrl || imageFailed) {
    return <CgProfile className="icon profile-avatar" />;
  }

  return (
    <img
      src={avatarUrl}
      alt="Profile avatar"
      className="profile-avatar-img"
      onError={() => setImageFailed(true)}
    />
  );
};

export default ProfileAvatar;
