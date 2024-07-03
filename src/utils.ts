import {
  LitNodeClient,
} from "@lit-protocol/lit-node-client";
import { AuthCallbackParams, LitResourceAbilityRequest } from "@lit-protocol/types";
import {
  createSiweMessageWithRecaps,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import { ethers } from "ethers";
import * as crypto from 'crypto';
(global as any).crypto = crypto;

const ONE_WEEK_FROM_NOW = new Date(
  Date.now() + 1000 * 60 * 60 * 24 * 7
).toISOString();

export const genProvider = () => {
  return new ethers.providers.JsonRpcProvider(
    "https://lit-protocol.calderachain.xyz/replica-http"
  );
};

export const genWallet = () => {
  // known private key for testing
  // replace with your own key
  return new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    genProvider()
  );
};

export const genAuthSig = async (
  wallet: ethers.Wallet,
  client: LitNodeClient,
  uri: string,
  resources: LitResourceAbilityRequest[]
) => {
  let blockHash = await client.getLatestBlockhash();
  const message = await createSiweMessageWithRecaps({
    walletAddress: wallet.address,
    nonce: blockHash,
    litNodeClient: client,
    resources,
    expiration: ONE_WEEK_FROM_NOW,
    uri,
  });
  const authSig = await generateAuthSig({
    signer: wallet,
    toSign: message,
    address: wallet.address,
  });

  return authSig;
};

export const genSession = async (
  wallet: ethers.Wallet,
  client: LitNodeClient,
  resources: LitResourceAbilityRequest[]
) => {
  let sessionSigs = await client.getSessionSigs({
    chain: "ethereum",
    resourceAbilityRequests: resources,
    authNeededCallback: async (params: AuthCallbackParams) => {
      console.log("resourceAbilityRequests:", params.resources);

      if (!params.expiration) {
        throw new Error("expiration is required");
      }

      if (!params.resources) {
        throw new Error("resourceAbilityRequests is required");
      }

      if (!params.uri) {
        throw new Error("uri is required");
      }

      // generate the authSig for the inner signature of the session
      // we need capabilities to assure that only one api key may be decrypted
      const authSig = genAuthSig(
        wallet,
        client,
        params.uri,
        params.resourceAbilityRequests ?? []
      );
      return authSig;
    },
  });

  return sessionSigs;
};
