"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";

export default function AboutPage() {
  const { t } = useTranslation();

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
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-block mb-4">
            <Logo size={48} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {t.pages.about.title}
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            {t.pages.about.description}
          </p>
        </div>

        {/* What is Omnisearch */}
        <section className="mb-8 md:mb-10">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
            {t.pages.about.whatIs}
          </h2>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            {t.pages.about.whatIsDesc}
          </p>
        </section>

        {/* Features */}
        <section className="mb-8 md:mb-10">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
            {t.pages.about.features}
          </h2>
          <ul className="space-y-3">
            {[
              t.pages.about.feature1,
              t.pages.about.feature2,
              t.pages.about.feature3,
              t.pages.about.feature4,
              t.pages.about.feature5,
            ].map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm md:text-base text-gray-700"
              >
                <span className="text-blue-500 mt-0.5">•</span>
                {feature}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
