import { describe, expect, it } from "vitest";

import { createContactEmail } from "@/lib/email-templates";

describe("contact email output encoding", () => {
  it("renders every untrusted scalar as text instead of executable markup", () => {
    const template = createContactEmail(
      {
        name: `<img src=x onerror="alert(1)">&"'`,
        email: `person@example.com\" onclick=\"alert(1)`,
        subject: `Project <script>alert(1)</script>`,
        message: `Hello <img src=x onerror="alert(1)"> & goodbye`,
      },
      {
        _type: "securityInfo",
        ipAddress: `<svg onload="alert(1)">`,
        userAgent: `<a href="https://attacker.example">click</a>`,
        timestamp: `2026-07-15 & later`,
        sessionId: `session<iframe src="https://attacker.example">`,
      }
    );

    expect(template.html).not.toContain("<script>alert(1)</script>");
    expect(template.html).not.toContain("<img src=x");
    expect(template.html).not.toContain("<svg onload");
    expect(template.html).not.toContain("<iframe");
    expect(template.html).not.toContain('href="https://attacker.example"');
    expect(template.html).toContain("&lt;img src=x");
    expect(template.html).toContain("&amp; goodbye");
    expect(template.text).toContain("Hello <img src=x");
  });

  it("removes line breaks and control characters from the generated subject", () => {
    const template = createContactEmail(
      {
        name: "Ada",
        email: "ada@example.com",
        subject: "Hello\r\nBcc: attacker@example.com",
        message: "A sufficiently long message.",
      },
      {
        _type: "securityInfo",
        ipAddress: "Not retained",
        userAgent: "Not retained",
        timestamp: "2026-07-15T00:00:00.000Z",
      }
    );

    expect(template.subject).not.toMatch(/[\r\n]/);
    expect(template.subject).toContain("Hello Bcc: attacker@example.com");
  });
});
