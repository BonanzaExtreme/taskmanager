import { supabase } from "../supabase";
import { createNotification } from "./notificationApi";

const TASK_COLUMNS =
  "id, user_id, title, description, end_date, status, priority, created_at, updated_at, deleted_at";

const emitTasksChanged = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("taskflow:tasks-changed"));
  }
};

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const validateDueDate = (endDate) => {
  if (!endDate) return;
  const dateOnly = String(endDate).slice(0, 10);
  if (dateOnly < getTodayDateString()) {
    throw new Error("Due date cannot be in the past");
  }
};

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
  end_date = null,
  status = "todo",
  priority = "medium",
}) => {
  validateDueDate(end_date);
  const userId = await getCurrentUserId();

  const payload = {
    user_id: userId,
    title,
    description,
    end_date,
    status,
    priority,
  };

  const { data, error } = await supabase
    .from("tasks")
    .insert(payload)
    .select(TASK_COLUMNS)
    .single();

  if (error) throw error;
  emitTasksChanged();

  try {
    await createNotification({
      userId,
      title: "Task created",
      message: `Created task: ${data.title}`,
      type: "task_created",
    });
  } catch (notificationError) {
    console.error(
      "Failed to create task notification:",
      notificationError.message,
    );
  }

  return data;
};

export const updateTask = async (taskId, updates) => {
  if (Object.prototype.hasOwnProperty.call(updates, "end_date")) {
    validateDueDate(updates.end_date);
  }
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskId)
    .eq("user_id", userId)
    .select(TASK_COLUMNS)
    .single();

  if (error) throw error;
  emitTasksChanged();

  try {
    await createNotification({
      userId,
      title: "Task updated",
      message: `Updated task: ${data.title}`,
      type: "task_updated",
    });
  } catch (notificationError) {
    console.error(
      "Failed to create task notification:",
      notificationError.message,
    );
  }

  return data;
};

export const deleteTask = async (taskId) => {
  const userId = await getCurrentUserId();

  let taskTitle = "a task";
  try {
    const existingTask = await getTaskById(taskId);
    if (existingTask?.title) {
      taskTitle = existingTask.title;
    }
  } catch {
    // Keep fallback title when task lookup fails.
  }

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", userId);

  if (error) throw error;
  emitTasksChanged();

  try {
    await createNotification({
      userId,
      title: "Task deleted",
      message: `Deleted task: ${taskTitle}`,
      type: "task_deleted",
    });
  } catch (notificationError) {
    console.error(
      "Failed to create task notification:",
      notificationError.message,
    );
  }

  return true;
};
