export interface ContactData {
  badge: string;
  title: string;
  subtitle: string;
  cardBadge: string;
  cardTitle: string;
  cardDescription: string;
  /**
   * DEMO CONTACT EMAIL
   * Clearly marked as demo data so it can easily be replaced with a live address.
   */
  demoEmail: string;
  emailButtonText: string;
  copyButtonText: string;
  copiedText: string;
  extraNote: string;
}

export const contactData: ContactData = {
  badge: "Say Hello",
  title: "CONTACT US",
  subtitle:
    "Got a question, feedback, or just craving a smashed burger? Drop us an email anytime.",
  cardBadge: "DIRECT EMAIL INBOX",
  cardTitle: "DROP US A LINE",
  cardDescription:
    "Whether you want to cater an event, give griddle feedback, or ask about our secret Shack sauce, we're all ears.",
  // DEMO CONTACT EMAIL - Replace with real email when ready
  demoEmail: "stackshake@gmail.com",
  emailButtonText: "EMAIL US",
  copyButtonText: "COPY EMAIL",
  copiedText: "COPIED TO CLIPBOARD!",
  extraNote: "We check our inbox every day and reply within 24 hours.",
};
