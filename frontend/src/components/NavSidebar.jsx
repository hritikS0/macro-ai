import React from "react";
import { NavLink } from "react-router-dom";
import { Activity, Beaker, LogOut, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NavSidebar = () => {
  const { signOut } = useAuth();

  return (
    <aside className="w-72 bg-bg-surface border-r flex flex-col hidden lg:flex">
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
            <Activity className="text-white w-5 h-5 flex-shrink-0" />
          </div>
          <span className="font-black uppercase tracking-widest text-sm text-text-primary mt-1">
            NeuralOS
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm tracking-wide ${
              isActive
                ? "bg-brand-primary/10 text-brand-primary"
                : "text-text-muted hover:bg-bg-elevated hover:text-text-primary"
            }`
          }
        >
          <Activity className="w-5 h-5" />
          Commander Feed
        </NavLink>

        <NavLink
          to="/lab"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm tracking-wide ${
              isActive
                ? "bg-brand-primary/10 text-brand-primary"
                : "text-text-muted hover:bg-bg-elevated hover:text-text-primary"
            }`
          }
        >
          <Beaker className="w-5 h-5" />
          Health Tools
        </NavLink>
      </nav>

      <div className="p-6 border-t border-border-subtle">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-text-muted hover:bg-bg-elevated hover:text-danger rounded-xl transition-colors text-xs font-black uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default NavSidebar;
