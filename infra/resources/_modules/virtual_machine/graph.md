```mermaid
graph LR
  subgraph Compute
    LinuxVM["Linux Virtual Machine"]
  end
  subgraph Networking
    NIC["Network Interface"]
  end
  LinuxVM --> NIC
```
