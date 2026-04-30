import { useState, useRef } from "react";
import axios from "axios";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Download, Loader2, RotateCcw, UploadCloud, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function PdfToCsv() {
  const [file, setFile] = useState<File | null>(null);
  const [csvOutput, setCsvOutput] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(selected: File | null) {
    if (!selected) return;
    if (selected.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }
    setError("");
    setCsvOutput("");
    setCount(null);
    setFile(selected);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0] ?? null);
  }

  async function handleConvert() {
    if (!file) return;
    setLoading(true);
    setError("");
    setCsvOutput("");
    setCount(null);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/tools/pdf-to-csv`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCsvOutput(res.data.csv ?? "EMPTY");
      setCount(res.data.count ?? null);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!csvOutput || csvOutput === "EMPTY") return;
    const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file ? file.name.replace(/\.pdf$/i, ".csv") : "output.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setFile(null);
    setCsvOutput("");
    setCount(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <MainLayout>
      <div className="mt-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-1">PDF to CSV Converter</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Upload a WLT gift card PDF. Extracts Account, Card Number, PIN, and EAID into a CSV.
        </p>

        {/* Drop zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors mb-6
            ${dragging ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/60 hover:bg-muted/30"}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />

          {file ? (
            <>
              <FileText className="h-10 w-10 text-primary" />
              <p className="font-medium text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </>
          ) : (
            <>
              <UploadCloud className="h-10 w-10 text-muted-foreground/60" />
              <p className="text-sm font-medium">Drop a PDF here or click to browse</p>
              <p className="text-xs text-muted-foreground">Only .pdf files are accepted</p>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          <Button onClick={handleConvert} disabled={loading || !file}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Extracting...
              </>
            ) : (
              "Extract to CSV"
            )}
          </Button>

          {csvOutput && csvOutput !== "EMPTY" && (
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
          )}

          {(file || csvOutput) && (
            <Button variant="ghost" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>

        {error && <p className="text-sm text-destructive mb-4">{error}</p>}

        {/* Result */}
        {csvOutput && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Label>CSV Output</Label>
              {count !== null && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {count} cards found
                </span>
              )}
              {csvOutput === "EMPTY" && (
                <span className="text-xs text-muted-foreground">— no card data found in this PDF</span>
              )}
            </div>
            {csvOutput !== "EMPTY" && (
              <Textarea
                readOnly
                className="min-h-[280px] font-mono text-sm resize-none bg-muted/40"
                value={csvOutput}
              />
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
