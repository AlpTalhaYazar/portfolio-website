"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useCSRFSecurity, useContactSubmission } from "@/hooks";
import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";

const Contact = () => {
  const security = useCSRFSecurity();
  const submission = useContactSubmission(security);

  const { effectiveTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <section
      id="contact"
      className={`py-20 ${
        effectiveTheme === "starwars" ? "bg-transparent" : "bg-muted/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.contact.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.contact.description}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <ContactInfo />

          {/* Contact Form */}
          <ContactForm
            security={security}
            submission={submission}
            onSubmit={submission.onSubmit}
          />
        </div>
      </div>
    </section>
  );
};

export default Contact;
