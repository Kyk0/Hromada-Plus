// src/api/cloudinary.js

export const uploadToCloudinary = async (file) => {
    // Жёстко прописываем ваши Cloudinary-константы:
    const CLOUD_NAME = "drxfj7vdp";
    const UPLOAD_PRESET = "unsigned_preset";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const res = await fetch(url, {
        method: "POST",
        body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error?.message || "Помилка завантаження");
    }

    return data.secure_url;
};