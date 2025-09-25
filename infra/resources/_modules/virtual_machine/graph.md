```mermaid
graph LR
  subgraph Compute
    LinuxVM["Linux Virtual Machine"]
  end
  subgraph Networking
    NetworkInterface["Network Interface"]
  end
  LinuxVM --> NetworkInterface
```
