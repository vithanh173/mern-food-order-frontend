import { useParams } from "react-router-dom";
import { useState } from "react";

import { useSearchRestaurants } from "@/api/SearchApi";
import SearchResultsCard from "@/components/SearchResultsCard";
import SearchResultsInfo from "@/components/SearchResultsInfo";
import SearchBar, { SearchForm } from "@/components/SearchBar";
import PaginationSection from "@/components/PaginationSection";
import CuisinesFilter from "@/components/CuisinesFilter";
import SortOptionDropdown from "@/components/SortOptionDropdown";

export type SearchState = {
  searchQuery: string;
  page: number;
  selectedCuisines: string[];
  sortOption: string;
};

const SearchPage = () => {
  const { city } = useParams();
  const [searchState, setSeachState] = useState<SearchState>({
    searchQuery: "",
    page: 1,
    selectedCuisines: [],
    sortOption: "bestMatch",
  });
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { results } = useSearchRestaurants(searchState, city);

  const setSearchQuery = (searchFormData: SearchForm) => {
    setSeachState((prev) => ({
      ...prev,
      searchQuery: searchFormData.searchQuery,
      page: 1,
    }));
  };

  const resetSearch = () => {
    setSeachState((prev) => ({
      ...prev,
      searchQuery: "",
      page: 1,
      selectedCuisines: [],
      sortOption: "bestMatch",
    }));
  };

  const setPage = (page: number) => {
    setSeachState((prev) => ({
      ...prev,
      page,
    }));
  };

  const setSelectedCuisines = (selectedCuisines: string[]) => {
    setSeachState((prev) => ({
      ...prev,
      page: 1,
      selectedCuisines,
    }));
  };

  const setSortOption = (sortOption: string) => {
    setSeachState((prev) => ({
      ...prev,
      page: 1,
      sortOption,
    }));
  };

  if (!results?.data || !city) {
    return <span>No results found</span>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div id="cuisines-list">
        <CuisinesFilter
          selectedCuisines={searchState.selectedCuisines}
          isExpanded={isExpanded}
          onChange={setSelectedCuisines}
          onExpandedClick={() => setIsExpanded((prevExpanded) => !prevExpanded)}
        />
      </div>
      <div id="main-content" className="flex flex-col gap-5">
        <SearchBar
          placeholder="Search by cuisines or restaurant name"
          searchQuery={searchState.searchQuery}
          onSubmit={setSearchQuery}
          onReset={resetSearch}
        />
        <div className="flex justify-between flex-col gap-3 lg:flex-row">
          <SearchResultsInfo total={results.pagination.total} city={city} />
          <SortOptionDropdown
            sortOption={searchState.sortOption}
            onChange={(value) => setSortOption(value)}
          />
        </div>
        {results.data.map((restaurant) => (
          <SearchResultsCard restaurant={restaurant} />
        ))}
        <PaginationSection
          page={results.pagination.page}
          pages={results.pagination.pages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default SearchPage;
