import MainLayout from "@/layouts/MainLayout";
import NoticeBoard from "./page-dashboard/components/noticeBoard";
import DashboardSectionCard from "./page-dashboard/components/DashboardSectionCard";
import type { DashboardSection } from "@/types/DashboardPost";

const SECTIONS: { section: DashboardSection; label: string }[] = [
  { section: "reminders", label: "Reminders" },
  { section: "team-meeting", label: "Team Meeting" },
  { section: "quote-of-the-week", label: "Quote of the Week" },
  { section: "staff-updates", label: "Staff Updates" },
];

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="flex gap-4 items-start">
        <div className="flex flex-col flex-1 min-w-0">
          <div className="grid gap-4 md:grid-cols-2">
            {SECTIONS.map(({ section, label }) => (
              <DashboardSectionCard key={section} section={section} label={label} />
            ))}
          </div>
        </div>

        <div className="border p-4 rounded-xl w-lg shrink-0">
          <NoticeBoard />
        </div>
      </div>
    </MainLayout>
  );
}
