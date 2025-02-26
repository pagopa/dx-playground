variable "project" {
  type        = string
  description = "Usually is the concatenation of prefix and env_short"
}

variable "location" {
  type        = string
  description = "Azure region"
}

variable "domain" {
  type        = string
  description = "Domain name of the application"
}

variable "tags" {
  type        = map(any)
  description = "Resource tags"
}

variable "resource_group_name" {
  type        = string
  description = "Resource group name for the Function App services"
}

variable "key_vault_id" {
  type        = string
  sensitive   = true
  description = "The Id of the key vault where the AI connection String is going to be created"
}
