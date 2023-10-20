import { DateTimeResolver, DateTimeTypeDefinition } from 'graphql-scalars';
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { User, Event, Prisma } from '@prisma/client';
import { GraphQLContext } from '../context';

const typeDefinitions = /* GraphQL */ `
    ${DateTimeTypeDefinition}

    type Query {
        users: [User!]!
        filteredUsers(where: FilterUserInput!): [User!]!
    }

    type Event {
        id: ID!
        eventType: String!
        data: EventData!
        blockHeight: String!
        transactionHash: String!
        logIndex: Int!
        createdAt: DateTime!
    }

    union EventData = RoleEventData

    type RoleEventData {
        role: String!
        sender: String!
        account: String!
    }

    type User {
        id: ID!
        address: String!
        isAdmin: Boolean!
        isMinter: Boolean!
        isRedeemer: Boolean!
        createdAt: DateTime!
    }

    input FilterUserInput {
        address: String
    }
`;

const resolvers = {
    DateTime: DateTimeResolver,
    EventData: {
        __resolveType(obj: unknown) {
            return 'RoleEventData';
        },
    },
    Event: {
        id: (parent: Event) => parent.id,
        eventType: (parent: Event) => parent.eventType,
        data: (parent: Event) => parent.data,
        blockHeight: (parent: Event) => parent.blockHeight,
        transactionHash: (parent: Event) => parent.transactionHash,
        logIndex: (parent: Event) => parent.logIndex,
        createdAt: (parent: Event) => parent.createdAt,
    },
    User: {
        id: (parent: User) => parent.id,
        address: (parent: User) => parent.address,
        isAdmin: (parent: User) => parent.isAdmin,
        isMinter: (parent: User) => parent.isMinter,
        isRedeemer: (parent: User) => parent.isRedeemer,
        createdAt: (parent: User) => parent.createdAt,
    },
    Query: {
        async users(parent: unknown, args: unknown, context: GraphQLContext): Promise<Array<User>> {
            return context.prisma.user.findMany({
                where: {},
            });
        },
        async filteredUsers(
            parent: unknown,
            { where: { address } }: { where: { address: string | null } },
            context: GraphQLContext,
        ): Promise<Array<User>> {
            const findFilter: Prisma.UserFindManyArgs = {
                where: {
                    address: address || undefined,
                },
            };

            return context.prisma.user.findMany(findFilter);
        },
    },
};

export const schema = makeExecutableSchema({
    resolvers: [resolvers],
    typeDefs: [typeDefinitions],
});
