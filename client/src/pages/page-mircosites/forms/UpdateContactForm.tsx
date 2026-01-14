import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

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
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Update any field in the form
  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
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

      if (!res.ok) throw new Error("Failed to send");

      // Success!
      toast.success("Form submitted successfully!");
      setIsError(false);

      // Clear form
      setForm({
        businessName: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        businessAddress: "",
        otherInfo: "",
      });
    } catch (err) {
      // Error!
      toast.error("Submission failed. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl mx-auto bg-white grid gap-5">
      <h2 className="text-2xl font-bold mb-2">Update Contact Details</h2>
      <p className="text-sm text-gray-600">
        Have your business details changed? Fill out the form below to update
        your information.
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
          onChange={(e) => handleChange("businessName", e.target.value)}
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
          onChange={(e) => handleChange("contactName", e.target.value)}
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
          onChange={(e) => handleChange("contactEmail", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="contactPhone">Preferred Contact Phone</Label>
        <Input
          id="contactPhone"
          type="tel"
          placeholder="Enter a number"
          value={form.contactPhone}
          onChange={(e) => handleChange("contactPhone", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="businessAddress">Business Address</Label>
        <Input
          id="businessAddress"
          placeholder="Enter your answer"
          value={form.businessAddress}
          onChange={(e) => handleChange("businessAddress", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="otherInfo">Other</Label>
        <p className="text-sm text-gray-500 mb-1">
          If there is anything else you would like to inform us about, please
          include it here.
        </p>
        <Textarea
          id="otherInfo"
          rows={5}
          placeholder="Enter additional details"
          value={form.otherInfo}
          onChange={(e) => handleChange("otherInfo", e.target.value)}
        />
      </div>

      <div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Sending..." : "Submit"}
        </Button>

        {message && (
          <p
            className={`text-sm mt-2 ${
              isError ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
