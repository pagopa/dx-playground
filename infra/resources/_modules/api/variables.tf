variable "resource_group_name" {
  description = "Resource group name where the API Management instance is deployed"
  type        = string
}

variable "apim_name" {
  description = "API Management instance name"
  type        = string
}

variable "entra_id_app_client_id" {
  description = "The Entra ID Application Client ID used for backend authentication"
  type        = string
}

variable "api" {
  description = "API definition"
  type = object({
    name         = string
    display_name = string
    path         = string
    description  = string
    openapi      = string
  })
}

variable "backend" {
  description = "Backend API configuration"
  type = object({
    name               = string
    url                = string
    target_resource_id = string
  })
}
