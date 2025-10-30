```mermaid
graph LR
  subgraph Compute
    VM["Linux Virtual Machine"]
  end
  subgraph Networking
    NIC["Network Interface"]
  end
  VM --> NIC
```
