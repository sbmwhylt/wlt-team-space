import MainLayout from "@/layouts/MainLayout";
import NoticeBoard from "./page-dashboard/components/noticeBoard";

export default function Dashboard() {
  return (
    <MainLayout>
      {/* <h1 className="text-2xl font-bold">Dashboard</h1> */}

      <div className="flex gap-4 items-start">
        <div className="flex flex-col flex-1 space-y-4 min-w-0">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border p-4 aspect-video rounded-xl"></div>
            <div className="border p-4 aspect-video rounded-xl"></div>
          </div>
          <div className="border p-4 aspect-video max-h-[400px] rounded-xl"></div>
        </div>

        <div className="border p-4 rounded-xl w-lg shrink-0">
          <NoticeBoard />
        </div>
      </div>

      {/* Extra placeholder content */}
      <div className=" min-h-[50vh] flex-1 rounded-xl md:min-h-min " />
    </MainLayout>
  );
}
