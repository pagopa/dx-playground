output "federated_ci_identity" {
  value = {
    name                = module.federated_identities.federated_ci_identity.name
    resource_group_name = module.federated_identities.federated_ci_identity.resource_group_name
  }
}

output "federated_cd_identity" {
  value = {
    name                = module.federated_identities.federated_cd_identity.name
    resource_group_name = module.federated_identities.federated_cd_identity.resource_group_name
  }
}

output "federated_app_cd_identity" {
  value = {
    name                = module.backend_federated_identities.federated_cd_identity.name
    resource_group_name = module.backend_federated_identities.federated_cd_identity.resource_group_name
  }
}
