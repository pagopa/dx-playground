# DX To-Do - Cosmos DB 429 status code (RU/s)

## Trigger Keywords

`Cosmos RU Consumption alert`, `CosmosDB 429`, `CosmosDB Request Rate Too Large`, `CosmosDB RU/s limit`, `CosmosDB throttling`, `CosmosDB performance degradation`

## Scope

DX To-Do uses a Cosmos DB as its primary data store. When the provisioned Request Units per second (RU/s) limit is reached, Cosmos DB returns 429 status codes, indicating that the request rate is too large. This can lead to increased latency and errors for customers interacting with the application, impacting overall performance and user experience.

---

## Instructions

### Phase 0: Identification of the saturated container

Identify the Cosmos DB collection with high RU/s consumption and 429 errors. Use Azure Monitor metrics or Cosmos DB diagnostics logs to pinpoint the affected collection(s).

### Phase 1: RU/s Adjustment

Increase the maximum RU by 25%.
Do not switch between manual and autoscale modes, stick to the existing one.

### Phase 2: Monitor the impact of the change

AFTER the RU/s adjustement, monitor the Cosmos DB metrics to observe the impact of the RU/s increase. Check for a reduction in 429 errors and improved performance for 90 seconds. If the issue persists, consider further increasing RU/s.
