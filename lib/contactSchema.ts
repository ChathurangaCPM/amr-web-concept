import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be under 100 characters" })
    .trim(),
  company: z
    .string()
    .min(2, { message: "Company name must be at least 2 characters" })
    .max(100, { message: "Company name must be under 100 characters" })
    .trim(),
  email: z
    .string()
    .email({ message: "Please enter a valid email address (e.g. name@company.com)" })
    .max(255, { message: "Email must be under 255 characters" })
    .trim()
    .toLowerCase(),
  fleet: z
    .string()
    .max(50, { message: "Fleet size must be under 50 characters" })
    .optional()
    .default("Not specified"),
  message: z
    .string()
    .max(1000, { message: "Message must be under 1000 characters" })
    .optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

