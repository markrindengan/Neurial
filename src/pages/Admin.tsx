import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  budget: string | null;
  project_type: string | null;
  message: string;
  status: string;
  created_at: string;
};

export default function Admin() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/auth"); return; }

    const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
    if (error) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
      return;
    }
    setSubmissions(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    toast.success("Status updated");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const filtered = filter === "all" ? submissions : submissions.filter((s) => s.status === filter);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 h-16 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-primary">Neurial Admin</h1>
        <Button variant="ghost" size="sm" onClick={handleSignOut}><LogOut className="w-4 h-4 mr-2" /> Sign Out</Button>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold">Contact Submissions</h2>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-2xl border-2 dotted-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.company || "—"}</TableCell>
                  <TableCell>{s.budget || "—"}</TableCell>
                  <TableCell>{s.project_type || "—"}</TableCell>
                  <TableCell>
                    <Select value={s.status} onValueChange={(v) => updateStatus(s.id, v)}>
                      <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No submissions found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
