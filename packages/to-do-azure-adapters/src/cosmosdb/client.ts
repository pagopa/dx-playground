import { CosmosClient, CosmosClientOptions } from "@azure/cosmos";
import { DefaultAzureCredential } from "@azure/identity";

export interface CosmosDBConfig {
  endpoint: string;
}

export const createCosmosClient = (config: CosmosDBConfig): CosmosClient => {
  const aadCredentials = new DefaultAzureCredential();
  const clientOptions: CosmosClientOptions = {
    aadCredentials,
    endpoint: config.endpoint,
  };
  return new CosmosClient(clientOptions);
};
