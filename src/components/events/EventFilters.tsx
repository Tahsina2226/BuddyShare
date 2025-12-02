'use client'

import { useState } from 'react';
import { Search, Filter, Calendar, X } from 'lucide-react';
import { EventFilters } from '@/types/event';

interface EventFiltersProps {
  filters: EventFilters;
  onFilterChange: (filters: EventFilters) => void;
  availableFilters: {
    categories: string[];
    locations: string[];
    eventTypes: string[];
  };
}

export default function EventFiltersComponent({
  filters,
  onFilterChange,
  availableFilters
}: EventFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (field: keyof EventFilters, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value,
      page: 1 // Reset to first page when filters change
    });
  };

  const clearFilters = () => {
    onFilterChange({
      keyword: '',
      category: '',
      eventType: '',
      location: '',
      dateFrom: '',
      dateTo: '',
      minFee: undefined,
      maxFee: undefined,
      status: '',
      sortBy: '',
      page: 1
    });
  };

  const hasActiveFilters = () => {
    return !!(
      filters.keyword ||
      filters.category ||
      filters.eventType ||
      filters.location ||
      filters.dateFrom ||
      filters.dateTo ||
      filters.minFee !== undefined ||
      filters.maxFee !== undefined ||
      filters.status ||
      filters.sortBy
    );
  };

  return (
    <div className="bg-white shadow-sm mb-6 p-6 border border-gray-200 rounded-xl">
      {/* Main Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="top-1/2 left-3 absolute w-5 h-5 text-gray-400 -translate-y-1/2 transform" />
          <input
            type="text"
            placeholder="Search events by title, description, or tags..."
            className="py-3 pr-4 pl-10 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
            value={filters.keyword || ''}
            onChange={(e) => handleInputChange('keyword', e.target.value)}
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div className="gap-4 grid grid-cols-1 md:grid-cols-4 mb-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700 text-sm">
            Category
          </label>
          <select
            className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
            value={filters.category || ''}
            onChange={(e) => handleInputChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {availableFilters.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700 text-sm">
            Event Type
          </label>
          <select
            className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
            value={filters.eventType || ''}
            onChange={(e) => handleInputChange('eventType', e.target.value)}
          >
            <option value="">All Types</option>
            {availableFilters.eventTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700 text-sm">
            Location
          </label>
          <select
            className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
            value={filters.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
          >
            <option value="">All Locations</option>
            {availableFilters.locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700 text-sm">
            Sort By
          </label>
          <select
            className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
            value={filters.sortBy || ''}
            onChange={(e) => handleInputChange('sortBy', e.target.value)}
          >
            <option value="">Date (Upcoming)</option>
            <option value="date">Date (Ascending)</option>
            <option value="date-desc">Date (Descending)</option>
            <option value="fee">Price (Low to High)</option>
            <option value="fee-desc">Price (High to Low)</option>
            <option value="participants">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center font-medium text-blue-600 hover:text-blue-700"
        >
          <Filter className="mr-2 w-4 h-4" />
          {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="pt-6 border-t">
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-4">
            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">
                From Date
              </label>
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                value={filters.dateFrom || ''}
                onChange={(e) => handleInputChange('dateFrom', e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">
                To Date
              </label>
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                value={filters.dateTo || ''}
                onChange={(e) => handleInputChange('dateTo', e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">
                Min Fee
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Min"
                className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                value={filters.minFee || ''}
                onChange={(e) => handleInputChange('minFee', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">
                Max Fee
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Max"
                className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                value={filters.maxFee || ''}
                onChange={(e) => handleInputChange('maxFee', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </div>
          </div>

          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">
                Status
              </label>
              <select
                className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                value={filters.status || ''}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="full">Full</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters & Clear Button */}
      {hasActiveFilters() && (
        <div className="flex flex-wrap justify-between items-center mt-6 pt-6 border-t">
          <div className="flex flex-wrap gap-2 mb-2">
            {filters.keyword && (
              <span className="inline-flex items-center bg-blue-100 px-3 py-1 rounded-full text-blue-800 text-sm">
                Search: {filters.keyword}
                <button
                  onClick={() => handleInputChange('keyword', '')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center bg-purple-100 px-3 py-1 rounded-full text-purple-800 text-sm">
                Category: {filters.category}
                <button
                  onClick={() => handleInputChange('category', '')}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.location && (
              <span className="inline-flex items-center bg-green-100 px-3 py-1 rounded-full text-green-800 text-sm">
                Location: {filters.location}
                <button
                  onClick={() => handleInputChange('location', '')}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
          
          <button
            onClick={clearFilters}
            className="flex items-center px-4 py-2 font-medium text-red-600 hover:text-red-700"
          >
            <X className="mr-1 w-4 h-4" />
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}