import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useUsers } from "@/hooks/use-users";
import { CircleCheck, CircleX } from "lucide-react";

type User = {
  id: string | number;
  avatar: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  status: "active" | "inactive";
  role: string;
};

export default function UsersTable() {
  const { users, loading } = useUsers() as { users: User[]; loading: boolean };

  if (loading) {
    return <div className="p-4 text-gray-500">Loading users...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
            ID
          </TableHead>
          <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
            Avatar
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
            Status
          </TableHead>
          <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
            Role
          </TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {Array.isArray(users) &&
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="px-4 py-2 text-black">{user.id}</TableCell>
              <TableCell className="px-4 py-2">
                <div className="w-7 h-7 rounded-full border overflow-hidden">
                  <img
                    src={user.avatar}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="px-4 py-2">
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell className="px-4 py-2">{user.userName}</TableCell>
              <TableCell className="px-4 py-2">{user.email}</TableCell>
              <TableCell>
                <span
                  className={`rounded-full text-md flex gap-1 items-center w-fit ${
                    user.status === "active" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {(user.status === "active" && <CircleCheck size={16} />) ||
                    (user.status === "inactive" && (
                      <CircleX size={16}></CircleX>
                    ))}
                  {user.status}
                </span>
              </TableCell>
              <TableCell className="px-4 py-2">{user.role}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
