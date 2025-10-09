import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all duration-300">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 mt-[72px] min-h-[calc(100vh-72px)] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
