import React from 'react';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface SearchResult {
    id: string;
    name: string;
    category: string;
    description: string;
    logoUrl?: string;
}

interface SearchResultsProps {
    results: SearchResult[];
    onResultClick?: (result: SearchResult) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
    results,
    onResultClick
}) => {
    if (results.length === 0) {
        return null;
    }

    return (
        <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
            {results.map((result) => (
                <div
                    key={result.id}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 
                             transition-colors duration-150 cursor-pointer"
                    onClick={() => onResultClick?.(result)}
                >
                    <div className="p-4 flex items-start gap-4">
                        {result.logoUrl ? (
                            <div className="flex-shrink-0 w-12 h-12">
                                <Image
                                    src={result.logoUrl}
                                    alt={`${result.name} logo`}
                                    className="w-full h-full object-contain rounded"
                                />
                            </div>
                        ) : (
                            <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded 
                                          flex items-center justify-center">
                                <span className="text-xl font-bold text-slate-400">
                                    {result.name.charAt(0)}
                                </span>
                            </div>
                        )}
                        
                        <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="font-medium text-slate-900 truncate">
                                    {result.name}
                                </h3>
                                <ExternalLink 
                                    className="w-4 h-4 text-slate-400 flex-shrink-0" 
                                />
                            </div>
                            
                            <span className="text-sm text-slate-500 inline-block mb-1">
                                {result.category}
                            </span>
                            
                            <p className="text-sm text-slate-600 line-clamp-2">
                                {result.description}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Optional: Export interface for use in other components
export type { SearchResult, SearchResultsProps };