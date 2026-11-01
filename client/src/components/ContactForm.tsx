import { useState, type FormEvent } from "react";

type Status = { kind: "idle" | "sending" | "sent" } | { kind: "error"; detail: string };

/** Posts {name,email,message,website} as JSON to /api/contact. `website` is a hidden honeypot for bots. */
export function ContactForm({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const field = (name: string) => String(new FormData(form).get(name) ?? "");
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: field("name"), email: field("email"), message: field("message"), website: field("website") })
      });
      if (res.ok) {
        form.reset();
        setStatus({ kind: "sent" });
        return;
      }
      const body = (await res.json().catch(() => null)) as { error?: unknown } | null;
      setStatus({ kind: "error", detail: typeof body?.error === "string" ? body.error : "" });
    } catch {
      setStatus({ kind: "error", detail: "" });
    }
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <label htmlFor="cf-name">Name</label>
      <input id="cf-name" name="name" type="text" className="u-fullwidth" autoComplete="name" required maxLength={100} />

      <label htmlFor="cf-email">Email</label>
      <input id="cf-email" name="email" type="email" className="u-fullwidth" autoComplete="email" required maxLength={200} />

      <label htmlFor="cf-message">Message</label>
      <textarea id="cf-message" name="message" className="u-fullwidth" required maxLength={4000} />

      <div className="u-screen-reader-text" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className="btn btn--primary u-fullwidth" disabled={status.kind === "sending"}>
        {status.kind === "sending" ? "Sending…" : "Send Message"}
      </button>

      <p className="contact-form__status" role="status" aria-live="polite">
        {status.kind === "sent" ? "Thank you. Your message was sent; I will reply by email." : null}
        {status.kind === "error" ? (
          <>
            Sorry, the message was not sent{status.detail ? ` (${status.detail})` : ""}.{" "}
            {email ? (
              <>
                Please email me at <a href={`mailto:${email}`}>{email}</a>.
              </>
            ) : (
              "Please try again later."
            )}
          </>
        ) : null}
      </p>
    </form>
  );
}
