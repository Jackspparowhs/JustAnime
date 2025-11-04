import React from 'react';
import website_name from '@/src/config/website.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

function Contact() {
  // safe fallback in case website_name is an object or missing
  const siteName =
    typeof website_name === "string" ? website_name : website_name?.name ?? "PirateRuler";

  return (
    <div className="max-w-4xl mx-auto pt-16 pb-8 px-4">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">
        Contact {siteName} Team
      </h1>

      <div className="space-y-8 text-white/70">
        <p className="text-center text-lg">
          Have questions, feedback, or a business inquiry? Visit our main site or open the contact page to get in touch with the {siteName} team.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {/* Website Link */}
          <a
            href="https://PirateRuler.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all group"
          >
            <FontAwesomeIcon icon={faGlobe} className="text-xl text-white/60 group-hover:text-white" />
            <span className="text-white/60 group-hover:text-white">Visit PirateRuler.com</span>
          </a>

          {/* Contact Page */}
          <a
            href="https://PirateRuler.com/post/contact.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all group"
          >
            <span className="text-white/60 group-hover:text-white">Open Contact Page</span>
          </a>
        </div>

        <div className="mt-10 text-center">
          <p className="text-white/60">
            Or go directly to:{" "}
            <a
              href="https://PirateRuler.com/post/contact.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline underline-offset-4 hover:text-white/80 transition-colors"
            >
              https://PirateRuler.com/post/contact.html
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
