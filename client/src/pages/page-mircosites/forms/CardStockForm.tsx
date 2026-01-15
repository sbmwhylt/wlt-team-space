import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export default function CardStockForm() {
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    contactEmail: "",
    numberOfCards: "",
  });

  const [loading, setLoading] = useState(false);

  const update = (k: keyof typeof form, v: string) =>
    setForm({ ...form, [k]: v });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.contactName || "N/A",
          email: form.contactEmail || "N/A",
          subject: "Need More Card Stock",
          // Send as object for nice email formatting!
          formData: {
            "Business Name": form.businessName,
            "Preferred Contact Name": form.contactName,
            "Preferred Contact Email": form.contactEmail,
            "Number of Cards Needed": form.numberOfCards,
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to send form");
      toast.success("Form submitted successfully!");

      setForm({
        businessName: "",
        contactName: "",
        contactEmail: "",
        numberOfCards: "",
      });
    } catch (err: any) {
      toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl mx-auto grid gap-5">
      <h2 className="text-2xl font-bold mb-2">Need More Card Stock?</h2>
      <p className="text-sm text-gray-600">
        Are you a load-up store and need more cards? Fill out the form below to
        request additional stock.
      </p>

      <div>
        <Label htmlFor="businessName">
          Business Name<span className="text-red-500">*</span>
        </Label>
        <Input
          id="businessName"
          required
          placeholder="Enter your name"
          value={form.businessName}
          onChange={(e) => update("businessName", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="contactName">Preferred Contact Name</Label>
        <p className="text-sm text-gray-500 mb-1">
          Please enter first and last name.
        </p>
        <Input
          id="contactName"
          placeholder="Enter your answer"
          value={form.contactName}
          onChange={(e) => update("contactName", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="contactEmail">Preferred Contact Email Address</Label>
        <p className="text-sm text-gray-500 mb-1">
          All WLT correspondence will go to this address, including terminal
          management updates.
        </p>
        <Input
          id="contactEmail"
          type="email"
          placeholder="E.g. you@email.com"
          value={form.contactEmail}
          onChange={(e) => update("contactEmail", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="numberOfCards">
          Number of Cards Needed<span className="text-red-500">*</span>
        </Label>
        <Input
          id="numberOfCards"
          type="number"
          required
          placeholder="Enter a number"
          value={form.numberOfCards}
          onChange={(e) => update("numberOfCards", e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Sending..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
