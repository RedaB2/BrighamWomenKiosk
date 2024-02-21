import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Avatar } from "flowbite-react";

export const ProfileContext: React.FC = () => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <div>
      {isAuthenticated && (
        <div>
          <div
            className="flex flex-wrap gap-2"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              bordered
              color="gray"
              status="online"
              statusPosition="bottom-right"
              size="xl"
            ></Avatar>
            {user !== undefined && isAuthenticated && (
              <h2 className="text-xl">Hello, {user.name}!</h2>
            )}
          </div>
        </div>
      )}
      {!isAuthenticated && (
        <div>
          <div
            className="flex flex-wrap gap-2"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              bordered
              color="gray"
              size="xl"
              status="offline"
              statusPosition="bottom-right"
            ></Avatar>
            <div>
              <h2 className="text-xl">You are currently signed out.</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
