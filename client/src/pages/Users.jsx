import MainLayout from "@/layouts/MainLayout";
import UsersTable from "@/pages/page-users/UsersTable";

export default function Users() {
  return (
    <MainLayout>
      {/* <h1 className="text-2xl font-bold">User Management</h1> */}
      {/* Example grid (from your layout) */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3 mt-6">
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>

      {/* Extra placeholder content */}
      <div className="border min-h-[50vh] flex-1 rounded-xl md:min-h-min mt-6 p-4">
        <UsersTable />
      </div>
    </MainLayout>
  );
}
