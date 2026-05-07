import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Copy, Check, ExternalLink, MoreHorizontal } from "lucide-react";
import { type MicroSite } from "@/types/Microsite";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";

interface MicrositeCardProps {
  microsite: MicroSite;
  onEdit?: (microsite: MicroSite) => void;
  onDelete?: (microsite: MicroSite) => void;
  onUpdateStores?: (microsite: MicroSite) => void;
}

export default function MicrositeCard({
  microsite,
  onEdit,
  onDelete,
  onUpdateStores,
}: MicrositeCardProps) {
  const [copied, setCopied] = useState(false);
  const msAppUrl = import.meta.env.VITE_PROD_URL;
  const fullUrl = `${msAppUrl}/${microsite.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    toast.success("Microsite link copied to clipboard!");
  };

  return (
    <div className="flex flex-col rounded-lg border bg-card overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-muted flex items-center justify-center overflow-hidden">
        {microsite.banner ? (
          <img
            src={microsite.banner}
            alt={microsite.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ backgroundColor: microsite.color || "#e5e7eb" }}
          />
        )}

        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleCopy}>
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={fullUrl} target="_blank" rel="noopener noreferrer">
                  View microsite
                </a>
              </DropdownMenuItem>
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(microsite)}>
                  Edit microsite
                </DropdownMenuItem>
              )}
              {microsite.type === "consumer" && onUpdateStores && (
                <DropdownMenuItem onClick={() => onUpdateStores(microsite)}>
                  Update Stores
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={() => onDelete(microsite)}
                  >
                    Delete microsite
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col gap-1 p-3 flex-1">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-xl leading-tight truncate">
            {microsite.name}
          </p>
          <div
            className={`text-xs font-medium capitalize py-0.5 px-2 rounded-full w-fit ${
              microsite.type === "consumer"
                ? "bg-blue-200 text-blue-800"
                : "bg-orange-200 text-orange-800"
            }`}
          >
            {microsite.type || "—"}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-blue-600 hover:underline flex items-center gap-1 "
          >
            <ExternalLink className="h-3 w-3 shrink-0 " />
            {microsite.slug}
          </a>
          <button
            onClick={handleCopy}
            className="shrink-0 text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>
        {microsite.updatedAt && (
          <p className="text-xs text-muted-foreground mt-auto pt-2">
            Updated{" "}
            {formatDistanceToNow(new Date(microsite.updatedAt as string), {
              addSuffix: true,
            })}
          </p>
        )}
      </div>
    </div>
  );
}
