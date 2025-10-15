"use client";

import { columns, type Payment } from "./columns";
import { DataTable } from "./data-table";

export default function Page() {
  const data: Payment[] = [
    {
      id: "m5gr84i9",
      amount: 316,
      status: "success",
      email: "ken99@example.com",
    },
    {
      id: "3u1reuv4",
      amount: 242,
      status: "success",
      email: "Abe45@example.com",
    },
  ];

  return (
    <div className="container mx-auto ">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
