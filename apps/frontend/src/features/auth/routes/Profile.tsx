import { LogoutButton, ProfileContext, ProfileTable } from "../components";
import { Card } from "flowbite-react";
const Profile = () => {
  return (
    <div className="mx-auto py-8 flex flex-col space-y-4 max-w-md dark:text-white">
      <Card className="shadow-[0_0px_25px_0px_rgba(45,105,135,.5)] dark:text-white">
        <h1
          className="text-2xl font-bold"
          style={{ display: "flex", justifyContent: "center" }}
        >
          Profile
        </h1>
        <ProfileContext />
        <ProfileTable />
        <LogoutButton />
      </Card>
    </div>
  );
};

export { Profile };
