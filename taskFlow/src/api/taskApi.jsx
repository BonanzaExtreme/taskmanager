import { supabase } from "../supabase";

const TASK_COLUMNS =
  "id, user_id, title, description, due_date, status, priority, created_at, updated_at";

const getCurrentUserId = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("No authenticated user found.");

  return user.id;
};

export const listTasks = async () => {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("tasks")
    .select(TASK_COLUMNS)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
};

export const getTaskById = async (taskId) => {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("tasks")
    .select(TASK_COLUMNS)
    .eq("id", taskId)
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return data;
};

export const createTask = async ({
  title,
  description = "",
  due_date = null,
  status = "todo",
  priority = "medium",
}) => {
  const userId = await getCurrentUserId();

  const payload = {
    user_id: userId,
    title,
    description,
    due_date,
    status,
    priority,
  };

  const { data, error } = await supabase
    .from("tasks")
    .insert(payload)
    .select(TASK_COLUMNS)
    .single();

  if (error) throw error;
  return data;
};

export const updateTask = async (taskId, updates) => {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskId)
    .eq("user_id", userId)
    .select(TASK_COLUMNS)
    .single();

  if (error) throw error;
  return data;
};

export const deleteTask = async (taskId) => {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", userId);

  if (error) throw error;
  return true;
};
