'use client';

import { COUNTRIES, getStatesForCountry, getCitiesForState } from '@/lib/locations';

interface LocationSelectProps {
  country: string;
  state: string;
  city: string;
  onChange: (values: { country: string; state: string; city: string }) => void;
  variant?: 'light' | 'dark';
  required?: boolean;
}

export default function LocationSelect({
  country,
  state,
  city,
  onChange,
  variant = 'light',
  required = false,
}: LocationSelectProps) {
  const states = country ? getStatesForCountry(country) : [];
  const cities = country && state ? getCitiesForState(country, state) : [];

  const labelClass =
    variant === 'dark'
      ? 'block text-sm font-medium text-cream/80 mb-1.5'
      : 'block text-sm font-medium text-dark mb-2';

  const selectClass =
    variant === 'dark'
      ? 'w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-sm text-cream outline-none focus:border-accent transition-colors appearance-none'
      : 'w-full h-12 px-5 border border-[#D4D4D0] rounded-[30px] bg-transparent text-dark text-sm focus:outline-none focus:border-dark transition-colors appearance-none';

  const optionClass = variant === 'dark' ? 'bg-dark text-cream' : '';
  const placeholderOptionClass = variant === 'dark' ? 'bg-dark text-muted' : '';

  function handleCountry(next: string) {
    onChange({ country: next, state: '', city: '' });
  }

  function handleState(next: string) {
    onChange({ country, state: next, city: '' });
  }

  function handleCity(next: string) {
    onChange({ country, state, city: next });
  }

  return (
    <div className="space-y-4">
      {/* Country */}
      <div>
        <label className={labelClass}>
          Country {required && <span className="text-accent">*</span>}
        </label>
        <select
          required={required}
          value={country}
          onChange={(e) => handleCountry(e.target.value)}
          className={selectClass}
        >
          <option value="" className={placeholderOptionClass}>Select a country</option>
          {COUNTRIES.map((c) => (
            <option key={c.name} value={c.name} className={optionClass}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* State */}
      <div>
        <label className={labelClass}>
          State / Province / Region {required && <span className="text-accent">*</span>}
        </label>
        <select
          required={required}
          disabled={!country}
          value={state}
          onChange={(e) => handleState(e.target.value)}
          className={`${selectClass} ${!country ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <option value="" className={placeholderOptionClass}>
            {country ? 'Select a state/region' : 'Select a country first'}
          </option>
          {states.map((s) => (
            <option key={s} value={s} className={optionClass}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        <label className={labelClass}>
          City {required && <span className="text-accent">*</span>}
        </label>
        <select
          required={required}
          disabled={!state}
          value={city}
          onChange={(e) => handleCity(e.target.value)}
          className={`${selectClass} ${!state ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <option value="" className={placeholderOptionClass}>
            {state ? 'Select a city' : 'Select a state first'}
          </option>
          {cities.map((c) => (
            <option key={c} value={c} className={optionClass}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
