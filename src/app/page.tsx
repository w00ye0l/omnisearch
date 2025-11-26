"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import TrendingSection from "@/components/TrendingSection";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "@/lib/i18n/context";
import { event } from "./gtag";
import { CountryCode, SearchResponse } from "@/lib/types/app.types";
import { COUNTRIES, getRegions } from "@/lib/data/countries";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WebSiteJsonLd, OrganizationJsonLd } from "@/components/JsonLd";

export default function Home() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [country, setCountry] = useState<CountryCode>("kr");
  const [trendingApps, setTrendingApps] = useState<SearchResponse | null>(null);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);

  // 나라 이름 번역 함수
  const getCountryName = (code: CountryCode): string => {
    return (
      t.countries[code] || COUNTRIES.find((c) => c.code === code)?.name || code
    );
  };

  useEffect(() => {
    const fetchTrending = async () => {
      setIsLoadingTrending(true);
      try {
        const [freeResponse, paidResponse] = await Promise.all([
          fetch(`/api/trending?country=${country}&limit=10`),
          fetch(`/api/trending/paid?country=${country}&limit=10`),
        ]);

        if (freeResponse.ok) {
          const freeData = await freeResponse.json();
          setTrendingApps(freeData);
        }

        if (paidResponse.ok) {
          const paidData = await paidResponse.json();
          setTrendingApps((prev) => ({
            ...prev!,
            paidAppStore: paidData.appStore,
            paidPlayStore: paidData.playStore,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch trending apps:", error);
      } finally {
        setIsLoadingTrending(false);
      }
    };

    fetchTrending();
  }, [country]);

  const handleSearch = (query: string) => {
    // GA 이벤트: 메인 페이지 검색
    event({
      action: "검색_실행",
      category: "검색",
      label: query,
      value: 1,
    });

    const params = new URLSearchParams();
    params.set("q", query);
    params.set("country", country);
    params.set("lang", locale);
    router.push(`/search?${params.toString()}`);
  };

  const handleExampleSearch = (query: string) => {
    // GA 이벤트: 추천 검색 클릭
    event({
      action: "추천_검색_클릭",
      category: "검색",
      label: query,
      value: 1,
    });
    handleSearch(query);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section with Rainbow Gradient */}
      <div className="relative overflow-hidden">
        {/* Rainbow Gradient Background */}
        <div className="absolute inset-0">
          {/* Base gradient - 파랑, 초록, 노랑, 빨강 */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #3b82f6 0%, #22c55e 33%, #eab308 66%, #ef4444 100%)",
            }}
          />
          {/* Blur overlay circles for depth */}
          <div
            className="absolute -top-10 -left-10 w-64 h-64 rounded-full opacity-60"
            style={{
              background:
                "radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute top-0 right-10 w-56 h-56 rounded-full opacity-50"
            style={{
              background:
                "radial-gradient(circle, rgba(34, 197, 94, 0.8) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />
          <div
            className="absolute bottom-0 left-1/2 w-48 h-48 rounded-full opacity-50"
            style={{
              background:
                "radial-gradient(circle, rgba(239, 68, 68, 0.7) 0%, transparent 70%)",
              filter: "blur(45px)",
            }}
          />
          {/* White gradient fade to bottom */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(255,255,255,0.7) 70%, rgba(255,255,255,1) 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center px-4 pt-10 md:pt-16 pb-6 md:pb-8">
          <div className="w-full max-w-3xl">
            {/* Logo and Title */}
            <div className="text-center mb-6 md:mb-8">
              <div className="inline-block mb-4 md:mb-6 drop-shadow-lg">
                <Logo size={64} />
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-3 drop-shadow-md">
                {t.main.title}
              </h1>
              <p className="text-sm md:text-lg text-white/90 drop-shadow-sm">
                {t.main.subtitle}
              </p>

              {/* Language Switcher */}
              <div className="mt-3 md:mt-4 flex justify-center">
                <LanguageSwitcher />
              </div>
            </div>

            {/* Search Bar */}
            <div className="drop-shadow-xl">
              <SearchBar onSearch={handleSearch} isLoading={false} />
            </div>

            {/* Country Selector - Minimal */}
            <div className="mt-3 md:mt-4 flex justify-center">
              <div className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 bg-white/80 backdrop-blur-sm hover:bg-gray-100 hover:outline hover:outline-gray-200  rounded-full text-xs md:text-sm shadow-sm">
                <span className="text-gray-600">{t.common.country}:</span>
                <Select
                  value={country}
                  onValueChange={(value) => setCountry(value as CountryCode)}
                >
                  <SelectTrigger className="w-auto min-w-[120px] md:min-w-[140px] h-7 md:h-8 border-none bg-transparent text-xs md:text-sm font-medium">
                    <SelectValue>
                      {COUNTRIES.find((c) => c.code === country) &&
                        `${
                          COUNTRIES.find((c) => c.code === country)?.flag
                        } ${getCountryName(country)}`}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {getRegions().map((region) => (
                      <SelectGroup key={region}>
                        <SelectLabel>{region}</SelectLabel>
                        {COUNTRIES.filter((c) => c.region === region).map(
                          (c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.flag} {getCountryName(c.code)}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Example searches */}
            <div className="mt-4 md:mt-6 text-center">
              <div className="flex flex-wrap justify-center gap-2">
                {t.main.exampleSearches.map((example) => (
                  <button
                    key={example}
                    onClick={() => handleExampleSearch(example)}
                    className="px-3 md:px-4 py-1.5 md:py-2 bg-white/80 backdrop-blur-sm hover:bg-gray-100 hover:outline hover:outline-gray-200 rounded-full text-xs md:text-sm text-gray-700 transition-colors shadow-sm"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Apps Section */}
      {(isLoadingTrending || trendingApps) && (
        <div className="max-w-6xl mx-auto px-2 md:px-4 pb-12 pt-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 px-2 md:px-0">
            {t.main.trendingApps}
          </h2>

          {isLoadingTrending ? (
            <div className="py-8">
              <LoadingSpinner />
            </div>
          ) : (
            trendingApps && (
              <div className="grid grid-cols-2 gap-3 md:gap-6">
                <TrendingSection
                  title={t.stores.appStore}
                  apps={trendingApps.appStore.apps}
                  badgeVariant="appstore"
                  badgeText={t.main.free}
                  hoverColor="group-hover:text-blue-600"
                  locale={locale}
                />

                <TrendingSection
                  title={t.stores.playStore}
                  apps={trendingApps.playStore.apps}
                  badgeVariant="playstore"
                  badgeText={t.main.free}
                  hoverColor="group-hover:text-green-600"
                  locale={locale}
                />

                {(trendingApps as any).paidAppStore?.apps && (
                  <TrendingSection
                    title={t.stores.appStore}
                    apps={(trendingApps as any).paidAppStore.apps}
                    badgeVariant="secondary"
                    badgeText={t.main.paid}
                    hoverColor="group-hover:text-blue-600"
                    locale={locale}
                  />
                )}

                {(trendingApps as any).paidPlayStore?.apps && (
                  <TrendingSection
                    title={t.stores.playStore}
                    apps={(trendingApps as any).paidPlayStore.apps}
                    badgeVariant="secondary"
                    badgeText={t.main.paid}
                    hoverColor="group-hover:text-green-600"
                    locale={locale}
                  />
                )}
              </div>
            )
          )}
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* JSON-LD Structured Data */}
      <WebSiteJsonLd />
      <OrganizationJsonLd />
    </div>
  );
}
