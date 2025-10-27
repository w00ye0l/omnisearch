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

export default function Home() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [country, setCountry] = useState<CountryCode>("kr");
  const [trendingApps, setTrendingApps] = useState<SearchResponse | null>(null);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);

  // 나라 이름 번역 함수
  const getCountryName = (code: CountryCode): string => {
    return t.countries[code] || COUNTRIES.find((c) => c.code === code)?.name || code;
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
      <div className="flex-1 flex items-center justify-center px-4 pt-16 md:pt-24">
        <div className="w-full max-w-3xl">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-block mb-6">
              <Logo size={64} />
            </div>
            <h1 className="text-4xl font-semibold text-gray-900 mb-3">
              {t.main.title}
            </h1>
            <p className="text-lg text-gray-600">
              {t.main.subtitle}
            </p>

            {/* Language Switcher */}
            <div className="mt-4 flex justify-center">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} isLoading={false} />

          {/* Country Selector - Minimal */}
          <div className="mt-4 flex justify-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full text-sm">
              <span className="text-gray-600">{t.common.country}:</span>
              <Select
                value={country}
                onValueChange={(value) => setCountry(value as CountryCode)}
              >
                <SelectTrigger className="w-auto min-w-[140px] h-8 border-none bg-transparent text-sm font-medium">
                  <SelectValue>
                    {COUNTRIES.find((c) => c.code === country) &&
                      `${COUNTRIES.find((c) => c.code === country)?.flag} ${getCountryName(country)}`}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {getRegions().map((region) => (
                    <SelectGroup key={region}>
                      <SelectLabel>{region}</SelectLabel>
                      {COUNTRIES.filter((c) => c.region === region).map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.flag} {getCountryName(c.code)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Example searches */}
          <div className="mt-6 text-center">
            <div className="flex flex-wrap justify-center gap-2">
              {t.main.exampleSearches.map((example) => (
                <button
                  key={example}
                  onClick={() => handleExampleSearch(example)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trending Apps Section */}
      {(isLoadingTrending || trendingApps) && (
        <div className="max-w-6xl mx-auto px-2 md:px-4 pb-12 pt-8 md:pt-12">
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
    </div>
  );
}
