'use client'

import { useState } from 'react';
import { Event, EventFilters } from '@/types/event';
import { 
  Layers,
  CalendarRange,
  Map,
  DollarSign,
  Zap,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EventFiltersProps {
  filters: EventFilters;
  onFilterChange: (filters: EventFilters) => void;
  availableFilters: {
    categories: string[];
    locations: string[];
    eventTypes: string[];
  };
  events: Event[];
  isMobile?: boolean;
  onClose?: () => void;
}

export default function EventFiltersComponent({
  filters,
  onFilterChange,
  availableFilters,
  events,
  isMobile = false,
  onClose
}: EventFiltersProps) {
  const [expandedFilterSections, setExpandedFilterSections] = useState({
    categories: true,
    date: true,
    location: true,
    price: true,
    type: true
  });

  const [dateRange, setDateRange] = useState({
    start: filters.startDate || '',
    end: filters.endDate || ''
  });

  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || '',
    max: filters.maxPrice || ''
  });

  const [selectedLocation, setSelectedLocation] = useState(filters.location || '');
  const [selectedEventType, setSelectedEventType] = useState(filters.eventType || '');

  const toggleFilterSection = (section: keyof typeof expandedFilterSections) => {
    setExpandedFilterSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const applyDateFilter = () => {
    const newFilters = { ...filters, page: 1 };
    
    if (dateRange.start) {
      newFilters.startDate = dateRange.start;
    } else {
      delete newFilters.startDate;
    }
    
    if (dateRange.end) {
      newFilters.endDate = dateRange.end;
    } else {
      delete newFilters.endDate;
    }
    
    onFilterChange(newFilters);
    if (isMobile && onClose) onClose();
  };

  const applyPriceFilter = () => {
    const newFilters = { ...filters, page: 1 };
    
    if (priceRange.min) {
      newFilters.minPrice = priceRange.min;
    } else {
      delete newFilters.minPrice;
    }
    
    if (priceRange.max) {
      newFilters.maxPrice = priceRange.max;
    } else {
      delete newFilters.maxPrice;
    }
    
    onFilterChange(newFilters);
    if (isMobile && onClose) onClose();
  };

  const applyLocationFilter = () => {
    const newFilters = { ...filters, page: 1 };
    
    if (selectedLocation) {
      newFilters.location = selectedLocation;
    } else {
      delete newFilters.location;
    }
    
    onFilterChange(newFilters);
    if (isMobile && onClose) onClose();
  };

  const applyEventTypeFilter = () => {
    const newFilters = { ...filters, page: 1 };
    
    if (selectedEventType) {
      newFilters.eventType = selectedEventType;
    } else {
      delete newFilters.eventType;
    }
    
    onFilterChange(newFilters);
    if (isMobile && onClose) onClose();
  };

  const applyAllFilters = () => {
    const newFilters = { ...filters, page: 1 };
    
    if (dateRange.start) newFilters.startDate = dateRange.start;
    else delete newFilters.startDate;
    
    if (dateRange.end) newFilters.endDate = dateRange.end;
    else delete newFilters.endDate;
    
    if (priceRange.min) newFilters.minPrice = priceRange.min;
    else delete newFilters.minPrice;
    
    if (priceRange.max) newFilters.maxPrice = priceRange.max;
    else delete newFilters.maxPrice;
    
    if (selectedLocation) newFilters.location = selectedLocation;
    else delete newFilters.location;
    
    if (selectedEventType) newFilters.eventType = selectedEventType;
    else delete newFilters.eventType;
    
    onFilterChange(newFilters);
    if (isMobile && onClose) onClose();
  };

  const clearSectionFilter = (section: string) => {
    const newFilters = { ...filters, page: 1 };
    
    switch (section) {
      case 'date':
        delete newFilters.startDate;
        delete newFilters.endDate;
        setDateRange({ start: '', end: '' });
        break;
      case 'price':
        delete newFilters.minPrice;
        delete newFilters.maxPrice;
        setPriceRange({ min: '', max: '' });
        break;
      case 'location':
        delete newFilters.location;
        setSelectedLocation('');
        break;
      case 'type':
        delete newFilters.eventType;
        setSelectedEventType('');
        break;
      case 'categories':
        delete newFilters.category;
        break;
    }
    
    onFilterChange(newFilters);
  };

  const quickPricePresets = [
    { label: 'Free', min: '0', max: '0' },
    { label: 'Budget', min: '1', max: '20' },
    { label: 'Moderate', min: '21', max: '50' },
    { label: 'Premium', min: '51', max: '100' }
  ];

  const datePresets = [
    { label: 'Today', days: 0 },
    { label: 'This Week', days: 7 },
    { label: 'Next 30 Days', days: 30 },
    { label: 'Next 90 Days', days: 90 }
  ];

  const isDateFilterActive = filters.startDate || filters.endDate;
  const isPriceFilterActive = filters.minPrice || filters.maxPrice;
  const isLocationFilterActive = filters.location;
  const isTypeFilterActive = filters.eventType;
  const isCategoryFilterActive = filters.category;

  if (isMobile) {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-white">Categories</h3>
                  <p className="text-white/60 text-xs">Browse by interest</p>
                </div>
              </div>
              {isCategoryFilterActive && (
                <button
                  onClick={() => clearSectionFilter('categories')}
                  className="text-white/60 hover:text-white text-sm"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-3">
              {availableFilters.categories.slice(0, 6).map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    onFilterChange({ ...filters, category, page: 1 });
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    filters.category === category
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-white/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="font-medium">{category}</span>
                  <span className="text-white/60 text-xs">
                    {events.filter(e => e.category === category).length} events
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg">
                  <Map className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-white">Location</h3>
                  <p className="text-white/60 text-xs">Find events near you</p>
                </div>
              </div>
              {isLocationFilterActive && (
                <button
                  onClick={() => clearSectionFilter('location')}
                  className="text-white/60 hover:text-white text-sm"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-3">
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-white/5 px-3 py-3 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 w-full text-white appearance-none"
                >
                  <option value="">Select Location</option>
                  {availableFilters.locations.map((location) => (
                    <option key={location} value={location} className="bg-[#234C6A] text-white">
                      {location}
                    </option>
                  ))}
                </select>
                <div className="right-0 absolute inset-y-0 flex items-center px-2 text-white/60 pointer-events-none">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
              {selectedLocation && (
                <button
                  onClick={applyLocationFilter}
                  className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg w-full text-white transition-colors"
                >
                  Apply Location Filter
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-white">Price Range</h3>
                  <p className="text-white/60 text-xs">Set your budget</p>
                </div>
              </div>
              {isPriceFilterActive && (
                <button
                  onClick={() => clearSectionFilter('price')}
                  className="text-white/60 hover:text-white text-sm"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-3">
              <div className="gap-2 grid grid-cols-2 mb-3">
                {quickPricePresets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setPriceRange({ min: preset.min, max: preset.max });
                      onFilterChange({
                        ...filters,
                        minPrice: preset.min,
                        maxPrice: preset.max,
                        page: 1
                      });
                      if (onClose) onClose();
                    }}
                    className="bg-white/5 hover:bg-white/10 p-2 border border-white/20 rounded-lg text-white text-sm transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="gap-3 grid grid-cols-2">
                <div>
                  <label className="block mb-1 font-medium text-white/70 text-sm">
                    Min ($)
                  </label>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    placeholder="0"
                    className="bg-white/5 px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 w-full text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-white/70 text-sm">
                    Max ($)
                  </label>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    placeholder="100"
                    className="bg-white/5 px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 w-full text-white"
                  />
                </div>
              </div>
              {(priceRange.min || priceRange.max) && (
                <button
                  onClick={applyPriceFilter}
                  className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg w-full text-white transition-colors"
                >
                  Apply Price Filter
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-white">Event Type</h3>
                  <p className="text-white/60 text-xs">Type of experience</p>
                </div>
              </div>
              {isTypeFilterActive && (
                <button
                  onClick={() => clearSectionFilter('type')}
                  className="text-white/60 hover:text-white text-sm"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-3">
              <div className="relative">
                <select
                  value={selectedEventType}
                  onChange={(e) => setSelectedEventType(e.target.value)}
                  className="bg-white/5 px-3 py-3 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 w-full text-white appearance-none"
                >
                  <option value="">Select Event Type</option>
                  {availableFilters.eventTypes.map((type) => (
                    <option key={type} value={type} className="bg-[#234C6A] text-white">
                      {type}
                    </option>
                  ))}
                </select>
                <div className="right-0 absolute inset-y-0 flex items-center px-2 text-white/60 pointer-events-none">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
              {selectedEventType && (
                <button
                  onClick={applyEventTypeFilter}
                  className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg w-full text-white transition-colors"
                >
                  Apply Type Filter
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleFilterSection('categories')}
          className="flex justify-between items-center hover:bg-white/5 p-4 w-full transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-white">Categories</h3>
              <p className="text-white/60 text-xs">Browse by interest</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isCategoryFilterActive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearSectionFilter('categories');
                }}
                className="text-white/60 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
            {expandedFilterSections.categories ? (
              <ChevronUp className="w-5 h-5 text-white/60" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white/60" />
            )}
          </div>
        </button>
        
        <AnimatePresence>
          {expandedFilterSections.categories && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 border-white/10 border-t">
                <div className="space-y-3">
                  {availableFilters.categories.slice(0, 8).map((category) => (
                    <button
                      key={category}
                      onClick={() => onFilterChange({ ...filters, category, page: 1 })}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        filters.category === category
                          ? 'bg-white/10 text-white border border-white/20'
                          : 'text-white/80 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className="font-medium">{category}</span>
                      <span className="text-white/60 text-xs">
                        {events.filter(e => e.category === category).length} events
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleFilterSection('date')}
          className="flex justify-between items-center hover:bg-white/5 p-4 w-full transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <CalendarRange className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-white">Date & Time</h3>
              <p className="text-white/60 text-xs">When do you want to go?</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isDateFilterActive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearSectionFilter('date');
                }}
                className="text-white/60 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
            {expandedFilterSections.date ? (
              <ChevronUp className="w-5 h-5 text-white/60" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white/60" />
            )}
          </div>
        </button>
        
        <AnimatePresence>
          {expandedFilterSections.date && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 p-4 pt-0 border-white/10 border-t">
                <div className="gap-2 grid grid-cols-2">
                  {datePresets.map((preset) => {
                    const today = new Date();
                    const futureDate = new Date();
                    futureDate.setDate(today.getDate() + preset.days);
                    
                    return (
                      <button
                        key={preset.label}
                        onClick={() => {
                          const todayStr = today.toISOString().split('T')[0];
                          const futureStr = futureDate.toISOString().split('T')[0];
                          setDateRange({ start: todayStr, end: futureStr });
                          onFilterChange({
                            ...filters,
                            startDate: todayStr,
                            endDate: futureStr,
                            page: 1
                          });
                        }}
                        className="bg-white/5 hover:bg-white/10 p-2 border border-white/20 rounded-lg text-white text-sm transition-colors"
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block mb-1 font-medium text-white/70 text-sm">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="bg-white/5 px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 w-full text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-white/70 text-sm">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="bg-white/5 px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 w-full text-white"
                    />
                  </div>
                  {(dateRange.start || dateRange.end) && (
                    <button
                      onClick={applyDateFilter}
                      className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg w-full text-white transition-colors"
                    >
                      Apply Date Filter
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleFilterSection('location')}
          className="flex justify-between items-center hover:bg-white/5 p-4 w-full transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <Map className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-white">Location</h3>
              <p className="text-white/60 text-xs">Find events near you</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLocationFilterActive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearSectionFilter('location');
                }}
                className="text-white/60 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
            {expandedFilterSections.location ? (
              <ChevronUp className="w-5 h-5 text-white/60" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white/60" />
            )}
          </div>
        </button>
        
        <AnimatePresence>
          {expandedFilterSections.location && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 p-4 pt-0 border-white/10 border-t">
                <div className="relative">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="bg-white/5 px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 w-full text-white appearance-none"
                  >
                    <option value="">Select Location</option>
                    {availableFilters.locations.map((location) => (
                      <option key={location} value={location} className="bg-[#234C6A] text-white">
                        {location}
                      </option>
                    ))}
                  </select>
                  <div className="right-0 absolute inset-y-0 flex items-center px-2 text-white/60 pointer-events-none">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                {selectedLocation && (
                  <button
                    onClick={applyLocationFilter}
                    className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg w-full text-white transition-colors"
                  >
                    Apply Location Filter
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleFilterSection('price')}
          className="flex justify-between items-center hover:bg-white/5 p-4 w-full transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-white">Price Range</h3>
              <p className="text-white/60 text-xs">Set your budget</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isPriceFilterActive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearSectionFilter('price');
                }}
                className="text-white/60 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
            {expandedFilterSections.price ? (
              <ChevronUp className="w-5 h-5 text-white/60" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white/60" />
            )}
          </div>
        </button>
        
        <AnimatePresence>
          {expandedFilterSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 p-4 pt-0 border-white/10 border-t">
                <div className="gap-2 grid grid-cols-2">
                  {quickPricePresets.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setPriceRange({ min: preset.min, max: preset.max });
                        onFilterChange({
                          ...filters,
                          minPrice: preset.min,
                          maxPrice: preset.max,
                          page: 1
                        });
                      }}
                      className="bg-white/5 hover:bg-white/10 p-2 border border-white/20 rounded-lg text-white text-sm transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                
                <div className="space-y-3">
                  <div className="gap-3 grid grid-cols-2">
                    <div>
                      <label className="block mb-1 font-medium text-white/70 text-sm">
                        Min Price ($)
                      </label>
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        placeholder="0"
                        className="bg-white/5 px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 w-full text-white"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-white/70 text-sm">
                        Max Price ($)
                      </label>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        placeholder="100"
                        className="bg-white/5 px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 w-full text-white"
                      />
                    </div>
                  </div>
                  {(priceRange.min || priceRange.max) && (
                    <button
                      onClick={applyPriceFilter}
                      className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg w-full text-white transition-colors"
                    >
                      Apply Price Filter
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleFilterSection('type')}
          className="flex justify-between items-center hover:bg-white/5 p-4 w-full transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-white">Event Type</h3>
              <p className="text-white/60 text-xs">Type of experience</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isTypeFilterActive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearSectionFilter('type');
                }}
                className="text-white/60 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
            {expandedFilterSections.type ? (
              <ChevronUp className="w-5 h-5 text-white/60" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white/60" />
            )}
          </div>
        </button>
        
        <AnimatePresence>
          {expandedFilterSections.type && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 p-4 pt-0 border-white/10 border-t">
                <div className="relative">
                  <select
                    value={selectedEventType}
                    onChange={(e) => setSelectedEventType(e.target.value)}
                    className="bg-white/5 px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 w-full text-white appearance-none"
                  >
                    <option value="">Select Event Type</option>
                    {availableFilters.eventTypes.map((type) => (
                      <option key={type} value={type} className="bg-[#234C6A] text-white">
                        {type}
                      </option>
                    ))}
                  </select>
                  <div className="right-0 absolute inset-y-0 flex items-center px-2 text-white/60 pointer-events-none">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                {selectedEventType && (
                  <button
                    onClick={applyEventTypeFilter}
                    className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg w-full text-white transition-colors"
                  >
                    Apply Type Filter
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8">
        <button
          onClick={applyAllFilters}
          className="bg-gradient-to-r from-[#234C6A] to-[#96A78D] shadow-md hover:shadow-lg px-6 py-4 rounded-xl w-full font-bold text-white hover:scale-[1.02] transition-all"
        >
          Apply All Filters
        </button>
      </div>
    </>
  );
}