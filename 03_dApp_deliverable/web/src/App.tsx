import React from "react";
import { Profile } from "./Profile";
import { useAccount } from "wagmi";
import { AccessControl } from "./AccessControl";
import { useTokenBoxHasRole } from "./generated";
import { ADMIN_ROLE } from "./constants";

function App() {
  const { address, isConnected } = useAccount();

  // Check if admin.
  const { data: isAdmin } = useTokenBoxHasRole({
    args: [ADMIN_ROLE, address || "0x"],
  });

  return (
    <div className="App">
      <Profile />
      {isConnected && isAdmin && <div>{isAdmin && <AccessControl />}</div>}
    </div>
  );
}

export default App;
