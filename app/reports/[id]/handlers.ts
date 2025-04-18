import { ToastProps, addToast } from "@heroui/toast";

import { uploadImageToServer } from "@/api/pekerja-ai";
import { updateTaskByTrackingId } from "@/api/tasks";
import { fetchUserData } from "@/api/users";
import { Report } from "@/types/report.types";

export const acceptReport = async (
  id: string,
  currentReport: Report,
  setLoading: (loading: boolean) => void,
  t: (key: string) => string,
) => {
  return updateReport(id, currentReport, setLoading, t);
};

export const finishReport = async (
  id: string,
  currentReport: Report,
  setLoading: (loading: boolean) => void,
  t: (key: string) => string,
  message: string,
  files: File[],
) => {
  return updateReport(
    id,
    currentReport,
    setLoading,
    t,
    "COMPLETED",
    message,
    files,
  );
};

export const updateReport = async (
  id: string,
  currentReport: Report,
  setLoading: (loading: boolean) => void,
  t: (key: string) => string,
  status: string = "IN_PROGRESS",
  message: string = "",
  files: File[] = [],
) => {
  try {
    setLoading(true);
    const { data: user } = await fetchUserData();
    const currentUserId = user.user.id;
    let imgUrl = "";

    if (files.length > 0) {
      const { url } = await uploadImageToServer(files[0]);
      imgUrl = url;
    }

    const { data } = await updateTaskByTrackingId(id, {
      status,
      finished_at: status === "COMPLETED" ? new Date().toISOString() : null,
      progress: [
        ...(currentReport.progress || []),
        {
          updated_by: currentUserId,
          status,
          img: imgUrl,
          updated_at: new Date().toISOString(),
          message,
        },
      ],
    });
    return { data };
  } catch (error) {
    addToast({
      title: t("activity-update-failed-title"),
      description: t("activity-update-failed-message"),
      color: "danger",
    } as ToastProps);
    return { error };
  } finally {
    setLoading(false);
    const title =
      message === ""
        ? t("activity-accept-success-title")
        : t("activity-update-success-title");
    const description =
      message === ""
        ? t("activity-accept-success-message")
        : t("activity-update-success-message");
    addToast({
      title,
      description,
      color: "success",
    } as ToastProps);
  }
};
