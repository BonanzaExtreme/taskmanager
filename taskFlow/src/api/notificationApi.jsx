import { supabase } from "../supabase";

const BASE_NOTIFICATION_COLUMNS =
  "id, title, message, type, is_read, created_at";

const emitNotificationsChanged = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("taskflow:notifications-changed"));
  }
};

export const listMyNotifications = async (userId) => {
  if (!userId) return [];

  const queryByColumn = async (columnName, selectedColumns) => {
    const { data, error } = await supabase
      .from("notifications")
      .select(selectedColumns)
      .eq(columnName, userId)
      .order("created_at", { ascending: false });

    return { data, error };
  };

  const firstTry = await queryByColumn(
    "user_id",
    `${BASE_NOTIFICATION_COLUMNS}, user_id`,
  );
  if (!firstTry.error) {
    return firstTry.data ?? [];
  }

  const secondTry = await queryByColumn(
    "user_Id",
    `${BASE_NOTIFICATION_COLUMNS}, user_Id`,
  );
  if (secondTry.error) throw secondTry.error;
  return secondTry.data ?? [];
};

export const createNotification = async ({ userId, title, message, type }) => {
  const basePayload = {
    title,
    message,
    type,
    is_read: false,
    created_at: new Date().toISOString(),
  };

  const insertWithColumn = async (columnName, selectedColumns) => {
    const payload = {
      ...basePayload,
      [columnName]: userId,
    };

    return supabase
      .from("notifications")
      .insert(payload)
      .select(selectedColumns)
      .single();
  };

  const firstTry = await insertWithColumn(
    "user_id",
    `${BASE_NOTIFICATION_COLUMNS}, user_id`,
  );
  if (!firstTry.error) {
    emitNotificationsChanged();
    return firstTry.data;
  }

  const secondTry = await insertWithColumn(
    "user_Id",
    `${BASE_NOTIFICATION_COLUMNS}, user_Id`,
  );
  if (secondTry.error) throw secondTry.error;

  emitNotificationsChanged();
  return secondTry.data;
};

export const markAllMyNotificationsAsRead = async (userId) => {
  if (!userId) return 0;

  const updateByColumn = async (columnName) => {
    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq(columnName, userId)
      .eq("is_read", false)
      .select("id");

    return { data, error };
  };

  const firstTry = await updateByColumn("user_id");
  if (!firstTry.error) {
    emitNotificationsChanged();
    return firstTry.data?.length ?? 0;
  }

  const secondTry = await updateByColumn("user_Id");
  if (secondTry.error) throw secondTry.error;

  emitNotificationsChanged();
  return secondTry.data?.length ?? 0;
};
