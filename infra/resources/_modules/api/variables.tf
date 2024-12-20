variable "resource_group_name" {
  description = "Resource group name where the API Management instance is deployed"
  type        = string
}

variable "apim_name" {
  description = "API Management instance name"
  type        = string
}

variable "api" {
  description = "API definition"
  type = object({
    name        = string
    path        = string
    description = string
    openapi     = string
  })
}

variable "backend" {
  description = "Backend API configuration"
  type = object({
    name = string
    url  = string
  })
}
