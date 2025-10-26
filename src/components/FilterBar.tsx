'use client';

import { StoreFilter, CountryCode } from '@/lib/types/app.types';
import { COUNTRIES, getRegions } from '@/lib/data/countries';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterBarProps {
  storeFilter: StoreFilter;
  country: CountryCode;
  onStoreFilterChange: (filter: StoreFilter) => void;
  onCountryChange: (country: CountryCode) => void;
}

export default function FilterBar({
  storeFilter,
  country,
  onStoreFilterChange,
  onCountryChange,
}: FilterBarProps) {
  const regions = getRegions();
  const selectedCountry = COUNTRIES.find(c => c.code === country);

  const storeOptions = [
    { value: 'all', label: '전체 스토어' },
    { value: 'appstore', label: 'App Store' },
    { value: 'playstore', label: 'Play Store' },
  ];

  const selectedStore = storeOptions.find(s => s.value === storeFilter);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Store Filter */}
      <Select value={storeFilter} onValueChange={(value) => onStoreFilterChange(value as StoreFilter)}>
        <SelectTrigger className="w-[130px] h-9 text-sm rounded-full">
          <SelectValue>
            {selectedStore?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {storeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Country Filter */}
      <Select value={country} onValueChange={(value) => onCountryChange(value as CountryCode)}>
        <SelectTrigger className="w-[140px] h-9 text-sm rounded-full">
          <SelectValue>
            {selectedCountry && `${selectedCountry.flag} ${selectedCountry.name}`}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {regions.map((region) => (
            <SelectGroup key={region}>
              <SelectLabel>{region}</SelectLabel>
              {COUNTRIES
                .filter(c => c.region === region)
                .map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
