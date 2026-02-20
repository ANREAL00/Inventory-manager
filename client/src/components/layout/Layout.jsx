import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function Layout() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <footer className="py-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Inventory Manager. Built with React & Tailwind.
            </footer>
        </div>
    );
}
