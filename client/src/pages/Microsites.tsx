import MainLayout from "@/layouts/MainLayout";
import { DataTable } from "@/pages/page-mircosites/data-table";
import { getColumns } from "@/pages/page-mircosites/columns";
import { useMicroSites } from "@/hooks/use-microsites";
import CreateMicrositeDialog from "@/pages/page-mircosites/dialog/CreateMicrositeDialog";

export default function Microsites() {
  const micrositesState = useMicroSites(); // Get full state object
  const columns = getColumns(micrositesState);

  return (
    <MainLayout>
      <DataTable
        columns={columns}
        data={micrositesState.microsites || []}
        micrositesState={micrositesState}
      />

      {/* Add the create dialog */}
      <CreateMicrositeDialog micrositesState={micrositesState} />
    </MainLayout>
  );
}
