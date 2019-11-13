import * as React from "react";
import { Redirect } from "react-router-dom";

interface ComponentProps {
  message: string;
}

export default function ErrorRedirect({ message }: ComponentProps) {
  return (
    <Redirect
      to={{
        pathname: "/",
        state: {
          message,
          reason: "error"
        }
      }}
    />
  );
}
