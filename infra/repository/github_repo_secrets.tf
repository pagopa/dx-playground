resource "github_actions_secret" "repo_secrets" {
  for_each = local.repo_secrets

  repository      = module.repository.name
  secret_name     = each.key
  plaintext_value = each.value
}
