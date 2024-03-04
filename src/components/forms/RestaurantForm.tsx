import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";

import DetailsSection from "../DetailsSection";
import { Separator } from "../ui/separator";
import CuisinesSection from "../CuisinesSection";
import MenuSection from "../MenuSection";
import ImageSection from "../ImageSection";
import LoadingButton from "../LoadingButton";
import { Button } from "../ui/button";
import { Restaurant } from "@/types";
import { useEffect } from "react";

const formSchema = z
  .object({
    name: z.string({ required_error: "Name is required" }),
    city: z.string({ required_error: "City is required" }),
    country: z.string({ required_error: "Country is required" }),
    deliveryPrice: z.coerce.number({
      required_error: "Delivery price is required",
      invalid_type_error: "Must be a valid number",
    }),
    estimatedDeliveryTime: z.coerce.number({
      required_error: "Estimated delivery time is required",
      invalid_type_error: "Must be a valid number",
    }),
    cuisines: z.array(z.string()).nonempty({ message: "Please select at least one item" }),
    menuItems: z.array(
      z.object({
        name: z.string().min(1, "Name is required"),
        price: z.coerce.number().min(1, "Price is required"),
      })
    ),
    imageUrl: z.string().optional(),
    imageFile: z.instanceof(File, { message: "Image is required" }),
  })
  .refine((data) => data.imageUrl || data.imageFile, {
    message: "Either image URL or image file must be provided",
    path: ["imageFile"],
  });

type restaurantFormData = z.infer<typeof formSchema>;

type Props = {
  restaurant?: Restaurant;
  onSave: (restaurantFormData: FormData) => void;
  isLoading: boolean;
};

const RestaurantForm = ({ restaurant, isLoading, onSave }: Props) => {
  const form = useForm<restaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuisines: [],
      menuItems: [{ name: "", price: 0 }],
    },
  });

  useEffect(() => {
    if (!restaurant) {
      return;
    }
    form.reset(restaurant);
  }, [form, restaurant]);

  const onSubmit = (formData: restaurantFormData) => {
    const data = new FormData();

    data.append("name", formData.name);
    data.append("city", formData.city);
    data.append("country", formData.country);
    data.append("deliveryPrice", formData.deliveryPrice.toString());
    data.append("estimatedDeliveryTime", formData.estimatedDeliveryTime.toString());
    formData.cuisines.forEach((cuisine, index) => {
      data.append(`cuisines[${index}]`, cuisine);
    });
    formData.menuItems.forEach((menuItem, index) => {
      data.append(`menuItems[${index}][name]`, menuItem.name);
      data.append(`menuItems[${index}][price]`, menuItem.price.toString());
    });
    if (formData.imageFile) {
      data.append("imageFile", formData.imageFile);
    }

    onSave(data);
  };

  return (
    <Form {...form}>
      <form className="space-y-8 bg-gray-50 p-10 rounded-lg" onSubmit={form.handleSubmit(onSubmit)}>
        <DetailsSection />
        <Separator />
        <CuisinesSection />
        <Separator />
        <MenuSection />
        <Separator />
        <ImageSection />
        {isLoading ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
};

export default RestaurantForm;
