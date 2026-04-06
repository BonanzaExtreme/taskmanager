import { supabase } from "../supabase";

const PROFILE_COLUMNS = "id, email, name, created_at, updated_at";
const AVATAR_BUCKET = "avatars";

const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("No authenticated user found.");

  return user;
};

export const getMyProfile = async () => {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const upsertMyProfile = async ({ name = "" } = {}) => {
  const user = await getCurrentUser();

  const payload = {
    id: user.id,
    email: user.email,
    name,
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select(PROFILE_COLUMNS)
    .single();

  if (error) throw error;
  return data;
};

export const upsertProfile = async ({ id, email, name = "" }) => {
  const payload = {
    id,
    email,
    name,
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select(PROFILE_COLUMNS)
    .single();

  if (error) throw error;
  return data;
};

export const updateMyProfile = async (updates) => {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select(PROFILE_COLUMNS)
    .single();

  if (error) throw error;
  return data;
};

export const uploadMyAvatar = async (file) => {
  if (!file) {
    throw new Error("No file provided.");
  }

  const user = await getCurrentUser();
  const fileExt = file.name.includes(".")
    ? file.name.split(".").pop().toLowerCase()
    : "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);

  const { data: updatedUserData, error: userUpdateError } =
    await supabase.auth.updateUser({
      data: {
        ...(user.user_metadata || {}),
        avatar_url: publicUrl,
        avatar_path: filePath,
      },
    });

  if (userUpdateError) {
    throw userUpdateError;
  }

  return {
    avatarUrl: publicUrl,
    avatarPath: filePath,
    user: updatedUserData?.user ?? null,
  };
};

export const removeMyAvatar = async () => {
  const user = await getCurrentUser();
  const avatarPath = user?.user_metadata?.avatar_path;

  if (avatarPath) {
    const { error: removeError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .remove([avatarPath]);

    if (removeError) {
      throw removeError;
    }
  }

  const { data: updatedUserData, error: userUpdateError } =
    await supabase.auth.updateUser({
      data: {
        ...(user.user_metadata || {}),
        avatar_url: null,
        avatar_path: null,
      },
    });

  if (userUpdateError) {
    throw userUpdateError;
  }

  return {
    user: updatedUserData?.user ?? null,
  };
};
