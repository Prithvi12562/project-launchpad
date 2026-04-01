import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Eye, Pencil, Trash2, Globe, Crown } from "lucide-react";
import { toast } from "sonner";

interface Website {
  id: string;
  name: string;
  tagline: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: websites = [], isLoading } = useQuery({
    queryKey: ["websites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("websites")
        .select("id, name, tagline, status, created_at, updated_at")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as Website[];
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("websites").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websites"] });
      toast.success("Website deleted");
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete website"),
  });

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">My Websites</h1>
            <p className="text-muted-foreground mt-1">Manage your hotel websites</p>
          </div>
          <Button
            onClick={() => navigate("/create-website")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" /> Create Website
          </Button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6 animate-pulse space-y-3">
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-8 bg-muted rounded w-full mt-4" />
              </div>
            ))}
          </div>
        ) : websites.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-16 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-heading font-semibold text-foreground">No websites yet</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Create your first luxury hotel website in minutes.
            </p>
            <Button
              onClick={() => navigate("/create-website")}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" /> Create Your First Website
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {websites.map((site) => (
              <div
                key={site.id}
                className="group rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-heading font-semibold text-foreground truncate">
                      {site.name || "Untitled Website"}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {site.tagline || "No tagline"}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${
                      site.status === "published"
                        ? "bg-green-500/10 text-green-600"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    {site.status}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  Updated {formatDate(site.updated_at)}
                </p>

                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                  >
                    <Link to={`/preview?id=${site.id}`}>
                      <Eye className="h-4 w-4 mr-1" /> Preview
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                  >
                    <Link to={`/editor?id=${site.id}`}>
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteId(site.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Website</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The website and all its data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
