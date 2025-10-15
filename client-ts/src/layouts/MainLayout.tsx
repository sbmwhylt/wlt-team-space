import { useLocation, Link } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import type { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {segments.map((segment, index) => {
                  const href = "/" + segments.slice(0, index + 1).join("/");
                  const isLast = index === segments.length - 1;

                  // Capitalize first letter or use mapping
                  const label =
                    segment.charAt(0).toUpperCase() + segment.slice(1);

                  return (
                    <BreadcrumbItem key={href}>
                      {!isLast ? (
                        <>
                          <BreadcrumbLink asChild>
                            <Link to={href}>{label}</Link>
                          </BreadcrumbLink>
                          <BreadcrumbSeparator />
                        </>
                      ) : (
                        <BreadcrumbPage>{label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
