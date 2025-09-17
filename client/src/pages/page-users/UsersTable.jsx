import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useUsers } from "@/hooks/use-users";

export default function UsersTable() {
  const { users, loading } = useUsers();

  if (loading) {
    return <div className="p-4 text-gray-500">Loading users...</div>;
  }

  return (
    <Table >
      <TableHeader >
        <TableRow>
          <TableHead >
            ID
          </TableHead>
          <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
            Name
          </TableHead>
          <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
            Username
          </TableHead>
          <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
            Email
          </TableHead>
          <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
            Role
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {Array.isArray(users) &&
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="px-4 py-2 text-black">{user.id}</TableCell>
              <TableCell className="px-4 py-2">
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell className="px-4 py-2">{user.userName}</TableCell>
              <TableCell className="px-4 py-2">{user.email}</TableCell>
              <TableCell className="px-4 py-2">{user.role}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
