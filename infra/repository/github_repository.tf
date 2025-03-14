resource "github_repository" "this" {
  name        = "dx-playground"
  description = "A playground for the DevEx team"

  visibility = "public"

  allow_auto_merge            = true
  allow_rebase_merge          = false
  allow_merge_commit          = false
  allow_squash_merge          = true
  squash_merge_commit_title   = "PR_TITLE"
  squash_merge_commit_message = "PR_BODY"

  delete_branch_on_merge = true

  has_projects    = false
  has_wiki        = false
  has_discussions = false
  has_issues      = false
  has_downloads   = false

  topics = ["dx", "typescript"]

  vulnerability_alerts = true

  archive_on_destroy = true
}

resource "github_repository_autolink_reference" "jira_links" {
  for_each            = toset(local.jira_board_ids)
  repository          = github_repository.this.name
  key_prefix          = "${each.value}-"
  target_url_template = "https://pagopa.atlassian.net/browse/${each.value}-<num>"
}
