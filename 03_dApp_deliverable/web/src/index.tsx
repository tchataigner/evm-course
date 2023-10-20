import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

/****************************************
 * Wagmi configuration and setup
 ****************************************/
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { localhost } from "viem/chains";

import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

// Create our client connect to our RPC url.
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [localhost],
  [publicProvider()],
);

// Create our config to inject in the React component.
const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [new MetaMaskConnector({ chains })],
});

export const apolloClient = new ApolloClient({
  uri: process.env.REACT_APP_BACK_URL,
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <WagmiConfig config={config}>
        <App />
      </WagmiConfig>
    </ApolloProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
