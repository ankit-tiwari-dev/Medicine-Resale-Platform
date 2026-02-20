import { Outlet } from "react-router-dom";
import AdminFigmaHeader from "../components/layout/AdminFigmaHeader";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-muted/30 font-sans">
      <AdminFigmaHeader />
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
