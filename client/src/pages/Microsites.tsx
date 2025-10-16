"use client";

import MainLayout from "@/layouts/MainLayout";
import { columns } from "@/pages/page-mircosites/columns";
import { DataTable } from "@/components/ui/data-table";
import { useMicroSites } from "@/hooks/use-microsites";

export default function Microsites() {
  const { microsites} = useMicroSites();

  return (
    <MainLayout>
      <DataTable columns={columns} data={microsites || []} />
    </MainLayout>
  );
}
