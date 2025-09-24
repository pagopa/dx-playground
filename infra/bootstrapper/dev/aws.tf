module "aws_core_values" {
  source  = "pagopa-dx/aws-core-values-exporter/aws"
  version = "~> 0.0"

  core_state = local.core_state
}

module "aws_bootstrap" {
  source  = "pagopa-dx/aws-github-environment-bootstrap/aws"
  version = "~> 0.0"

  environment = local.aws_environment

  repository = {
    owner = "pagopa"
    name  = "dx-playground"
  }

  vpc = {
    id              = module.aws_core_values.vpc_id
    private_subnets = module.aws_core_values.private_subnet_ids
  }

  github_private_runner = {
    personal_access_token = {
      ssm_parameter_name = module.aws_core_values.github_personal_access_token_ssm_parameter_name
    }
    secrets = {}
  }
  oidc_provider_arn = module.aws_core_values.oidc_provider_arn

  tags = local.tags
}
