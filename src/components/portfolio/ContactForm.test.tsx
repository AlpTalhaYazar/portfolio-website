import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getPortfolioContent } from "@/lib/content/portfolio";
import type {
  UseContactSubmissionReturn,
} from "@/hooks/useContactSubmission";
import type { UseCSRFSecurityReturn } from "@/hooks/useCSRFSecurity";

import { ContactForm } from "./ContactForm";

const mockSecurity: UseCSRFSecurityReturn = {
  csrfToken: "csrf-token",
  sessionId: "session-id",
  tokenExpires: Date.now() + 60_000,
  isSecurityLoading: false,
  securityError: null,
  fetchCSRFToken: vi.fn(async () => true),
  clearSecurityError: vi.fn(),
  isTokenExpired: vi.fn(() => false),
  isTokenValid: vi.fn(() => true),
};

const mockSubmission: UseContactSubmissionReturn = {
  isSubmitted: false,
  submitError: null,
  isBlocked: false,
  blockInfo: null,
  onSubmit: vi.fn(async () => true),
  clearSubmitError: vi.fn(),
  resetSubmissionState: vi.fn(),
};

vi.mock("@/hooks", () => ({
  useCSRFSecurity: () => mockSecurity,
  useContactSubmission: () => mockSubmission,
}));

describe("ContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSubmission.isSubmitted = false;
    mockSubmission.submitError = null;
    mockSubmission.isBlocked = false;
    mockSubmission.blockInfo = null;
    mockSubmission.onSubmit = vi.fn(async () => true);
  });

  it("keeps user input when submission fails", async () => {
    mockSubmission.onSubmit = vi.fn(async () => false);

    render(<ContactForm content={getPortfolioContent("en").contact.form} />);

    const user = userEvent.setup();
    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const subjectInput = screen.getByLabelText("Subject");
    const messageInput = screen.getByLabelText("Message");

    await user.type(nameInput, "Alp Talha Yazar");
    await user.type(emailInput, "alp@example.com");
    await user.type(subjectInput, "Backend collaboration");
    await user.type(
      messageInput,
      "I would like to discuss a backend engineering opportunity."
    );

    await user.click(screen.getByRole("button", { name: /Send Message/i }));

    expect(mockSubmission.onSubmit).toHaveBeenCalledTimes(1);
    expect(nameInput).toHaveValue("Alp Talha Yazar");
    expect(emailInput).toHaveValue("alp@example.com");
    expect(subjectInput).toHaveValue("Backend collaboration");
    expect(messageInput).toHaveValue(
      "I would like to discuss a backend engineering opportunity."
    );
  });
});
