import { Outlet } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const PublicLayout = () => {
  return (
    <AppShell>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </AppShell>
  );
};

export default PublicLayout;

