import { Github, Facebook } from 'lucide-react';

const SocialBtn = ({ provider, icon: Icon, color }) => (
    <a
        href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/${provider.toLowerCase()}`}
        className={`flex items-center justify-center gap-2 w-full py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${color}`}
    >
        <Icon size={18} /> Continue with {provider}
    </a>
);

export function SocialLogin() {
    return (
        <div className="space-y-2 pt-4 border-t">
            <SocialBtn provider="Google" icon={Github} color="text-gray-700 dark:text-gray-300" />
            <SocialBtn provider="Facebook" icon={Facebook} color="text-blue-600" />
        </div>
    );
}
