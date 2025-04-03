import { uploadImageToServer } from "@/api/pekerja-ai";
import { updateTaskByTrackingId } from "@/api/tasks";
import { fetchUserData } from "@/api/users";
import { Report } from "@/types/report.types";

export const acceptReport = async (
  id: string,
  currentReport: Report,
  setLoading: (loading: boolean) => void,
) => {
  return updateReport(id, currentReport, setLoading);
};

export const finishReport = async (
  id: string,
  currentReport: Report,
  setLoading: (loading: boolean) => void,
  message: string,
  files: File[],
) => {
  return updateReport(
    id,
    currentReport,
    setLoading,
    "COMPLETED",
    message,
    files,
  );
};

export const updateReport = async (
  id: string,
  currentReport: Report,
  setLoading: (loading: boolean) => void,
  status: string = "IN_PROGRESS",
  message: string = "",
  files: File[] = [],
) => {
  try {
    setLoading(true);
    const { data: user } = await fetchUserData();
    const currentUserId = user.user.id;
    let imgUrl = "";

    if (files.length) {
      const { url } = await uploadImageToServer(files[0]);
      imgUrl = url;
    }

    const { data } = await updateTaskByTrackingId(id, {
      status,
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
    return { error };
  } finally {
    setLoading(false);
  }
};
