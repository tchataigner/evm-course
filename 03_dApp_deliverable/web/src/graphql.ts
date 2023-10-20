import { gql } from "@apollo/client";

export const USERS = gql`
  query Users {
    users {
      address
      createdAt
      id
      isAdmin
      isRedeemer
      isMinter
    }
  }
`;

export const FILTERED_USERS = gql`
  query FilteredUsers($where: FilterUserInput!) {
    filteredUsers(where: $where) {
      address
      isMinter
      isAdmin
      isRedeemer
    }
  }
`;
