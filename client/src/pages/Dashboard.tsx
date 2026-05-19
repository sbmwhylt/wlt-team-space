import MainLayout from "@/layouts/MainLayout";
// import NoticeBoard from "./page-dashboard/components/noticeBoard";
import DashboardSectionCard from "./page-dashboard/components/DashboardSectionCard";
import TeamMeetingCard from "./page-dashboard/components/TeamMeetingCard";


export default function Dashboard() {
  return (
    <MainLayout>
      <div className="flex gap-4 items-start">
        <div className="flex flex-col flex-1 min-w-0">
          <div className="grid gap-4 md:grid-cols-3">
            <DashboardSectionCard section="reminders" label="Reminders" />
            <TeamMeetingCard />
            <DashboardSectionCard section="quote-of-the-week" label="Quote of the Week" />
            <DashboardSectionCard section="staff-updates" label="Staff Updates" />
          </div>
        </div>

        {/* <div className="border p-4 rounded-xl w-lg shrink-0">
          <NoticeBoard />
        </div> */}
      </div>
    </MainLayout>
  );
}
