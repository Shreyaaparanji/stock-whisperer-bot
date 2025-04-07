
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchStocks, type StockData } from '@/utils/stockData';

interface StockSearchProps {
  onSelectStock: (stock: StockData) => void;
}

const StockSearch = ({ onSelectStock }: StockSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query) {
      setResults(searchStocks(query));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (stock: StockData) => {
    onSelectStock(stock);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search stocks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-stock-blue focus:border-stock-blue"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {isOpen && results.length > 0 && (
        <div 
          ref={resultsRef}
          className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-auto scrollbar-thin"
        >
          {results.map((stock) => (
            <div
              key={stock.symbol}
              className="px-4 py-2 hover:bg-stock-hover cursor-pointer flex justify-between items-center"
              onClick={() => handleSelect(stock)}
            >
              <div>
                <div className="font-medium">{stock.symbol}</div>
                <div className="text-sm text-gray-500">{stock.name}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">${stock.price.toFixed(2)}</div>
                <div 
                  className={`text-sm ${
                    stock.change >= 0 ? 'text-stock-green' : 'text-stock-red'
                  }`}
                >
                  {stock.change >= 0 ? '+' : ''}
                  {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockSearch;
