"use client";

import { useState } from "react";
import { contactSchema, type ContactFormData } from "@/lib/contactSchema";

interface SubmitLog {
  text: string;
  type: "info" | "success" | "warn" | "error";
}

interface ApiResponse {
  success: boolean;
  ticketId?: string;
  company?: string;
  name?: string;
  previewMode?: boolean;
  message?: string;
  error?: string;
  errors?: Partial<Record<keyof ContactFormData, string>>;
}

export function DeploySection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    company: "",
    email: "",
    fleet: "",
    message: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [logs, setLogs] = useState<SubmitLog[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const validateField = (field: keyof ContactFormData, value: string) => {
    const singleFieldSchema = contactSchema.pick({ [field]: true } as Record<keyof ContactFormData, true>);
    const result = singleFieldSchema.safeParse({ [field]: value });
    if (!result.success) {
      const issue = result.error.issues[0];
      setFieldErrors((prev) => ({ ...prev, [field]: issue.message }));
    } else {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof ContactFormData]) {
      validateField(name as keyof ContactFormData, value);
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    validateField(name as keyof ContactFormData, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLogs([]);

    // 1. Client-side Zod validation
    const validation = contactSchema.safeParse(formData);
    if (!validation.success) {
      const errors: Partial<Record<keyof ContactFormData, string>> = {};
      const newLogs: SubmitLog[] = [
        { text: "› [ERR_ZOD]: Form payload validation failed:", type: "error" },
      ];

      validation.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof ContactFormData;
        if (path && !errors[path]) {
          errors[path] = issue.message;
          newLogs.push({ text: `  ! ${path.toUpperCase()}: ${issue.message}`, type: "error" });
        }
      });

      setFieldErrors(errors);
      setLogs(newLogs);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    setLogs([
      { text: "› validating payload via Zod schema ........ OK", type: "info" },
      { text: "› initializing Gmail SMTP dispatch gateway ..... CONNECTING", type: "info" },
    ]);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const data = (await res.json()) as ApiResponse;

      if (!res.ok || !data.success) {
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        setLogs((prev) => [
          ...prev,
          {
            text: `› [DISPATCH_FAILED]: ${data.error || "Failed to process request"}`,
            type: "error",
          },
        ]);
        setIsSubmitting(false);
        return;
      }

      setTicketId(data.ticketId || null);
      setIsSuccess(true);

      const successLogs: SubmitLog[] = [
        { text: "› validating payload via Zod schema ........ PASS", type: "info" },
        { text: "› Gmail SMTP connection handshake .......... ESTABLISHED", type: "info" },
        {
          text: `› ticket ${data.ticketId || "NX-AUTO"} assigned for ${(data.company || "CLIENT").toUpperCase()}`,
          type: "success",
        },
        data.previewMode
          ? {
              text: "› [SMTP PREVIEW]: Request logged. Configure GMAIL_USER & GMAIL_APP_PASSWORD in .env for live email delivery.",
              type: "warn",
            }
          : {
              text: `› [DISPATCHED]: Confirmation email sent to deployment inbox for ${data.name || "client"}.`,
              type: "success",
            },
        {
          text: "› our robotics engineering team will deploy on-site with a NEXUS M2 unit.",
          type: "info",
        },
      ];

      setLogs(successLogs);
    } catch (err: unknown) {
      console.error("Submission error:", err);
      setLogs((prev) => [
        ...prev,
        {
          text: "› [NETWORK_ERR]: Unable to connect to /api/contact dispatch route.",
          type: "error",
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      company: "",
      email: "",
      fleet: "",
      message: "",
    });
    setFieldErrors({});
    setLogs([]);
    setIsSuccess(false);
    setTicketId(null);
  };

  return (
    <section
      className="deploy pt-[10vh] pb-[14vh] overflow-hidden"
      id="deploy"
      aria-labelledby="deploy-heading"
    >
      <div
        className="marquee border-y border-line py-[22px] overflow-hidden -rotate-2 scale-105 bg-amber text-black"
        aria-hidden="true"
      >
        <div className="marquee-in flex w-max font-display font-extrabold text-[clamp(40px,6vw,92px)] leading-none tracking-[-0.03em] items-center">
          <span className="px-7">DEPLOY</span>
          <i className="not-italic text-[0.5em]">✦</i>
          <span className="px-7">AUTONOMY</span>
          <i className="not-italic text-[0.5em]">✦</i>
          <span className="px-7">NEXUS M2</span>
          <i className="not-italic text-[0.5em]">✦</i>
          <span className="px-7">ZERO TAPE</span>
          <i className="not-italic text-[0.5em]">✦</i>
          <span className="px-7">FLEET-READY</span>
          <i className="not-italic text-[0.5em]">✦</i>
          <span className="px-7">DEPLOY</span>
          <i className="not-italic text-[0.5em]">✦</i>
          <span className="px-7">AUTONOMY</span>
          <i className="not-italic text-[0.5em]">✦</i>
          <span className="px-7">NEXUS M2</span>
          <i className="not-italic text-[0.5em]">✦</i>
          <span className="px-7">ZERO TAPE</span>
          <i className="not-italic text-[0.5em]">✦</i>
          <span className="px-7">FLEET-READY</span>
          <i className="not-italic text-[0.5em]">✦</i>
        </div>
      </div>

      <div className="deploy-body grid grid-cols-2 max-[760px]:grid-cols-1 gap-[6vw] items-center pt-[16vh] px-[var(--pad)]">
        <div>
          <h2
            id="deploy-heading"
            className="deploy-title text-[clamp(60px,10vw,170px)]"
          >
            Put it
            <br />
            to <em>work.</em>
          </h2>
          <p className="mt-6 text-[#9a9792] text-[15px] leading-relaxed max-w-[480px]">
            Experience infrastructure-free AMR autonomy in your actual warehouse aisles.
            Fill out the dispatch terminal and our systems engineers will arrange a live
            payload demonstration with a full 1,000 kg NEXUS M2 unit.
          </p>
        </div>

        <form
          className="term border border-line2 bg-[#0a0a0a] shadow-[0_40px_120px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,138,31,0.05)] relative"
          id="termForm"
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
        >
          {/* Terminal Bar Header */}
          <div className="term-bar mono flex items-center justify-between py-3 px-4 border-b border-line text-[10px] text-mute">
            <div className="flex items-center gap-[7px]">
              <i className="w-2.5 h-2.5 rounded-full bg-amber"></i>
              <i className="w-2.5 h-2.5 rounded-full bg-[#2a2a2a]"></i>
              <i className="w-2.5 h-2.5 rounded-full bg-[#2a2a2a]"></i>
              <span className="ml-2.5 normal-case text-[#9a9792]">
                nexus@infinitude:~/deploy
              </span>
            </div>
            <span className="text-[9px] text-amber/80 tracking-widest hidden sm:inline">
              ZOD_V4 · GMAIL_SMTP
            </span>
          </div>

          <div className="term-body mono pt-[26px] px-6 pb-7 text-[13px] normal-case tracking-[0.02em]">
            <p className="muted text-dim mb-[18px]">
              # Request a live on-site demo. We bring the robot.
            </p>

            {/* Field: Name */}
            <div className="py-2.5 border-b border-dashed border-line focus-within:border-amber transition-colors">
              <label className="flex items-center gap-3">
                <span className="text-amber whitespace-nowrap min-w-[120px]">
                  &gt; name:
                </span>
                <input
                  name="name"
                  type="text"
                  required
                  disabled={isSubmitting || isSuccess}
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Elena Vance"
                  className="flex-1 bg-transparent border-0 outline-0 text-ink caret-amber placeholder:text-dim disabled:opacity-50"
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                />
              </label>
              {fieldErrors.name && (
                <p id="name-error" className="text-[#f87171] text-[11px] mt-1 pl-[124px]">
                  ! {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Field: Company */}
            <div className="py-2.5 border-b border-dashed border-line focus-within:border-amber transition-colors">
              <label className="flex items-center gap-3">
                <span className="text-amber whitespace-nowrap min-w-[120px]">
                  &gt; company:
                </span>
                <input
                  name="company"
                  type="text"
                  required
                  disabled={isSubmitting || isSuccess}
                  value={formData.company}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Apex Global Logistics"
                  className="flex-1 bg-transparent border-0 outline-0 text-ink caret-amber placeholder:text-dim disabled:opacity-50"
                  aria-invalid={!!fieldErrors.company}
                  aria-describedby={fieldErrors.company ? "company-error" : undefined}
                />
              </label>
              {fieldErrors.company && (
                <p id="company-error" className="text-[#f87171] text-[11px] mt-1 pl-[124px]">
                  ! {fieldErrors.company}
                </p>
              )}
            </div>

            {/* Field: Email */}
            <div className="py-2.5 border-b border-dashed border-line focus-within:border-amber transition-colors">
              <label className="flex items-center gap-3">
                <span className="text-amber whitespace-nowrap min-w-[120px]">
                  &gt; email:
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  disabled={isSubmitting || isSuccess}
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. e.vance@apexlogistics.com"
                  className="flex-1 bg-transparent border-0 outline-0 text-ink caret-amber placeholder:text-dim disabled:opacity-50"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                />
              </label>
              {fieldErrors.email && (
                <p id="email-error" className="text-[#f87171] text-[11px] mt-1 pl-[124px]">
                  ! {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Field: Fleet Size */}
            <div className="py-2.5 border-b border-dashed border-line focus-within:border-amber transition-colors">
              <label className="flex items-center gap-3">
                <span className="text-amber whitespace-nowrap min-w-[120px]">
                  &gt; fleet_size:
                </span>
                <input
                  name="fleet"
                  type="text"
                  disabled={isSubmitting || isSuccess}
                  value={formData.fleet}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. 5–20 units"
                  className="flex-1 bg-transparent border-0 outline-0 text-ink caret-amber placeholder:text-dim disabled:opacity-50"
                  aria-invalid={!!fieldErrors.fleet}
                />
              </label>
              {fieldErrors.fleet && (
                <p className="text-[#f87171] text-[11px] mt-1 pl-[124px]">
                  ! {fieldErrors.fleet}
                </p>
              )}
            </div>

            {/* Optional Field: Requirements / Message */}
            <div className="py-2.5 border-b border-dashed border-line focus-within:border-amber transition-colors">
              <label className="flex items-start gap-3">
                <span className="text-amber whitespace-nowrap min-w-[120px] pt-1">
                  &gt; payload_notes:
                </span>
                <textarea
                  name="message"
                  rows={2}
                  disabled={isSubmitting || isSuccess}
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Standard EUR/US pallets, 800 kg average, narrow aisles"
                  className="flex-1 bg-transparent border-0 outline-0 text-ink caret-amber placeholder:text-dim resize-none disabled:opacity-50"
                />
              </label>
            </div>

            {/* Dynamic Terminal Output Console */}
            {logs.length > 0 && (
              <div
                id="termOut"
                className="term-out min-h-[20px] mt-4 pt-3 border-t border-line/60 leading-[1.7] space-y-1"
                role="status"
                aria-live="polite"
              >
                {logs.map((log, index) => {
                  let colorClass = "text-mint";
                  if (log.type === "error") colorClass = "text-[#f87171]";
                  if (log.type === "warn") colorClass = "text-amber";
                  if (log.type === "info") colorClass = "text-[#bdbab5]";

                  return (
                    <p key={index} className={`${colorClass} font-mono text-[11px]`}>
                      {log.text}
                    </p>
                  );
                })}
              </div>
            )}

            {/* Action Buttons */}
            {!isSuccess ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className="term-run mt-[18px] w-full p-[18px] bg-amber hover:bg-ink hover:text-black text-black border-0 font-mono font-semibold text-[12px] tracking-[0.14em] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                data-magnetic=""
              >
                {isSubmitting ? (
                  <>
                    <i className="w-2 h-2 rounded-full bg-black animate-ping" />
                    DISPATCHING ./request_demo...
                  </>
                ) : (
                  "EXECUTE ./request_demo ⏎"
                )}
              </button>
            ) : (
              <div className="flex gap-3 mt-[18px]">
                <button
                  type="button"
                  disabled
                  className="flex-1 p-[18px] bg-[rgba(110,231,168,0.12)] border border-[rgba(110,231,168,0.4)] text-mint font-mono font-semibold text-[12px] tracking-[0.14em]"
                >
                  REQUEST SENT ✓ [{ticketId}]
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-[18px] bg-transparent hover:bg-white/5 border border-line text-mute hover:text-ink font-mono text-[11px] tracking-[0.1em] transition-colors"
                >
                  RESET
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
