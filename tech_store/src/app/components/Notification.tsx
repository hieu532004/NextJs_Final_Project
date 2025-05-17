import React, { useState, useEffect } from 'react';

interface NotificationProps {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number; // Thời gian hiển thị (mili giây), mặc định là 3000
    onClose?: () => void; // Callback khi đóng (tự động hoặc thủ công)
    isInline?: boolean; // Thêm prop để kiểm soát vị trí
}

const Notification: React.FC<NotificationProps> = ({ message, type, duration = 3000, onClose, isInline }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                onClose?.(); // Gọi callback onClose nếu được cung cấp
            }, duration);
            return () => clearTimeout(timer); // Cleanup timer
        }
    }, [isVisible, duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        onClose?.(); // Gọi callback onClose nếu được cung cấp
    };

    if (!isVisible) {
        return null;
    }

    let backgroundColorClass = '';
    let textColorClass = '';
    let borderColorClass = '';
    let positionClass = isInline ? '' : 'fixed top-4 right-4 z-50'; // Thay đổi class vị trí

    switch (type) {
        case 'success':
            backgroundColorClass = 'bg-green-100';
            textColorClass = 'text-green-700';
            borderColorClass = 'border-green-400';
            break;
        case 'error':
            backgroundColorClass = 'bg-red-100';
            textColorClass = 'text-red-700';
            borderColorClass = 'border-red-400';
            break;
        case 'warning':
            backgroundColorClass = 'bg-yellow-100';
            textColorClass = 'text-yellow-700';
            borderColorClass = 'border-yellow-400';
            break;
        case 'info':
            backgroundColorClass = 'bg-blue-100';
            textColorClass = 'text-blue-700';
            borderColorClass = 'border-blue-400';
            break;
        default:
            backgroundColorClass = 'bg-gray-100';
            textColorClass = 'text-gray-700';
            borderColorClass = 'border-gray-400';
    }

    return (
        <div
            className={`${positionClass} rounded-md shadow-lg p-4 flex items-center justify-between ${backgroundColorClass} ${textColorClass} border ${borderColorClass}`}
            style={isInline ? { position: 'static', marginBottom: '8px' } : {}} // Thêm margin-bottom khi inline
        >
            <span className="flex-grow">{message}</span>
            <button className="ml-4 font-bold text-xl focus:outline-none" onClick={handleClose}>
                &times;
            </button>
        </div>
    );
};

export default Notification;