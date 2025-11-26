"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  const { t } = useTranslation();

  const sections = [
    { title: t.pages.privacy.collected, content: t.pages.privacy.collectedDesc },
    { title: t.pages.privacy.usage, content: t.pages.privacy.usageDesc },
    { title: t.pages.privacy.thirdParty, content: t.pages.privacy.thirdPartyDesc },
    { title: t.pages.privacy.contact, content: t.pages.privacy.contactDesc },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base font-medium">
              {t.common.back}
            </span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Title */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {t.pages.privacy.title}
          </h1>
          <p className="text-xs md:text-sm text-gray-500">
            {t.pages.privacy.lastUpdated}
          </p>
        </div>

        {/* Intro */}
        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-8">
          {t.pages.privacy.intro}
        </p>

        {/* Sections */}
        {sections.map((section, index) => (
          <section key={index} className="mb-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
              {section.title}
            </h2>
            <div className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {section.content}
            </div>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
}
