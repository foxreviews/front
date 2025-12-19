import React, { useState, useRef, useEffect } from "react";
import "./AutocompleteInput.css";

interface AutocompleteInputProps<T> {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: T) => void;
  results: T[];
  loading?: boolean;
  error?: string | null;
  renderItem: (item: T) => React.ReactNode;
  getItemKey: (item: T) => string;
  getItemValue: (item: T) => string;
  minQueryLength?: number;
  className?: string;
  disabled?: boolean;
}

/**
 * Composant générique d'autocomplete réutilisable
 * Peut être utilisé pour les villes, sous-catégories, ou tout autre type de données
 */
export function AutocompleteInput<T>({
  placeholder = "Rechercher...",
  value,
  onChange,
  onSelect,
  results,
  loading = false,
  error = null,
  renderItem,
  getItemKey,
  getItemValue,
  minQueryLength = 2,
  className = "",
  disabled = false,
}: AutocompleteInputProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fermer la liste si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ouvrir la liste quand il y a des résultats
  useEffect(() => {
    if (results.length > 0 && value.length >= minQueryLength) {
      setIsOpen(true);
    }
  }, [results, value, minQueryLength]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setFocusedIndex(-1);
    
    if (newValue.length < minQueryLength) {
      setIsOpen(false);
    }
  };

  const handleItemSelect = (item: T) => {
    const itemValue = getItemValue(item);
    onChange(itemValue);
    onSelect(item);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < results.length) {
          handleItemSelect(results[focusedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  return (
    <div className={`autocomplete-input-container ${className}`} ref={containerRef}>
      <div className="autocomplete-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="autocomplete-input-field"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0 && value.length >= minQueryLength) {
              setIsOpen(true);
            }
          }}
          disabled={disabled}
          autoComplete="off"
        />
        {loading && (
          <div className="autocomplete-loading">
            <span className="spinner">⏳</span>
          </div>
        )}
      </div>

      {error && <div className="autocomplete-error">{error}</div>}

      {isOpen && results.length > 0 && (
        <ul className="autocomplete-dropdown">
          {results.map((item, index) => (
            <li
              key={getItemKey(item)}
              className={`autocomplete-dropdown-item ${
                index === focusedIndex ? "focused" : ""
              }`}
              onClick={() => handleItemSelect(item)}
              onMouseEnter={() => setFocusedIndex(index)}
            >
              {renderItem(item)}
            </li>
          ))}
        </ul>
      )}

      {isOpen && results.length === 0 && value.length >= minQueryLength && !loading && (
        <div className="autocomplete-no-results">Aucun résultat trouvé</div>
      )}
    </div>
  );
}
