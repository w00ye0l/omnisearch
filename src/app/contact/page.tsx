"use client";

import Link from "next/link";
import { ChevronLeft, Github, Mail, Clock } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import Footer from "@/components/Footer";

export default function ContactPage() {
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
        <div className="mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {t.pages.contact.title}
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            {t.pages.contact.description}
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid gap-4 md:gap-6">
          {/* GitHub */}
          <a
            href="https://github.com/w00ye0l/omnisearch/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-900 rounded-xl text-white group-hover:scale-105 transition-transform">
                <Github className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  {t.pages.contact.github}
                </h2>
                <p className="text-sm text-gray-600">
                  {t.pages.contact.githubDesc}
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  github.com/w00ye0l/omnisearch/issues
                </p>
              </div>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:contact@omnisearch.store"
            className="block p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500 rounded-xl text-white group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  {t.pages.contact.email}
                </h2>
                <p className="text-sm text-gray-600">
                  {t.pages.contact.emailDesc}
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  lwyeol1010@gmail.com
                </p>
              </div>
            </div>
          </a>

          {/* Response Time */}
          <div className="p-6 bg-gray-50 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500 rounded-xl text-white">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  {t.pages.contact.response}
                </h2>
                <p className="text-sm text-gray-600">
                  {t.pages.contact.responseDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
