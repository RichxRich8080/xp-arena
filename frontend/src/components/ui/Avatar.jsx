import React from 'react';
import { cn } from '../../utils/cn';
import { User } from 'lucide-react';

export function Avatar({ src, alt, size = 'md', className, ring = false }) {
    const sizes = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
        xl: "w-24 h-24"
    };

    return (
        <div
            className={cn(
                "rounded-full bg-gray-800 flex items-center justify-center overflow-hidden shrink-0",
                sizes[size],
                ring && "ring-2 ring-primary-blue ring-offset-2 ring-offset-background",
                className
            )}
        >
            {src ? (
                <img src={src} alt={alt || "Avatar"} className="w-full h-full object-cover" />
            ) : (
                <User className={cn("text-gray-400", size === 'sm' ? 'w-4 h-4' : size === 'xl' ? 'w-12 h-12' : 'w-6 h-6')} />
            )}
        </div>
    );
}
