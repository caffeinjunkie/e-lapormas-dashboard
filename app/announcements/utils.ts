import { parseDate } from "@internationalized/date";

import { Announcement } from "@/types/announcement.types";

export const transformAnnouncementToDefaultValues = async (
  item: Announcement,
) => {
  const { filename = "image", mimeType = "image/jpeg" } = getFileNameAndType(
    item.url,
  );
  const image = await urlToFile(item.url, filename, mimeType);

  return {
    title: item.title,
    description: item.description,
    period: {
      start: item.start_date.split("T")[0],
      end: item.end_date.split("T")[0],
    },
    images: image ? [image] : [],
  };
};

function getFileNameAndType(url: string) {
  const filename = decodeURIComponent(url.split("photos//")[1]).toString();
  const fileExtension = filename?.split(".").pop() || "jpg".toLowerCase();
  const mimeType = `image/${fileExtension}`;
  return { filename, mimeType };
}

async function urlToFile(url: string, filename: string, mimeType: string) {
  try {
    const response = await fetch(url);

    const blob = await response.blob();

    const file = new File([blob], filename, { type: mimeType || blob.type });

    return file;
  } catch (error) {
    console.error("Error converting URL to File:", error);
    throw error;
  }
}
