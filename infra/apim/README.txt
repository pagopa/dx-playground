APIM backward-compatibility test
==============================

Applied baseline: pagopa-dx/azure-api-management/azurerm 4.2.4.
Upgrade: pagopa/dx PR 1923, commit
72d82774cdec98cb7ff860e6bb340b0cccb18b13.

Subscription: DEV-DEVEX (35e6e3b2-4388-470e-a1b9-ad3bc34326d1).
Resource group: dx-d-itn-apim1923-compat-rg-01.
Use case: development (Developer_1), Italy North.
Terraform state: local terraform.tfstate; never commit or publish it.
The baseline resources remain deployed and incur charges.

The published baseline was applied successfully. A refreshed baseline plan
confirmed no changes before upgrading the configuration. The ignored baseline/
directory preserves the applied configuration, provider lock file and state.

Verified upgrade result: 0 to add, 0 to change, 0 to destroy.
All 13 managed resources are no-op, with five state-address moves:
- Caller-managed APIM subnet into module.apim.
- Caller-managed DX CIDR allocation into module.apim.
- Three module DNS A records lose their previous [0] count index.

The subnet ID, name and 10.192.0.0/24 address range remain unchanged.
The NSG association and APIM instance are also no-op. Both the allocated
CIDR and subnet must migrate: moving the subnet alone leaves the module's
new allocator free to choose a different range.

No import is necessary here because both resources already exist in this
local Terraform state. If a caller previously used a literal subnet CIDR
without a dx_available_subnet_cidr resource, that allocator cannot be moved.
The DX provider documents importing it using the existing subnet's full
Azure resource ID; that alternative has not been exercised by this test.

The PR's default hostname settings initially proposed one APIM update:
proxy.default_ssl_binding true -> false. Setting
hostname_configuration.proxy.use_resource_name_as_default = true preserves
the live baseline behavior and eliminates this update. The original plan
is retained as upgrade-defaults.tfplan and upgrade-defaults.tfplan.txt.

Review the final upgrade.tfplan.txt or run:
  terraform show -no-color upgrade.tfplan

The upgrade has NOT been applied. The live local state still has the
baseline addresses; the proposed moves exist only in the saved plan.
Do not apply or destroy without separate authorization.

This verifies the development use case with module-compatible subnet
naming and /24 sizing, not arbitrary pre-existing subnet names, sizes,
delegations, certificates, StandardV2 or Premium deployments.

State files, backups, logs, JSON plans and binary plans are ignored by Git.
Do not publish full state or machine-readable plans: they may contain secrets.
Azure CLI settings and the active subscription were never changed.
