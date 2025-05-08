resource "github_repository_environment" "github_repository_environment_dev_cd" {
  environment = "infra-dev-cd"
  repository  = module.repository.name

  deployment_branch_policy {
    protected_branches     = false
    custom_branch_policies = true
  }

  reviewers {
    teams = matchkeys(
      data.github_organization_teams.all.teams[*].id,
      data.github_organization_teams.all.teams[*].slug,
      local.cd.reviewers_teams
    )
  }
}

resource "github_actions_environment_secret" "env_dev_cd_secrets" {
  for_each = local.cd.secrets

  repository      = module.repository.name
  environment     = github_repository_environment.github_repository_environment_dev_cd.environment
  secret_name     = each.key
  plaintext_value = each.value
}

resource "github_repository_environment" "app_dev_cd" {
  environment = "app-dev-cd"
  repository  = module.repository.name

  deployment_branch_policy {
    protected_branches     = false
    custom_branch_policies = true
  }
}

resource "github_actions_environment_secret" "app_cd_dev_secrets" {
  for_each = local.app_cd.secrets

  repository      = module.repository.name
  environment     = github_repository_environment.app_dev_cd.environment
  secret_name     = each.key
  plaintext_value = each.value
}
