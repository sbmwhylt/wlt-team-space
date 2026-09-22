import MainLayout from "@/layouts/MainLayout";
// import NoticeBoard from "./page-dashboard/components/noticeBoard";
import DashboardSectionCard from "./page-dashboard/components/DashboardSectionCard";
import TeamMeetingCard from "./page-dashboard/components/TeamMeetingCard";
import SongPickCard from "./page-dashboard/components/SongPickCard";

export default function Dashboard() {
  return (
    <MainLayout>
      {/* The app shell (SidebarProvider) only sets a *min* height, so nothing
          upstream caps this page — without an explicit height the cards grow
          with their content and push the page taller instead of scrolling
          inside themselves. The 6rem is the inset sidebar's m-2 (0.5rem top +
          bottom), the 4rem layout header, and the content wrapper's 1rem
          bottom padding.

          Below lg the cards stack at their natural height and the page
          scrolls; from lg up the grid is fixed and each card scrolls itself. */}
      <div className="grid grid-cols-1 gap-4 lg:h-[calc(100svh-6rem)] lg:min-h-0 lg:grid-cols-3">
        {/* Section cards */}
        <div className="grid min-h-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-rows-2">
          <DashboardSectionCard section="reminders" label="Reminders" compact />
          <DashboardSectionCard
            section="quote-of-the-week"
            label="Quote of the Week"
            compact
          />
          <DashboardSectionCard
            section="staff-updates"
            label="Staff Updates"
            compact
          />
          <SongPickCard />
        </div>

        {/* Team meetings */}
        <div className="min-h-0 lg:col-span-1">
          <TeamMeetingCard />
        </div>
      </div>
    </MainLayout>
  );
}
