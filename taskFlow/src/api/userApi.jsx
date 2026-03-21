import { supabase } from "../supabase";

const PROFILE_COLUMNS = "id, email, name, created_at, updated_at";

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
