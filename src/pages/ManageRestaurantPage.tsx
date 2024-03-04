import { useCreateRestaurant, useGetRestaurant, useUpdateRestaurant } from "@/api/RestaurantApi";
import RestaurantForm from "@/components/forms/RestaurantForm";

const ManageRestaurantPage = () => {
  const { createRestaurant, isLoading: isCreateLoading } = useCreateRestaurant();
  const { restaurant } = useGetRestaurant();
  const { updateRestaurant, isLoading: isUpdateLoading } = useUpdateRestaurant();

  const isEditing = !!restaurant;

  return (
    <RestaurantForm
      restaurant={restaurant}
      isLoading={isCreateLoading || isUpdateLoading}
      onSave={isEditing ? updateRestaurant : createRestaurant}
    />
  );
};

export default ManageRestaurantPage;
