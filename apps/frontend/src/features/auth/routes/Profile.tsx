import { LogoutButton, ProfileContext, ProfileTable } from "../components";

const Profile = () => {
  return (
    <div className="mx-auto py-8 flex flex-col space-y-4 max-w-md dark:text-white">
      <h1
        className="text-2xl font-bold"
        style={{ display: "flex", justifyContent: "center" }}
      >
        Profile
      </h1>
      <ProfileContext />
      <ProfileTable />
      <LogoutButton />
    </div>
  );
};

export { Profile };
