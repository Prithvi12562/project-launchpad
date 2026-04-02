import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Tablet, ArrowLeft } from "lucide-react";
import Landing from "@/pages/Landing";

type ViewMode = "desktop" | "tablet" | "mobile";

const VIEWPORTS: Record<ViewMode, { width: string; label: string }> = {
  desktop: { width: "100%", label: "Desktop" },
  tablet: { width: "768px", label: "Tablet" },
  mobile: { width: "375px", label: "Mobile" },
};

const Preview = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const navigate = useNavigate();
  const vp = VIEWPORTS[viewMode];

  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
      {/* Toolbar */}
      <div className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-border bg-background px-4 py-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          {([
            { mode: "desktop" as ViewMode, icon: Monitor },
            { mode: "tablet" as ViewMode, icon: Tablet },
            { mode: "mobile" as ViewMode, icon: Smartphone },
          ]).map(({ mode, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === mode
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{VIEWPORTS[mode].label}</span>
            </button>
          ))}
        </div>

        <span className="text-xs text-muted-foreground hidden sm:block">
          {vp.width === "100%" ? "Full width" : vp.width}
        </span>
      </div>

      {/* Preview frame */}
      <div className="flex-1 flex justify-center py-6 px-4 overflow-auto">
        <div
          className="bg-background rounded-xl shadow-2xl border border-border overflow-hidden transition-all duration-300"
          style={{
            width: vp.width,
            maxWidth: "100%",
            minHeight: "80vh",
          }}
        >
          <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 100px)" }}>
            <Landing />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
