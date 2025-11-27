import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useUsers } from "@/hooks/use-users";
import MainLayout from "@/layouts/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const profileSchema = z
  .object({
    email: z.string().email().optional().or(z.literal("")),
    userName: z.string().optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword || data.confirmPassword) {
        return data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword || data.confirmPassword || data.currentPassword) {
        return (
          data.currentPassword &&
          data.currentPassword.length > 0 &&
          data.newPassword &&
          data.newPassword.length >= 8 &&
          data.confirmPassword &&
          data.confirmPassword.length > 0
        );
      }
      return true;
    },
    {
      message: "All password fields are required when changing password",
      path: ["currentPassword"],
    }
  );

type profileFormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isUsernameDialogOpen, setIsUsernameDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const { username } = useParams();
  const { user, refreshUser } = useContext(AuthContext);
  const { users, update, get } = useUsers();
  const [, setIsLoading] = useState(false);

  const profileUser = username
    ? users.find((u) => u.userName === username)
    : user;

  const form = useForm<profileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: profileUser?.email || "",
      userName: profileUser?.userName || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (profileUser) {
      form.reset({
        email: profileUser.email || "",
        userName: profileUser.userName || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [profileUser, form]);

  const handleProfileUpdate = async (data: profileFormValues) => {
    if (!profileUser) return;

    const userId = (profileUser as any)._id || (profileUser as any).id;
    if (!userId) {
      toast.error("User ID not found");
      console.error("Profile user:", profileUser);
      return;
    }

    setIsLoading(true);
    try {
      await update(userId, {
        email: data.email,
        userName: data.userName,
      });

      // Refresh both users list and current user
      if (get) await get();
      if (refreshUser) await refreshUser();

      toast.success("Profile updated!");
      setIsEmailDialogOpen(false);
      setIsUsernameDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Profile update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (data: profileFormValues) => {
    if (!profileUser) return;

    const userId = (profileUser as any)._id || (profileUser as any).id;
    if (!userId) {
      toast.error("User ID not found");
      console.error("Profile user:", profileUser);
      return;
    }

    try {
      await update(userId, { password: data.newPassword });

      // Refresh both users list and current user
      if (get) await get();
      if (refreshUser) await refreshUser();

      toast.success("Password updated successfully");
      form.reset({
        ...form.getValues(),
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsPasswordDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update password");
    }
  };

  if (!profileUser) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="h-full">
        <div className="grid grid-cols-1 h-full gap-4">
          <div className="w-full h-full rounded-xl bg-cover bg-center border p-6">
            <div className="w-full h-60 relative rounded-lg overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center brightness-80"
                style={{ backgroundImage: 'url("/bg-profile.png")' }}
              />
            </div>

            <div className="relative z-10 flex flex-col justify-center items-center mb-4 -mt-20">
              {/* Profile Avatar */}
              <Avatar className="w-40 h-40 border-4 border-white shadow-md rounded-3xl">
                {profileUser?.avatar ? (
                  <AvatarImage
                    src={profileUser.avatar}
                    alt={`${profileUser.firstName} ${profileUser.lastName}`}
                    className="object-cover "
                  />
                ) : (
                  <AvatarFallback className="bg-primary text-white flex items-center justify-center text-7xl rounded-3xl">
                    {profileUser?.firstName?.charAt(0)}
                    {profileUser?.lastName?.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>

              {/* Name */}
              <h1 className="text-xl mt-4">
                {profileUser
                  ? `${profileUser.firstName} ${profileUser.lastName}`
                  : "User Not Found"}
              </h1>

              {/* Username */}
              <h3 className="text-muted-foreground">
                @{profileUser?.userName || "unknown"}
              </h3>
            </div>

            <div className="grid gap-4 w-full">
              {/* Email */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full">
                  <div className="py-4 px-2 md:pr-6 w-full md:w-1/2">
                    <h2>Email Address</h2>
                    <p className="text-sm text-muted-foreground">
                      This email address is used to log in to your account.
                    </p>
                  </div>
                  <div className="py-2 px-2 md:px-6 text-left md:text-right w-full md:w-1/2">
                    <h2>{profileUser?.email}</h2>
                    <p className="text-sm text-emerald-500">Verified</p>
                  </div>
                </div>
                <div className="ml-2 mb-4 md:ml-0 md:mb-0 md:mt-0">
                  <Dialog
                    open={isEmailDialogOpen}
                    onOpenChange={setIsEmailDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        edit email
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Email Address</DialogTitle>
                        <DialogDescription>
                          Update your email address below. This will be used to
                          log in to your account.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(handleProfileUpdate)}
                          className="space-y-4"
                        >
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} type="email" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="outline">
                                Close
                              </Button>
                            </DialogClose>
                            <Button type="submit">Save</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Phone*/}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full">
                  <div className="py-4 px-2 md:pr-6 w-full md:w-1/2">
                    <h2>Phone Number</h2>
                    <p className="text-sm text-muted-foreground">
                      This phone number is used for account recovery.
                    </p>
                  </div>
                  <div className="py-2 px-2 md:px-6 text-left md:text-right w-full md:w-1/2">
                    <h2>+1X XXX XXX </h2>
                  </div>
                </div>
                <div className="ml-2 mb-4 md:ml-0 md:mb-0 md:mt-0">
                  <Button variant="outline" size="sm" disabled>
                    edit phone
                  </Button>
                </div>
              </div>

              {/* Username */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full">
                  <div className="py-4 px-2 md:pr-6 w-full md:w-1/2">
                    <h2>Username</h2>
                    <p className="text-sm text-muted-foreground">
                      This username is used to identify your account.
                    </p>
                  </div>
                  <div className="py-2 px-2 md:px-6 text-left md:text-right w-full md:w-1/2">
                    <h2>@{profileUser?.userName}</h2>
                  </div>
                </div>
                <div className="ml-2 mb-4 md:ml-0 md:mb-0 md:mt-0">
                  <Dialog
                    open={isUsernameDialogOpen}
                    onOpenChange={setIsUsernameDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        edit username
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Username</DialogTitle>
                        <DialogDescription>
                          Update your username below. This will be used to
                          identify your account.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(handleProfileUpdate)}
                          className="space-y-4"
                        >
                          <FormField
                            control={form.control}
                            name="userName"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} type="text" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="outline">
                                Close
                              </Button>
                            </DialogClose>
                            <Button type="submit">Save</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full">
                  <div className="py-4 px-2 md:pr-6 w-full md:w-1/2">
                    <h2>Password</h2>
                    <p className="text-sm text-muted-foreground">
                      Change your account password regularly to keep your
                      account secure.
                    </p>
                  </div>
                </div>
                <div className="ml-2 mb-4 md:ml-0 md:mb-0 md:mt-0">
                  <Dialog
                    open={isPasswordDialogOpen}
                    onOpenChange={setIsPasswordDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Edit Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Password</DialogTitle>
                        <DialogDescription>
                          Update your password below. This will be used to
                          secure your account.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(handlePasswordUpdate)}
                          className="space-y-4 mt-2"
                        >
                          <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="password"
                                    placeholder="Enter current password"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="password"
                                    placeholder="Enter new password"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="password"
                                    placeholder="Confirm your new password"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter className="flex justify-end gap-2">
                            <DialogClose asChild>
                              <Button type="button" variant="outline">
                                Close
                              </Button>
                            </DialogClose>
                            <Button type="submit">Save</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Personal Information Card */}
              <div className="bg-muted/50 rounded-xl p-6">
                <h3 className="text-sm mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      First Name
                    </p>
                    <p className="text-base font-medium">
                      {profileUser?.firstName || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Last Name
                    </p>
                    <p className="text-base font-medium">
                      {profileUser?.lastName || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Birth Date
                    </p>
                    <p className="text-base font-medium">
                      {profileUser?.birthDate
                        ? new Date(profileUser.birthDate).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Gender</p>
                    <p className="text-base font-medium capitalize">
                      {profileUser?.gender || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Information Card */}
              <div className="bg-muted/50 rounded-xl p-6">
                <h3 className="text-sm mb-4">Account Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Privileges
                    </p>
                    <p className="text-base font-medium">
                      {profileUser?.role || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Account Status
                    </p>
                    <p
                      className={`text-base font-medium  inline-flex items-center px-2.5 py-0.5 rounded-full  ${
                        profileUser?.status === "active"
                          ? "text-emerald-600 bg-emerald-500/10"
                          : "text-red-600 bg-red-500/10"
                      }`}
                    >
                      {profileUser?.status || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Created At
                    </p>
                    <p className="text-base font-medium">
                      {profileUser?.createdAt
                        ? new Date(profileUser.createdAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Last Updated
                    </p>
                    <p className="text-base font-medium">
                      {profileUser?.updatedAt
                        ? new Date(profileUser.updatedAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
