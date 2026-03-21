export async function uploadImageToImgBB(imageFile: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch("/api/upload/imgbb", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Image upload failed");
  }

  const payload = (await response.json()) as { imageUrl: string };
  return payload.imageUrl;
}
