import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-foreground selection:text-background">
      <Navbar />
      <main className="flex-grow pt-[88px] lg:pt-[104px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
