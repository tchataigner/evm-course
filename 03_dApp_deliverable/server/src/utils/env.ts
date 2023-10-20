export const getPortEnv = (): string => {
    const env = process.env.PORT;
    if (env === undefined) {
        throw new Error('PORT environment variable is not set');
    }

    return env;
};

export const getTokenBoxAddressEnv = (): string => {
    const env = process.env.TOKEN_BOX_ADDRESS;
    if (env === undefined) {
        throw new Error('TOKEN_BOX_ADDRESS environment variable is not set');
    }

    return env;
};

export const getEthHttpUriEnv = (): string => {
    const env = process.env.ETH_HTTP_URI;
    if (env === undefined) {
        throw new Error('ETH_HTTP_URI environment variable is not set');
    }

    return env;
};

export const loadEnv = (): void => {

    getPortEnv();
    getTokenBoxAddressEnv();
    getEthHttpUriEnv();
};
