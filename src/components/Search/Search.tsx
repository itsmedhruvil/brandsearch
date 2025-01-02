import React, { useState, useCallback } from 'react';
import { Search as SearchIcon } from 'lucide-react';

// Component imports
import { LoadingSpinner } from '@/components/UI/loading-spinner';
import { SearchResults } from '@/components/Search/search-results';

interface SearchTag {
    id: string;
    label: string;
    category: string;
}

interface SearchState {
    query: string;
    selectedCategory: string | null;
    isSearching: boolean;
    results: SearchResult[];
}

interface SearchResult {
    id: string;
    name: string;
    category: string;
    description: string;
    logoUrl?: string;
}

const ReadyToHelp: React.FC = () => {
    const [searchState, setSearchState] = useState<SearchState>({
        query: '',
        selectedCategory: null,
        isSearching: false,
        results: []
    });

    const popularSearchTags: SearchTag[] = [
        { id: 'fashion', label: 'Fashion Brands', category: 'fashion' },
        { id: 'tech', label: 'Tech Companies', category: 'technology' },
        { id: 'food', label: 'Food & Beverage', category: 'food' },
        { id: 'auto', label: 'Automotive', category: 'automotive' },
        { id: 'luxury', label: 'Luxury', category: 'luxury' }
    ];

    const handleSearch = async (searchQuery: string) => {
        setSearchState(prev => ({ ...prev, isSearching: true }));
        try {
            // Implement your search logic here
            const results = await searchBrands(searchQuery);
            setSearchState(prev => ({
                ...prev,
                results,
                isSearching: false
            }));
        } catch (error) {
            console.error('Search failed:', error);
            setSearchState(prev => ({ ...prev, isSearching: false }));
        }
    };

    const handleTagClick = (tag: SearchTag) => {
        setSearchState(prev => ({
            ...prev,
            query: tag.label,
            selectedCategory: tag.category
        }));
        handleSearch(tag.label);
    };

    const debounceSearch = useCallback(
        debounce((query: string) => handleSearch(query), 300),
        []
    );

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = event.target.value;
        setSearchState(prev => ({ ...prev, query: newQuery }));
        debounceSearch(newQuery);
    };

    return (
        <section className="bg-slate-50 py-16 px-6">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">
                    We're Ready to Help
                </h2>
                <p className="text-lg text-slate-600 mb-12">
                    Search through our brand directory to find exactly what you're looking for.
                    Need inspiration? Check out our popular searches below.
                </p>

                <div className="relative max-w-xl mx-auto">
                    <input
                        type="text"
                        value={searchState.query}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-lg 
                                 focus:outline-none focus:border-blue-500 transition duration-200"
                        placeholder="Search brands, categories, or products..."
                    />
                    <SearchIcon className="absolute right-5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                </div>

                <div className="flex flex-wrap gap-3 justify-center mt-6">
                    {popularSearchTags.map(tag => (
                        <button
                            key={tag.id}
                            onClick={() => handleTagClick(tag)}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-full 
                                     text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-300 
                                     transition duration-200"
                        >
                            {tag.label}
                        </button>
                    ))}
                </div>

                {searchState.isSearching && (
                    <div className="mt-8">
                        <LoadingSpinner />
                    </div>
                )}

                {searchState.results.length > 0 && (
                    <div className="mt-8">
                        <SearchResults results={searchState.results} />
                    </div>
                )}
            </div>
        </section>
    );
};

// Utility function for debouncing search
const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// Add type safety for API calls
async function searchBrands(query: string): Promise<SearchResult[]> {
    // Implement your API call here
    return [];
}

export default ReadyToHelp;