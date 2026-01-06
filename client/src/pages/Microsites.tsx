import MainLayout from "@/layouts/MainLayout";
import { DataTable } from "@/pages/page-mircosites/data-table";
import { getColumns } from "@/pages/page-mircosites/columns";
import { useMicroSites } from "@/hooks/use-microsites";
import CreateMicrositeDialog from "@/pages/page-mircosites/dialog/CreateMicrositeDialog";

export default function Microsites() {
  const micrositesState = useMicroSites();
  const columns = getColumns(micrositesState);

  return (
    <MainLayout>
      <DataTable columns={columns} data={micrositesState.microsites || []} />
      <CreateMicrositeDialog>
        <div></div>
      </CreateMicrositeDialog>
    </MainLayout>
  );
}
