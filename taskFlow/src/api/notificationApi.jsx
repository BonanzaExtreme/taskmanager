import { supabase } from "../supabase";

const NOTIFICATION_COLUMNS =
  "id, title, message, type, is_read, created_at, user_id";

export const listMyNotifications = async (userId) => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select(NOTIFICATION_COLUMNS)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
};
