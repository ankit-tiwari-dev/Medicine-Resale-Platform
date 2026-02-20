import { Outlet } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Header from "../components/layout/Header";

const PublicLayout = () => {
  return (
    <AppShell>
      <Header />
      <main>
        <Outlet />
      </main>
    </AppShell>
  );
};

export default PublicLayout;

