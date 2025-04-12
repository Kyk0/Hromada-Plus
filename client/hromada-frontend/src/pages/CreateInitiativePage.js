// src/pages/CreateInitiativePage.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Важно: снова подключаем вашу функцию создания инициативы,
import { createInitiative } from "../api/initiative";
// и снова используем uploadToCloudinary из вашего обновлённого cloudinary.js
import { uploadToCloudinary } from "../api/cloudinary";

const CreateInitiativePage = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [size, setSize] = useState("локальна");
    const [address, setAddress] = useState("");
    const [keywords, setKeywords] = useState("");
    const [images, setImages] = useState([]);
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setImages((prev) => [...prev, ...newImages]);
    };

    const handleSubmit = async () => {
        setMessage("");
        setUploading(true);

        try {
            const uploadedUrls = [];
            for (const img of images) {
                const url = await uploadToCloudinary(img.file);
                uploadedUrls.push(url);
            }

            await createInitiative({
                title,
                description,
                size,
                address,
                keywords,
                image_urls: uploadedUrls,
            });

            setShowModal(true);
        } catch (err) {
            setMessage(err.message || "Помилка при створенні ініціативи");
        } finally {
            setUploading(false);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        navigate("/");
    };

    return (
        <div className="min-h-screen pt-32 px-4 sm:px-10 pb-12 bg-gradient-to-br from-blue-100 to-blue-300 flex justify-center">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6 space-y-6">
                <div className="w-full h-48 sm:h-64 bg-gray-100 rounded-lg flex items-center justify-center flex-wrap gap-3 overflow-auto p-2 border border-dashed border-gray-300">
                    {images.length === 0 && (
                        <span className="text-gray-400 text-sm">Перетягніть або оберіть зображення</span>
                    )}
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img.preview}
                            alt={`preview-${index}`}
                            className="h-24 rounded shadow-md object-cover"
                        />
                    ))}
                </div>

                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="mt-2"
                />

                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Назва ініціативи"
                    className="w-full border px-3 py-2 rounded"
                />

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Опис ініціативи"
                    className="w-full border px-3 py-2 rounded"
                />

                <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="локальна">Локальна</option>
                    <option value="амбіційна">Амбіційна</option>
                </select>

                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Адреса"
                    className="w-full border px-3 py-2 rounded"
                />

                <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Ключові слова (через кому)"
                    className="w-full border px-3 py-2 rounded"
                />

                <button
                    onClick={handleSubmit}
                    disabled={uploading}
                    className={`w-full ${uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white py-2 rounded transition`}
                >
                    {uploading ? "Завантаження..." : "Створити ініціативу"}
                </button>

                {message && (
                    <div className="text-sm mt-2 text-red-600">
                        {message}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
                        <h2 className="text-xl font-semibold mb-4">Ініціатива успішно створена</h2>
                        <button
                            onClick={handleModalClose}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateInitiativePage;