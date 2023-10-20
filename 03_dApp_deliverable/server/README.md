## Renewable Energy Certificates server

This sub-folder contains the codebase for the server-side logic of the Token Box application.

## Development

To ease development, a dedicated `docker-compose.yml` was created. This will however require developers to have both 
`docker` and `docker-compose` installed on their machine.

To start developing you will first need to deploy a new instance of TokenBox on your localhost.

Once the contract deployed, update the environment variables `TOKEN_BOX_ADDRESS` in the `.env`
file.

Once this is done, start the Postgres container:
```shell
docker-compose up 
```

Migrate Prisma schema:
```shell
npx prisma migrate dev --name init
```

Then start the GraphQL server: 
```shell
npm run dev
```

Once the start up process is complete, you should be able to access the GraphQL interface at http://localhost:6000/graphql

## Environment variable

For the server to be able to start up, a few environment variables have to be set:
- `PORT`: Port through which the GraphQL server will be accessible.
- `NODE_ENV`: Node environment that the server is booting up on.
- `DATABASE_URL`: Database URL that the server will use to store data.
- `ETH_HTTP_URI`: Public Ethereum node HTTP access point.
- `TOKEN_BOX_ADDRESS`: Address where the TokenBox contract is deployed.