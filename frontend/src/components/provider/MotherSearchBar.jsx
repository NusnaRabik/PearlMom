 // frontend/src/components/provider/MotherSearchBar.jsx
import React, { useState, useEffect } from 'react';
import { Search, X, Loader } from 'lucide-react';

const MotherSearchBar = ({ value, onChange, placeholder }) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Sync local value with prop value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [localValue]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search 
          size={18} 
          className={`transition-colors ${isFocused ? 'text-pink-500' : 'text-gray-400'}`} 
        />
      </div>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder || "Search by Mother ID (e.g. MOT-2024-001)"}
        className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm 
                   focus:ring-2 focus:ring-pink-500 focus:border-pink-500 
                   placeholder-gray-400 transition-all"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center group"
          title="Clear search"
        >
          <X size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
        </button>
      )}
    </div>
  );
};

export default MotherSearchBar;