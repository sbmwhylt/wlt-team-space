// components/UpdateTerminalForm.tsx

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

export default function UpdateTerminalForm() {
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    contactEmail: "",
    reasonForUpdate: "",
    numberOfTerminals: "",
    typeOfTerminal: "",
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
          name: form.contactName || "N/A",
          email: form.contactEmail || "N/A",
          subject: "Update Terminal Details",
          message: `
Business Name: ${form.businessName}
Preferred Contact Name: ${form.contactName}
Preferred Contact Email: ${form.contactEmail}
Reason for Update: ${form.reasonForUpdate}
Number of Terminals: ${form.numberOfTerminals}
Type of Terminal: ${form.typeOfTerminal}
          `,
        }),
      });

      if (!res.ok) throw new Error("Failed to send form");
      setStatus({ type: "success", message: "Form submitted successfully." });
      setForm({
        businessName: "",
        contactName: "",
        contactEmail: "",
        reasonForUpdate: "",
        numberOfTerminals: "",
        typeOfTerminal: "",
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
      className="max-w-2xl mx-auto  grid gap-5"
    >
      <h2 className="text-2xl font-bold mb-2">Update Terminal Details</h2>
      <p className="text-sm text-gray-600">
        Have your terminal details changed? Fill out the form below to update your records.
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
        <Label>Reason for Update<span className="text-red-500">*</span></Label>
        <p className="text-sm text-gray-500 mb-1">
          Please provide detailed feedback.
        </p>
        <RadioGroup
          required
          value={form.reasonForUpdate}
          onValueChange={(val) => update("reasonForUpdate", val)}
          className="grid gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="New terminals installed" id="reason1" />
            <Label htmlFor="reason1">New terminals installed</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Change of terminal type" id="reason2" />
            <Label htmlFor="reason2">Change of terminal type</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Declined card" id="reason3" />
            <Label htmlFor="reason3">Declined card</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Other" id="reason4" />
            <Label htmlFor="reason4">Other</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="numberOfTerminals">
          Number of Terminals<span className="text-red-500">*</span>
        </Label>
        <Input
          id="numberOfTerminals"
          type="number"
          required
          placeholder="Enter a number"
          value={form.numberOfTerminals}
          onChange={(e) => update("numberOfTerminals", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="typeOfTerminal">
          Type of Terminal<span className="text-red-500">*</span>
        </Label>
        <Input
          id="typeOfTerminal"
          required
          placeholder="Enter your answer"
          value={form.typeOfTerminal}
          onChange={(e) => update("typeOfTerminal", e.target.value)}
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
