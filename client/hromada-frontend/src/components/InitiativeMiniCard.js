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
            {/*
              Задаём фиксированный контейнер 8rem x 8rem (или другую желаемую ширину/высоту).
              Выравниваем картинку по центру и используем object-contain + max-w/max-h.
            */}
            <div className="w-32 h-32 bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img
                    src={image || 'https://via.placeholder.com/100x100?text=IMG'}
                    alt="initiative"
                    className="object-contain max-w-full max-h-full"
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