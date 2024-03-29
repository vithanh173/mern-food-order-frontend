import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

import { Order, Restaurant } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getRestaurantRequest = async (): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();

    const res = await fetch(`${API_BASE_URL}/api/restaurant/getRestaurant`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to get restaurant");
    }
    return res.json();
  };

  const { data: restaurant, isLoading } = useQuery("fetchResaurant", getRestaurantRequest);

  return { restaurant, isLoading };
};

export const useGetRestaurantById = (restaurantId?: string) => {
  const getRestaurantByIdRequest = async (): Promise<Restaurant> => {
    const res = await fetch(`${API_BASE_URL}/api/restaurant/${restaurantId}`, {
      method: "GET",
    });
    console.log(res);

    if (!res.ok) {
      throw new Error("Failed to get restaurant");
    }
    return res.json();
  };

  const { data: restaurant, isLoading } = useQuery(
    "fetchRestaurantById",
    getRestaurantByIdRequest,
    { enabled: !!restaurantId }
  );
  return { restaurant, isLoading };
};

export const useCreateRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createRestaurantRequest = async (formData: FormData): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();

    const res = await fetch(`${API_BASE_URL}/api/restaurant/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to create restaurant");
    }

    return res.json();
  };

  const {
    mutate: createRestaurant,
    isLoading,
    isSuccess,
    error,
  } = useMutation(createRestaurantRequest);

  if (isSuccess) {
    toast.success("Restaurant created");
  }

  if (error) {
    toast.error("Unable to create restaurant");
  }

  return { createRestaurant, isLoading };
};

export const useUpdateRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateRestaurantRequest = async (formData: FormData): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();

    const res = await fetch(`${API_BASE_URL}/api/restaurant/update/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to updated restaurant");
    }
    return res.json();
  };

  const {
    mutate: updateRestaurant,
    isLoading,
    isSuccess,
    error,
  } = useMutation(updateRestaurantRequest);

  if (isSuccess) {
    toast.success("Restaurant updated");
  }

  if (error) {
    toast.error("Unable to update restaurant");
  }

  return { updateRestaurant, isLoading };
};

export const useGetRestaurantOrders = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getRestaurantOrdersRequest = async (): Promise<Order[]> => {
    const accessToken = await getAccessTokenSilently();

    const res = await fetch(`${API_BASE_URL}/api/restaurant/order`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failure fetch orders");
    }

    return res.json();
  };

  const { data: orders, isLoading } = useQuery("fetchRestaurantOrders", getRestaurantOrdersRequest);

  return { orders, isLoading };
};

type UpdateStatusOrderRequest = {
  orderId: string;
  status: string;
};

export const useUpdateRestaurantOrders = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateRestaurantOrdersRequest = async (
    updateStatusOrderRequest: UpdateStatusOrderRequest
  ) => {
    const accessToken = await getAccessTokenSilently();

    const res = await fetch(
      `${API_BASE_URL}/api/restaurant/order/${updateStatusOrderRequest.orderId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status: updateStatusOrderRequest.status }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to update status order");
    }

    return res.json();
  };

  const {
    mutateAsync: updateOrderStatus,
    isLoading,
    isError,
    isSuccess,
    reset,
  } = useMutation(updateRestaurantOrdersRequest);

  if (isSuccess) {
    toast.success("Order updated");
  }

  if (isError) {
    toast.success("Unable to update order");
    reset();
  }

  return { updateOrderStatus, isLoading };
};
