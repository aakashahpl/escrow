
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {

        const variants = {
            primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20 shadow-lg border border-transparent',
            secondary: 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/20 border border-transparent',
            outline: 'bg-transparent text-gray-700 border-2 border-gray-200 hover:border-emerald-600 hover:text-emerald-600',
            ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
            danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-xs',
            md: 'px-5 py-2.5 text-sm',
            lg: 'px-8 py-3 text-base',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
