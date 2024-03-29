import { useQuery } from "react-query";

import { RestaurantSearchResponse } from "@/types";
import { SearchState } from "@/pages/SearchPage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useSearchRestaurants = (searchState: SearchState, city?: string) => {
  const createSearchRequest = async (): Promise<RestaurantSearchResponse> => {
    const params = new URLSearchParams();
    params.set("searchQuery", searchState.searchQuery);
    params.set("page", searchState.page.toString());
    params.set("selectedCuisines", searchState.selectedCuisines.join(","));
    params.set("sortOption", searchState.sortOption);

    const res = await fetch(`${API_BASE_URL}/api/restaurants/search/${city}?${params.toString()}`);

    if (!res.ok) {
      throw new Error("Failed to get restaurants");
    }
    return res.json();
  };

  const { data: results, isLoading } = useQuery(
    ["searchRestaurants", searchState],
    createSearchRequest,
    {
      enabled: !!city,
    }
  );

  return { results, isLoading };
};
