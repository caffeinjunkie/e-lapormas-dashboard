import {
  createAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
} from "@/api/announcements";
import { deleteImage, uploadImage } from "@/api/storage";
import { Announcement } from "@/types/announcement.types";
import { generateSecureCode } from "@/utils/string";

export const createNewAnnouncement = async (
  data: {
    startDate: string;
    endDate: string;
    images: File[];
    isAutoDelete: boolean;
    title: string;
    description: string;
  },
  setLoading: (value: boolean) => void,
  onClose: () => void,
) => {
  try {
    const { images, startDate, endDate, isAutoDelete, ...restOfData } = data;
    setLoading(true);
    const id = await generateSecureCode();

    let url = "";
    const filename = `${id}.${images[0].type.split("/")[1]}`;
    if (images.length > 0) {
      const randomNumber = Math.random() * 10;
      await uploadImage({
        file: images[0],
        path: filename,
        bucket: "announcements",
      });
      url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/announcements/${filename}?c=${randomNumber}`;
    }

    const requestBody = {
      id,
      start_date: startDate,
      end_date: endDate,
      url,
      is_auto_delete: isAutoDelete,
      ...restOfData,
    };

    await createAnnouncement(requestBody);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
    onClose();
  }
};

export const editAnnouncementById = async (
  updatedData: {
    startDate: string;
    endDate: string;
    images: File[];
    isAutoDelete: boolean;
    description: string;
  },
  oldData: Announcement,
  setLoading: (value: boolean) => void,
  onClose: () => void,
) => {
  try {
    setLoading(true);
    const { startDate, endDate, images, description, isAutoDelete } = updatedData;
    let requestBody = {} as Record<string, unknown>;
    let isDataChanged = false;

    let url = "";
    if (!images[0].name.includes(oldData.id)) {
      const filename = `${oldData.id}.${images[0].type.split("/")[1]}`;
      const randomNumber = Math.random() * 10;
      await uploadImage({
        file: images[0],
        path: filename,
        bucket: "announcements",
      });
      url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/announcements/${filename}?c=${randomNumber}`;
      requestBody.url = url;
      isDataChanged = true;
    }
    if (startDate !== oldData.start_date) {
      requestBody.start_date = startDate;
      isDataChanged = true;
    }
    if (endDate !== oldData.end_date) {
      requestBody.end_date = endDate;
      isDataChanged = true;
    }
    if (description !== oldData.description) {
      requestBody.description = description;
      isDataChanged = true;
    }
    if (isAutoDelete !== oldData.is_auto_delete) {
      requestBody.is_auto_delete = isAutoDelete;
      isDataChanged = true;
    }

    if (!isDataChanged) {
      return;
    }
    await updateAnnouncement(oldData.id, requestBody);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
    onClose();
  }
};

export const deleteAnnouncementById = async (
  id: string,
  imagePath: string,
  setLoading: (value: boolean) => void,
  onClose: () => void,
) => {
  try {
    setLoading(true);

    await deleteAnnouncement(id);

    await deleteImage({ path: imagePath, bucket: "announcements" });
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
    onClose();
  }
};
