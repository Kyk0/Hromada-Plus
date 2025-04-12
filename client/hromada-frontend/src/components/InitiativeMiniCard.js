import React from 'react';
import { useNavigate } from 'react-router-dom';

const InitiativeMiniCard = ({ id, title, size, description, image }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (typeof id !== 'undefined') {
            navigate(`/initiatives/${id}`);
        } else {
            console.error('InitiativeMiniCard: missing id');
        }
    };

    return (
        <div
            onClick={handleClick}
            className="flex bg-white rounded-lg shadow-sm overflow-hidden w-full border border-gray-200 mr-[2px] cursor-pointer hover:shadow-md transition"
        >
            <div className="w-32 bg-gray-200 flex-shrink-0">
                <img
                    src={image || 'https://via.placeholder.com/100x100?text=IMG'}
                    alt="initiative"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex flex-col flex-grow p-3 gap-1">
                <div className="text-lg font-semibold truncate">
                    {title}
                </div>

                <div className="text-sm text-gray-600">
                    {size === 'локальна' ? 'Локальна' : 'Амбіційна'}
                </div>

                <div className="text-sm text-gray-700 leading-snug line-clamp-3">
                    {description}
                </div>
            </div>
        </div>
    );
};

export default InitiativeMiniCard;