import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";

import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import UserProfileForm, { UserFormData } from "./forms/UserProfileForm";
import { useGetUser } from "@/api/UserApi";

type Props = {
  disabled: boolean;
  isLoading: boolean;
  onCheckout: (userFormData: UserFormData) => void;
};

const CheckoutButton = ({ disabled, isLoading, onCheckout }: Props) => {
  const { isAuthenticated, isLoading: isAuthLoading, loginWithRedirect } = useAuth0();
  const { pathname } = useLocation();
  const { currentUser, isLoading: isGetUserLoading } = useGetUser();

  const onLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: pathname,
      },
    });
  };

  if (!isAuthenticated) {
    return (
      <Button className="bg-orange-500 flex-1" onClick={onLogin}>
        Log in to check out
      </Button>
    );
  }

  if (isAuthLoading || !currentUser || isLoading) {
    return <LoadingButton />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="bg-orange-500 flex-1">
          Go to checkout
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] md:min-w-[700px] bg-gray-50">
        <UserProfileForm
          currentUser={currentUser}
          isLoading={isGetUserLoading}
          title="Comfirm Delivery Details"
          buttonText="Continue to payment"
          onSave={onCheckout}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutButton;
