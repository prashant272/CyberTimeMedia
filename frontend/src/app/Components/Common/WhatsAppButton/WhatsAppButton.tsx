'use client';

import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
    const channelUrl = "https://whatsapp.com/channel/0029Vb314OB05MUbS6xEvU3g";

    return (
        <div className="fixed bottom-8 right-8 z-[9999] flex items-center gap-3 cursor-pointer pointer-events-auto group md:bottom-6 md:right-6">
            <span className="bg-black/80 text-white px-4 py-2 rounded-full text-[0.9rem] font-medium whitespace-nowrap opacity-0 translate-x-5 transition-all duration-300 pointer-events-none shadow-lg backdrop-blur-[4px] group-hover:opacity-100 group-hover:translate-x-0 dark:bg-white/90 dark:text-[#1a1a1a] dark:border dark:border-black/5">
                Join our Channel
            </span>
            <a
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[60px] h-[60px] bg-[#25D366] rounded-full flex items-center justify-center color-white shadow-[0_4px_15px_rgba(37,211,102,0.4)] transition-all duration-300 relative no-underline hover:scale-110 hover:shadow-[0_8px_25px_rgba(37,211,102,0.6)] before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-[#25D366] before:-z-10 before:animate-[live-pulse_2s_infinite] md:w-[50px] md:h-[50px]"
                aria-label="Join our WhatsApp Channel"
            >
                <FaWhatsapp size={32} className="text-white" />
            </a>
        </div>
    );
};

export default WhatsAppButton;
