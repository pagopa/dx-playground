```mermaid
graph LR
  subgraph Compute
    LinuxVirtualMachine["Linux Virtual Machine"]
  end
  subgraph Networking
    NetworkInterface["Network Interface"]
  end

  LinuxVirtualMachine --> NetworkInterface
```
