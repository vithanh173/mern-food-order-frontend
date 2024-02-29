import { useGetUser, useUpdateUser } from "@/api/UserApi";
import UserProfileForm from "@/components/forms/UserProfileForm";

const UserProfilePage = () => {
  const { updateUser, isLoading: isUpdateLoading } = useUpdateUser();
  const { currentUser, isLoading: isGetLoading } = useGetUser();

  if (isGetLoading) {
    return <span>Loading...</span>;
  }

  if (!currentUser) {
    return <span>Unable to load user profile</span>;
  }

  return (
    <UserProfileForm currentUser={currentUser} isLoading={isUpdateLoading} onSave={updateUser} />
  );
};

export default UserProfilePage;
