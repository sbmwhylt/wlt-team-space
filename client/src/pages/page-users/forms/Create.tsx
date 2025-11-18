"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUsers } from "@/hooks/use-users";
import { toast } from "react-hot-toast";

const userSchema = z.object({
  firstName: z.string().min(2, "Name is required"),
  lastName: z.string().min(2, "Name is required"),
  userName: z.string().min(5),
  gender: z.enum(["male", "female", "other"]),
  birthDate: z.date().optional(),
  email: z.string().email("Must be a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "superadmin", "user"]),
  status: z.enum(["active", "inactive"]),
  avatar: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;
interface CreateUsersFormProps {
  onSuccess?: () => void; // Function to call when form succeeds
}

export default function CreateUsersForm({ onSuccess }: CreateUsersFormProps) {
  const [open, setOpen] = useState(false);
  const { create } = useUsers();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      gender: "male",
      birthDate: undefined,
      email: "",
      password: "",
      role: "user",
      status: "active",
      avatar: "",
    },
  });

  const onSubmit = async (values: UserFormValues) => {
    try {
      await create(values);
      toast.success("User created successfully");
      form.reset(); // Clear the form
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create user");
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
