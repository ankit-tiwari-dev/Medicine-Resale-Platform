import { NavLink, Outlet } from "react-router-dom";
import ThemeSwitcher from "../components/common/ThemeSwitcher";

const riderLinks = [
  { to: "/rider", label: "Dashboard" },
  { to: "/rider/tasks", label: "Assigned Tasks" },
  { to: "/rider/confirm-collection", label: "Collection Proof" },
  { to: "/rider/stats", label: "Stats" },
  { to: "/rider/kyc/upload-docs", label: "KYC Upload" },
  { to: "/rider/kyc/verify-docs", label: "KYC Verification" },
  { to: "/rider/kyc/consent", label: "Submit Consent" }
];

const RiderLayout = () => {
  return (
    <div className="app-shell grid min-h-screen grid-cols-1 lg:grid-cols-[240px_1fr]">
      <aside className="border-r border-borderColor bg-surface p-4 flex flex-col">
        <p className="text-lg font-semibold text-primary">Rider Panel</p>
        <nav className="mt-6 space-y-1 flex-1">
          {riderLinks.map((link) => (
            <NavLink
              key={link.to}
              end={link.to === "/rider"}
              to={link.to}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm ${isActive ? "bg-secondary text-white" : "text-textSecondary hover:bg-slate-100 hover:text-primary"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="pt-4 mt-auto border-t border-border">
          <ThemeSwitcher />
        </div>
      </aside>
      <main className="page-wrap">
        <Outlet />
      </main>
    </div>
  );
};

export default RiderLayout;
