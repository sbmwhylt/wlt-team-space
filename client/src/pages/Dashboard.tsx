import MainLayout from "@/layouts/MainLayout";
import NoticeBoard from "./page-dashboard/components/noticeBoard";

export default function Dashboard() {
  return (
    <MainLayout>
      {/* <h1 className="text-2xl font-bold">Dashboard</h1> */}
      {/* Example grid (from your layout) */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-2 mt-2">
        <div className="border p-4 aspect-video rounded-xl">
          <NoticeBoard />
        </div>
        <div className="border p-4 aspect-video rounded-xl"></div>
      </div>

      {/* Extra placeholder content */}
      <div className=" min-h-[50vh] flex-1 rounded-xl md:min-h-min " />
    </MainLayout>
  );
}
