output "container_app_job" {
  description = "The id of the container app job"
  value = {
    id                  = module.container_app_job_self_hosted_runner.container_app_job.id
    name                = module.container_app_job_self_hosted_runner.container_app_job.name
    resource_group_name = module.container_app_job_self_hosted_runner.container_app_job.resource_group_name
  }
}
