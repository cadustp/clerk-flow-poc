import { UserButton } from "@clerk/clerk-react";

export default function Protected() {
  return (
    <div>
      <h1>Protected page</h1>
      <UserButton />
    </div>
  )
}