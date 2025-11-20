export interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  role: string;
  status: "active" | "inactive";  
  avatar: string;                 
  gender: string;
  birthDate: string;
  createdAt?: Date;
  updatedAt?: Date;
}
