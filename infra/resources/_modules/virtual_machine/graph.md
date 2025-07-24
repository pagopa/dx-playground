```mermaid
graph LR
  subgraph Compute
    vm["Linux Virtual Machine"]
  end
  subgraph Networking
    nic["Network Interface"]
  end
  vm --> nic
```
