import React from 'react';
import { cn } from '../../utils/cn';

export function Input({ className, label, error, ...props }) {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label className="text-sm font-medium text-gray-400">
                    {label}
                </label>
            )}
            <input
                className={cn(
                    "w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-text-default",
                    "focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors",
                    "placeholder:text-gray-600",
                    error && "border-red-500 focus:border-red-500 focus:ring-red-500",
                    className
                )}
                {...props}
            />
            {error && (
                <span className="text-xs text-red-500 mt-1">{error}</span>
            )}
        </div>
    );
}
