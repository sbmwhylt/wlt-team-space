import { useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";

const apps = [
  {
    title: "PDF to CSV Converter",
    description: "Paste raw PDF text and get a clean, structured CSV output powered by AI.",
    icon: FileText,
    href: "/apps/pdf-to-csv",
  },
];

export default function Apps() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="mt-6">
        <h1 className="text-2xl font-bold mb-1">Apps</h1>
        <p className="text-muted-foreground text-sm mb-6">Internal tools to help the team work faster.</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <Card
                key={app.href}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(app.href)}
              >
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className="bg-muted rounded-lg p-2 mt-1">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{app.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">{app.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
