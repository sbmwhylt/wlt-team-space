export interface User {
  id: string | number;
  firstName: string;
  lastName: string;
  userName: string;
  gender?: "male" | "female";
  birthDate?: Date;
  email: string;
  password?: string;
  role: "super-admin" | "admin" | "user";
  status?: "active" | "inactive";
  avatar?: string;
}
