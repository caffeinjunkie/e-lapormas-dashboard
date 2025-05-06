import { Announcement } from "@/types/announcement.types";

export const transformAnnouncementToDefaultValues = async (
  item: Announcement,
) => {
  const { filename = "image", mimeType = "image/jpeg" } = getFileNameAndType(
    item.img,
  );
  const image = await urlToFile(item.img, filename, mimeType);

  return {
    title: item.title,
    url: item.url,
    period: {
      start: item.start_date.split("T")[0],
      end: item.end_date.split("T")[0],
    },
    images: image ? [image] : [],
  };
};

function getFileNameAndType(imgUrl: string) {
  const filename = decodeURIComponent(imgUrl.split("announcements/")[1])
    .split("?c")[0]
    .toString();
  const fileExtension = filename?.split(".").pop() || "jpg".toLowerCase();
  const mimeType = `image/${fileExtension}`;
  return { filename, mimeType };
}

async function urlToFile(imgUrl: string, filename: string, mimeType: string) {
  try {
    const response = await fetch(imgUrl);

    const blob = await response.blob();

    const file = new File([blob], filename, { type: mimeType || blob.type });

    return file;
  } catch (error) {
    console.error("Error converting URL to File:", error);
    throw error;
  }
}
