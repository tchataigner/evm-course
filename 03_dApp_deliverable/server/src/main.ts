import { createYoga } from 'graphql-yoga';
import { createServer } from 'http';
import { schema } from './schemas/schema';
import { createContext } from './context';
import { getPortEnv, loadEnv } from './utils/env';
import { searchNewBlock } from './workers';
import { initChainUtils, initRoles } from './utils/web3-utils';
import { constructRolesTable } from './seeds/seed-roles';
import 'dotenv/config';

async function main() {
    // Load environment variable to ensure that they are properly set
    loadEnv();

    const context = createContext();

    // initialize chain utils in database
    await initChainUtils(context.prisma).catch((err: Error) =>
        console.error(`Error while trying to initialize chain utils in DB: ${err.message}`),
    );

    // initialize roles values from on-chain data
    await initRoles().catch((err: Error) =>
        console.error(`Error while trying to initialize Roles globals: ${err.message}`),
    );

    const yoga = createYoga({ schema, context, plugins: [] });
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const server = createServer(yoga);
    server.listen(getPortEnv(), () => {
        console.info(`Server is running on port ${getPortEnv()}`);
    });

    // Seed role table
    await constructRolesTable(context.prisma).catch((err: Error) =>
        console.error(`Error while trying to seed roles table: ${err.message}`),
    );

    searchNewBlock(context.prisma).catch((err: Error) =>
        console.error(`Error while looking for a new block: ${err.message}`),
    );
}

main().catch(console.error);
