import {
  createAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
} from "@/api/announcements";
import { deleteImage, uploadImage } from "@/api/storage";

export const createNewAnnouncement = async (
  data: {
    startDate: string;
    endDate: string;
    images: File[];
    title: string;
    description: string;
  },
  setLoading: (value: boolean) => void,
  onClose: () => void,
) => {
  try {
    const { images, startDate, endDate, ...restOfData } = data;
    setLoading(true);

    let url = "";
    const filename = `${data.title}.${images[0].type.split("/")[1]}`;
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
      start_date: startDate,
      end_date: endDate,
      url,
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
    title: string;
    description: string;
    id: string;
  },
  setLoading: (value: boolean) => void,
  onClose: () => void,
) => {
  try {
    setLoading(true);
    const { startDate, endDate, images, ...restOfData } = updatedData;

    let url = "";
    const filename = `${updatedData.title}.${images[0].type.split("/")[1]}`;
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
      start_date: startDate,
      end_date: endDate,
      url,
      ...restOfData,
    };

    await updateAnnouncement(requestBody);
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
