import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#0f0f1a]">
            <Navbar />
            <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
