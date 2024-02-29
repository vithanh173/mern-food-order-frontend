import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

import { User } from "@/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getUserRequest = async (): Promise<User> => {
    const accessToken = await getAccessTokenSilently();
    const res = await fetch(`${API_BASE_URL}/api/user/getUser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to get user");
    }
    return res.json();
  };

  const { data: currentUser, isLoading, error } = useQuery("fetchCurrentUser", getUserRequest);

  if (error) {
    toast.error(error.toString());
  }
  return { currentUser, isLoading };
};

type CreateUserRequest = {
  auth0Id: string;
  email: string;
};

export const useCreateUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createUserRequset = async (user: CreateUserRequest) => {
    const accessToken = await getAccessTokenSilently();
    const res = await fetch(`${API_BASE_URL}/api/user/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!res.ok) {
      throw new Error("Failed to create user");
    }
  };

  const { mutateAsync: createUser, isLoading, isError, isSuccess } = useMutation(createUserRequset);

  return {
    createUser,
    isLoading,
    isError,
    isSuccess,
  };
};

type updateUserRequset = {
  name: string;
  addressLine1: string;
  city: string;
  country: string;
};

export const useUpdateUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateUserRequest = async (formData: updateUserRequset) => {
    const accessToken = await getAccessTokenSilently();
    const res = await fetch(`${API_BASE_URL}/api/user/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error("Failed to update user");
    }
  };

  const {
    mutateAsync: updateUser,
    isLoading,
    isSuccess,
    error,
    reset,
  } = useMutation(updateUserRequest);

  if (isSuccess) {
    toast.success("User profile updated!");
  }

  if (error) {
    toast.error(error.toString());
    reset();
  }
  return { updateUser, isLoading };
};
