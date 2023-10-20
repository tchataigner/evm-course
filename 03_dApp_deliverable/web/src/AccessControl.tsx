import { useTokenBoxGrantRole, useTokenBoxRevokeRole } from "./generated";
import { useQuery } from "@apollo/client";
import { USERS } from "./graphql";
import { useState } from "react";
import { ADMIN_ROLE, MINTER_ROLE, REDEEMER_ROLE } from "./constants";

interface AccessRowProperties {
  address: `0x${string}`;
  isAdmin: boolean;
  isMinter: boolean;
  isRedeemer: boolean;
}

// Leverages wagmi hooks to connect to a metamask wallet
export function AccessControl() {
  const { loading, error, data } = useQuery(USERS);

  if (loading) return <p className="leading-7">Role table loading...</p>;

  if (error)
    return (
      <p className="leading-7">Error fetching Roles Table: {error.message}</p>
    );

  return (
    <table className="w-full">
      <thead>
        <tr className="m-0 border-t border-slate-300 p-0 even:bg-slate-100 dark:border-slate-700 dark:even:bg-slate-800">
          <th className="border border-slate-200 px-4 py-2 text-left font-bold dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
            Account
          </th>
          <th className="border border-slate-200 px-4 py-2 text-left font-bold dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
            Admin
          </th>
          <th className="border border-slate-200 px-4 py-2 text-left font-bold dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
            Minter
          </th>
          <th className="border border-slate-200 px-4 py-2 text-left font-bold dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
            Redeemer
          </th>
        </tr>
      </thead>
      <tbody>
        {data.users.map(
          (u: {
            address: `0x${string}`;
            isRedeemer: boolean;
            isMinter: boolean;
            isAdmin: boolean;
          }) => {
            return (
              <AccessRow
                key={u.address}
                address={u.address}
                isRedeemer={u.isRedeemer}
                isMinter={u.isMinter}
                isAdmin={u.isAdmin}
              />
            );
          },
        )}
      </tbody>
    </table>
  );
}

function AccessRow({
  address,
  isAdmin,
  isMinter,
  isRedeemer,
}: AccessRowProperties) {
  const [tmpIsRedeemer, setTmpIsRedeemer] = useState(isRedeemer);
  const [tmpIsMinter, setTmpIsMinter] = useState(isMinter);
  const [tmpIsAdmin, setTmpIsAdmin] = useState(isAdmin);

  const { write: grantRole } = useTokenBoxGrantRole();

  const { write: revokeRole } = useTokenBoxRevokeRole();

  return (
    <tr className="m-0 border-t border-slate-200 p-0 even:bg-slate-100 dark:border-slate-700 dark:even:bg-slate-800">
      <td className="border border-slate-200 px-4 py-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
        {address}
      </td>
      <td className="border border-slate-200 px-4 py-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
        <div className="flex flex-col items-center">
          <div className="flex flex-row items-center">
            <label
              htmlFor="isAdmin"
              className="mr-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Admin
            </label>
            <input
              id="isAdmin"
              className="mr-5"
              checked={tmpIsAdmin}
              type={"checkbox"}
              onClick={() => setTmpIsAdmin(!tmpIsAdmin)}
            />
            <button
              onClick={() => {
                if (isAdmin === tmpIsAdmin) {
                  return;
                }
                if (tmpIsAdmin) {
                  grantRole({ args: [ADMIN_ROLE, address] });
                  return;
                }
                revokeRole({ args: [ADMIN_ROLE, address] });
              }}
            >
              Update
            </button>
          </div>
        </div>
      </td>
      <td className="border border-slate-200 px-4 py-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
        <label
          htmlFor="isMinter"
          className="mr-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Minter
        </label>
        <input
          id="isMinter"
          className="mr-5"
          checked={tmpIsMinter}
          type={"checkbox"}
          onClick={() => setTmpIsMinter(!tmpIsMinter)}
        />
        <button
          onClick={() => {
            if (isMinter === tmpIsMinter) {
              return;
            }
            if (tmpIsMinter) {
              grantRole({ args: [MINTER_ROLE, address] });
              return;
            }
            revokeRole({ args: [MINTER_ROLE, address] });
          }}
        >
          Update
        </button>
      </td>
      <td className="border border-slate-200 px-4 py-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
        <label
          htmlFor="isRedeemer"
          className="mr-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Redeemer
        </label>
        <input
          id="isRedeemer"
          className="mr-5"
          checked={tmpIsRedeemer}
          type={"checkbox"}
          onClick={() => setTmpIsRedeemer(!tmpIsRedeemer)}
        />
        <button
          onClick={() => {
            if (isRedeemer === tmpIsRedeemer) {
              return;
            }
            if (tmpIsRedeemer) {
              grantRole({ args: [REDEEMER_ROLE, address] });
              return;
            }
            revokeRole({ args: [REDEEMER_ROLE, address] });
          }}
        >
          Update
        </button>
      </td>
    </tr>
  );
}
