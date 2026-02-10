variable "environment" {
  description = "Environment configuration for the legacy resources"
  type        = object({
    prefix          = string
    env_short       = string
    location        = string
    domain          = string
    instance_number = string
  })
}

variable "tags" {
  description = "Tags to be applied to all resources"
  type        = map(string)
}
