import AnalyticsChart from "../AnalyticsChart";
import AdminCopyProtection from "../AntiCopyProtection";

export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
  return (
    <div className="admin-protected space-y-6">
      <AdminCopyProtection />

      <div>
        <p className="text-sm text-violet-300"></p>

        <h1 className="mt-2 text-3xl font-bold">
          View Analytics
        </h1>

        <p className="mt-2 text-slate-400">
          Track total visitors and unique visitors over the past 7 days
        </p>
      </div>

      <AnalyticsChart />
    </div>
  );
}