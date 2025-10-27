"use client";

import { StoreFilter, CountryCode } from "@/lib/types/app.types";
import { COUNTRIES, getRegions } from "@/lib/data/countries";
import { useTranslation } from "@/lib/i18n/context";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  storeFilter: StoreFilter;
  country: CountryCode;
  onStoreFilterChange: (filter: StoreFilter) => void;
  onCountryChange: (country: CountryCode) => void;
  showStoreFilter?: boolean;
}

export default function FilterBar({
  storeFilter,
  country,
  onStoreFilterChange,
  onCountryChange,
  showStoreFilter = true,
}: FilterBarProps) {
  const { t } = useTranslation();
  const regions = getRegions();
  const selectedCountry = COUNTRIES.find((c) => c.code === country);

  // 나라 이름 번역 함수
  const getCountryName = (code: CountryCode): string => {
    return (
      t.countries[code] || COUNTRIES.find((c) => c.code === code)?.name || code
    );
  };

  const storeOptions = [
    { value: "all", label: t.stores.all },
    { value: "appstore", label: t.stores.appStore },
    { value: "playstore", label: t.stores.playStore },
  ];

  const selectedStore = storeOptions.find((s) => s.value === storeFilter);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Store Filter */}
      {showStoreFilter && (
        <Select
          value={storeFilter}
          onValueChange={(value) => onStoreFilterChange(value as StoreFilter)}
        >
          <SelectTrigger className="w-[130px] h-9 text-sm rounded-full">
            <SelectValue>{selectedStore?.label}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {storeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Country Filter */}
      <Select
        value={country}
        onValueChange={(value) => onCountryChange(value as CountryCode)}
      >
        <SelectTrigger className="w-auto min-w-[140px] h-9 px-4 text-sm rounded-full">
          <SelectValue>
            {selectedCountry &&
              `${selectedCountry.flag} ${getCountryName(country)}`}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {regions.map((region) => (
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
  );
}
