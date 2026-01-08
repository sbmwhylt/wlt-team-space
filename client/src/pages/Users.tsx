import MainLayout from "@/layouts/MainLayout";
import { DataTable } from "@/pages/page-users/data-table";
import { getColumns } from "@/pages/page-users/columns";
import { useUsers } from "@/hooks/use-users";
import CreateUserDialog from "./page-users/dialog/CreateUserDialog";

export default function Users() {
  const usersState = useUsers();
  const columns = getColumns(usersState);

  return (
    <MainLayout>
      {/* <h1 className="text-2xl font-bold">User Management</h1> */}
      {/* Example grid (from your layout) */}
      {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3 mt-6">
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div> */}

      {/* Extra placeholder content */}
      <DataTable
        columns={columns}
        data={usersState.users || []}
        usersState={usersState}
      />

      <CreateUserDialog usersState={usersState}></CreateUserDialog>
    </MainLayout>
  );
}
