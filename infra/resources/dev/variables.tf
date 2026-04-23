variable "image_tag" {
  description = "Image tag (e.g., git SHA)"
  type        = string
}

variable "description" {
  description = "Description of the deployment"
  type        = string
}

variable "image_name" {
  description = "Full container image name with registry and tag"
  type        = string
}

variable "extra_tags" {
  description = "Additional tags in comma-separated key=value format"
  type        = string
}

variable "json" {
  description = "JSON configuration object"
  type        = string
}

variable "command_literal" {
  description = "Command literal with shell variables"
  type        = string
}

variable "equals" {
  description = "Value containing equals signs"
  type        = string
}

variable "empty" {
  description = "Empty value placeholder"
  type        = string
  default     = ""
}

output "image_tag" {
  description = "Image tag value"
  value       = var.image_tag
}

output "description" {
  description = "Description value"
  value       = var.description
}

output "image_name" {
  description = "Image name value"
  value       = var.image_name
}

output "extra_tags" {
  description = "Extra tags value"
  value       = var.extra_tags
}

output "json" {
  description = "JSON value"
  value       = var.json
}

output "command_literal" {
  description = "Command literal value"
  value       = var.command_literal
}

output "equals" {
  description = "Equals value"
  value       = var.equals
}

output "empty" {
  description = "Empty value"
  value       = var.empty
}
