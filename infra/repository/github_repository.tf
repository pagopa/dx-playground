module "repository" {
  source  = "pagopa-dx/github-environment-bootstrap/github"
  version = "~> 0"

  repository = {
    name                = "dx-playground"
    description         = "A playground for the DevEx team"
    topics              = ["dx", "typescript"]
    default_branch_name = "main"
    jira_boards_ids     = local.jira_board_ids
  }
}
