// Cross-domain proxy prefix
// const API_PROXY_PREFIX='/api'
// const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
const wallet = process.env.Network === 'mainnet' ? 'https://mi.arepa.digital' : 'http://localhost:8000'

export function configNear(keyStores) {
  const network = process.env.Network
  const enviroment = false
  const NETWORK = (enviroment) ? network : network;
  switch (NETWORK) {
    case "mainnet":
      return {
        networkId: "mainnet",
        keyStore: keyStores,
        nodeUrl: "https://rpc.mainnet.near.org",
        // nodeUrl: "https://rpc.mainnet.pagoda.co",
        walletUrl: wallet,
        helperUrl: "https://helper.mainnet.near.org",
        explorerUrl: "https://explorer.mainnet.near.org",
      };
    case "testnet":
      return {
        networkId: "testnet",
        keyStore: keyStores,
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: wallet,
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };
    default:
      throw new Error(`Unconfigured environment '${NETWORK}'`);
  }
}


/* module.exports = {
  CONFIG,
}; */
