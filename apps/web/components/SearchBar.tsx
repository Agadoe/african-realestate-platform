import { useState } from 'react';
import { FiSearch, FiMapPin, FiFilter } from 'react-icons/fi';
import { useSearch } from '../lib/hooks';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  showFilters?: boolean;
}

export default function SearchBar({ onSearch, showFilters = true }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const { performSearch } = useSearch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      performSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-2 flex flex-col md:flex-row gap-2">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-xl" />
          <input
            type="text"
            placeholder="Search by location, property type..."
            className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:outline-none text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {showFilters && (
          <button
            type="button"
            className="flex items-center justify-center px-6 py-4 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
          >
            <FiFilter className="mr-2" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        )}

        <button
          type="submit"
          className="btn btn-primary px-6 py-4 rounded-xl whitespace-nowrap"
        >
          Search
        </button>
      </div>
    </form>
  );
}