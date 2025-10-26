"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import AppCard from "@/components/AppCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import Logo from "@/components/Logo";
import { event } from "@/app/gtag";
import { AdSenseAd } from "@/third-parties/AdSense";
import {
  App,
  StoreFilter,
  CountryCode,
  SearchResponse,
} from "@/lib/types/app.types";
import { sortAppsByRelevance } from "@/lib/utils/appSorter";
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

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-white border-2 border-gray-300 rounded-full shadow-lg hover:border-blue-500 hover:shadow-xl transition-all z-50 group"
          aria-label="맨 위로"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>
        </button>
      )}
    </>
  );
}

function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchResults, setSearchResults] = useState<SearchResponse | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storeFilter, setStoreFilter] = useState<StoreFilter>("all");
  const [country, setCountry] = useState<CountryCode>("kr");
  const [currentLimit, setCurrentLimit] = useState(20);
  const [totalAvailable, setTotalAvailable] = useState(0);

  // Initialize from URL params
  useEffect(() => {
    const q = searchParams.get("q");
    const c = searchParams.get("country") as CountryCode;

    if (c && COUNTRIES.find((country) => country.code === c)) {
      setCountry(c);
    }

    if (q) {
      setSearchQuery(q);
      performSearch(q, c || country);
    }
  }, []);

  const performSearch = async (
    query: string,
    countryCode: CountryCode,
    limit: number = 20
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(
          query
        )}&country=${countryCode}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error("검색에 실패했습니다");
      }

      const data: SearchResponse = await response.json();
      setSearchResults(data);
      setCurrentLimit(limit);
      setTotalAvailable(data.totalCount);
    } catch (err) {
      setError("검색 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!searchQuery) return;

    setIsLoadingMore(true);
    const newLimit = currentLimit + 20;

    // GA 이벤트: 더보기 클릭
    event({
      action: "더보기_클릭",
      category: "검색",
      label: `검색어: ${searchQuery} - 현재: ${currentLimit}개 → ${newLimit}개`,
      value: newLimit,
    });

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(
          searchQuery
        )}&country=${country}&limit=${newLimit}`
      );

      if (!response.ok) {
        throw new Error("검색에 실패했습니다");
      }

      const data: SearchResponse = await response.json();
      const newTotalCount = data.appStore.count + data.playStore.count;

      setSearchResults(data);
      setCurrentLimit(newLimit);
      setTotalAvailable(data.totalCount);
    } catch (err) {
      setError("추가 결과를 불러오는데 실패했습니다.");
      console.error("Load more error:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    // GA 이벤트: 검색 실행
    event({
      action: "검색_실행",
      category: "검색",
      label: query,
      value: 1,
    });

    // Update URL with search params
    const params = new URLSearchParams();
    params.set("q", query);
    params.set("country", country);
    router.push(`/search?${params.toString()}`, { scroll: false });

    await performSearch(query, country);
  };

  const handleCountryChange = (newCountry: CountryCode) => {
    setCountry(newCountry);

    // If there's an active search, update URL and re-search
    if (searchQuery) {
      const params = new URLSearchParams();
      params.set("q", searchQuery);
      params.set("country", newCountry);
      router.push(`/search?${params.toString()}`, { scroll: false });

      performSearch(searchQuery, newCountry);
    }
  };

  const getFilteredApps = (): App[] => {
    if (!searchResults || !searchQuery) return [];

    let apps: App[] = [];

    // Collect apps based on filter
    if (storeFilter === "all") {
      apps = [...searchResults.appStore.apps, ...searchResults.playStore.apps];
    } else if (storeFilter === "appstore") {
      apps = searchResults.appStore.apps;
    } else {
      apps = searchResults.playStore.apps;
    }

    // Sort by relevance to search query
    return sortAppsByRelevance(apps, searchQuery);
  };

  const filteredApps = getFilteredApps();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ChatGPT-style centered layout */}
      <div className="flex-1 flex flex-col">
        {/* Empty state - centered content */}
        {!searchResults && !isLoading && !error && (
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="w-full max-w-3xl">
              {/* Logo and Title */}
              <div className="text-center mb-12">
                <div className="inline-block mb-6">
                  <Logo size={64} />
                </div>
                <h1 className="text-4xl font-semibold text-gray-900 mb-3">
                  Omnisearch
                </h1>
                <p className="text-lg text-gray-600">
                  App Store와 Play Store를 한 번에 검색하세요
                </p>
              </div>

              {/* Search Bar */}
              <SearchBar
                onSearch={handleSearch}
                isLoading={isLoading}
                initialValue={searchQuery}
              />

              {/* Country Selector - Minimal */}
              <div className="mt-6 flex justify-center">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full text-sm">
                  <span className="text-gray-600">국가:</span>
                  <Select value={country} onValueChange={handleCountryChange}>
                    <SelectTrigger className="w-[140px] h-8 border-none bg-transparent text-sm font-medium">
                      <SelectValue>
                        {COUNTRIES.find((c) => c.code === country) &&
                          `${COUNTRIES.find((c) => c.code === country)?.flag} ${
                            COUNTRIES.find((c) => c.code === country)?.name
                          }`}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {getRegions().map((region) => (
                        <SelectGroup key={region}>
                          <SelectLabel>{region}</SelectLabel>
                          {COUNTRIES.filter((c) => c.region === region).map(
                            (c) => (
                              <SelectItem key={c.code} value={c.code}>
                                {c.flag} {c.name}
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
              <div className="mt-12 text-center">
                <p className="text-sm text-gray-500 mb-4">예시 검색:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["카카오톡", "인스타그램", "넷플릭스", "유튜브"].map(
                    (example) => (
                      <button
                        key={example}
                        onClick={() => {
                          event({
                            action: "추천_검색_클릭",
                            category: "검색",
                            label: example,
                            value: 1,
                          });
                          handleSearch(example);
                        }}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                      >
                        {example}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results view */}
        {(searchResults || isLoading || error) && (
          <div className="flex-1">
            {/* Sticky Header with Search */}
            <div className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200">
              <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="flex items-center gap-4">
                  {/* Logo - small */}
                  <button
                    onClick={() => router.push("/")}
                    className="flex-shrink-0 hover:opacity-90 transition-opacity"
                  >
                    <Logo size={40} />
                  </button>

                  {/* Compact Search Bar */}
                  <div className="flex-1">
                    <SearchBar
                      onSearch={handleSearch}
                      isLoading={isLoading}
                      initialValue={searchQuery}
                    />
                  </div>
                </div>

                {/* Filters - Compact */}
                {searchResults && !isLoading && (
                  <div className="mt-4">
                    <FilterBar
                      storeFilter={storeFilter}
                      country={country}
                      onStoreFilterChange={setStoreFilter}
                      onCountryChange={handleCountryChange}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
              {/* Loading State */}
              {isLoading && (
                <div className="py-12">
                  <LoadingSpinner />
                  <p className="text-center text-gray-600 mt-4">검색 중...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="py-8">
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                    <div className="text-red-500 text-4xl mb-3">⚠️</div>
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Results */}
              {!isLoading && searchResults && (
                <>
                  {/* Results Summary */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      검색 결과 {filteredApps.length}개
                    </h2>
                    {storeFilter === "all" && (
                      <p className="text-sm text-gray-500 mt-1">
                        App Store {searchResults.appStore.count}개 · Play Store{" "}
                        {searchResults.playStore.count}개
                      </p>
                    )}
                  </div>

                  {/* Results List */}
                  {filteredApps.length > 0 ? (
                    <>
                      <div className="space-y-3">
                        {filteredApps.map((app, index) => (
                          <div key={`${app.store}-${app.id}`}>
                            <AppCard
                              app={app}
                              searchQuery={searchQuery}
                              rank={index + 1}
                            />
                            {/* 5번째 결과마다 광고 삽입 */}
                            {(index + 1) % 5 === 0 &&
                              index < filteredApps.length - 1 && (
                                <AdSenseAd slot="1234567890" />
                              )}
                          </div>
                        ))}
                      </div>

                      {/* Load More Button */}
                      {filteredApps.length >= currentLimit &&
                        currentLimit < 120 && (
                          <div className="mt-8 text-center">
                            <button
                              onClick={handleLoadMore}
                              disabled={isLoadingMore}
                              className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                              {isLoadingMore ? (
                                <span className="flex items-center gap-2">
                                  <svg
                                    className="animate-spin h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  로딩 중...
                                </span>
                              ) : (
                                "더 보기"
                              )}
                            </button>
                            <p className="text-xs text-gray-500 mt-3">
                              {currentLimit}개 표시 중 · 최대 120개까지 로드
                              가능
                            </p>
                          </div>
                        )}
                    </>
                  ) : (
                    <div className="text-center py-16">
                      <div className="text-5xl mb-4">🔍</div>
                      <p className="text-gray-600 text-lg font-medium mb-2">
                        검색 결과가 없습니다
                      </p>
                      <p className="text-gray-500 text-sm">
                        다른 검색어를 시도해보세요
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-xs text-gray-500">
          <p>© 2025 Omnisearch · Made with Next.js</p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchPage />
    </Suspense>
  );
}
