variable "tags" {
  type        = map(any)
  description = "Resource tags"
}

variable "resource_group_name" {
  type        = string
  description = "Resource group name"
}

variable "environment" {
  type = object({
    prefix          = string
    env_short       = string
    location        = string
    domain          = optional(string)
    app_name        = string
    instance_number = string
  })
  description = "Environment configuration object for resource naming"
}

variable "subnet_pep_id" {
  type = string
}

variable "virtual_network" {
  type = object({
    name                = string
    resource_group_name = string
    id                  = string
  })
}
