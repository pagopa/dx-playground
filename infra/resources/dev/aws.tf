module "core_values" {
  source  = "pagopa-dx/aws-core-values-exporter/aws"
  version = "~> 0.0"

  core_state = local.core_state
}

module "opennext" {
  source = "github.com/pagopa/dx//infra/modules/aws_open_next?ref=feature/opennext-module"

  environment = merge(local.aws_environment, { app_name = "opennext" })
  vpc = {
    id              = module.core_values.vpc_id
    private_subnets = module.core_values.private_subnet_ids
  }

  tags = local.tags
}
