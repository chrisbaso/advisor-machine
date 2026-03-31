import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-8">Error loading leads: {error.message}</div>;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Advisor Leads</h1>
      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">State</th>
              <th className="p-3">Production</th>
              <th className="p-3">Score</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {leads?.map((lead) => (
              <tr key={lead.id} className="border-t">
                <td className="p-3">
                  {lead.first_name} {lead.last_name}
                </td>
                <td className="p-3">{lead.email}</td>
                <td className="p-3">{lead.state}</td>
                <td className="p-3">{lead.annual_fia_production}</td>
                <td className="p-3 capitalize">{lead.score}</td>
                <td className="p-3 capitalize">{lead.status}</td>
                <td className="p-3">
                  {new Date(lead.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}