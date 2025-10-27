// components/UpdateContactForm.tsx

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function UpdateContactForm() {
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    businessAddress: "",
    otherInfo: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message?: string }>({
    type: "idle",
  });

  const update = (k: keyof typeof form, v: string) => setForm({ ...form, [k]: v });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "idle" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.contactName,
          email: form.contactEmail,
          subject: "Update Contact Details",
          message: `
Business Name: ${form.businessName}
Contact Name: ${form.contactName}
Email: ${form.contactEmail}
Phone: ${form.contactPhone}
Business Address: ${form.businessAddress}
Other Info: ${form.otherInfo}
          `,
        }),
      });

      if (!res.ok) throw new Error("Failed to send form");
      setStatus({ type: "success", message: "Form submitted successfully." });
      setForm({
        businessName: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        businessAddress: "",
        otherInfo: "",
      });
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "Submission failed." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-2xl mx-auto  bg-white  grid gap-5"
    >
      <h2 className="text-2xl font-bold mb-2">Update Contact Details</h2>
      <p className="text-sm text-gray-600">
        Have your business details changed? Fill out the form below to update your information.
      </p>

      <div>
        <Label htmlFor="businessName">
          Business Name<span className="text-red-500">*</span>
        </Label>
        <Input
          id="businessName"
          required
          placeholder="Enter your answer"
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
          placeholder="Enter your name"
          value={form.contactName}
          onChange={(e) => update("contactName", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="contactEmail">Preferred Contact Email Address</Label>
        <p className="text-sm text-gray-500 mb-1">
          All WLT correspondence will go to this address, including terminal management updates.
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
        <Label htmlFor="contactPhone">Preferred Contact Phone</Label>
        <Input
          id="contactPhone"
          type="tel"
          placeholder="Enter a number"
          value={form.contactPhone}
          onChange={(e) => update("contactPhone", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="businessAddress">Business Address</Label>
        <Input
          id="businessAddress"
          placeholder="Enter your answer"
          value={form.businessAddress}
          onChange={(e) => update("businessAddress", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="otherInfo">Other</Label>
        <p className="text-sm text-gray-500 mb-1">
          If there is anything else you would like to inform us about, please include it here.
        </p>
        <Textarea
          id="otherInfo"
          rows={5}
          placeholder="Enter additional details"
          value={form.otherInfo}
          onChange={(e) => update("otherInfo", e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Sending..." : "Submit"}
        </Button>
        {status.type === "success" && (
          <p className="text-green-600 text-sm">{status.message}</p>
        )}
        {status.type === "error" && (
          <p className="text-red-600 text-sm">{status.message}</p>
        )}
      </div>
    </form>
  );
}
