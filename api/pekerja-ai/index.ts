export const uploadImageToServer = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const options = {
    method: "POST",
    headers: {
      "x-auth-token": process.env.NEXT_PUBLIC_PEKERJA_AI_IMG_UPLOAD_KEY,
      Accept: "application/json",
    },
    body: formData,
  } as RequestInit;

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_PEKERJA_AI_IMG_UPLOAD_URL as string,
      options,
    );
    if (!response.ok) {
      // Try to get error details from the response body for better debugging
      let errorData;
      try {
        errorData = await response.json();
      } catch (jsonError) {
        // If the body isn't JSON or is empty
        errorData = { message: response.statusText };
      }
      throw new Error(
        `HTTP error! Status: ${response.status} - ${errorData.message || "Unknown server error"}`,
      );
    }
    const data = await response.json();

    return data;
  } catch (error: any) {
    throw new Error(`Upload failed: ${error.message}`);
  }
};
