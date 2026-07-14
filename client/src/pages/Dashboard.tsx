import MainLayout from "@/layouts/MainLayout";
// import NoticeBoard from "./page-dashboard/components/noticeBoard";
import DashboardSectionCard from "./page-dashboard/components/DashboardSectionCard";
import TeamMeetingCard from "./page-dashboard/components/TeamMeetingCard";

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="flex gap-4 h-[calc(100vh-6rem)]">
        {/* Left column: section cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-3 md:grid-rows-2 gap-3 flex-1 min-w-0 overflow-hidden">
          <DashboardSectionCard section="reminders" label="Reminders" compact />
          <DashboardSectionCard section="quote-of-the-week" label="Quote of the Week" compact />
          <DashboardSectionCard section="staff-updates" label="Staff Updates" compact />
        </div>

        {/* Right column: Team Meetings */}
        <div className="w-[420px] shrink-0 flex flex-col overflow-hidden">
          <TeamMeetingCard />
        </div>
      </div>
    </MainLayout>
  );
}
