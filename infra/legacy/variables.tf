variable "environment" {
  description = "Environment configuration for the legacy resources"
  type = object({
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

variable "image_tag" {
  description = "Tag of the image to be used for the virtual machine"
  type        = string
}

variable "image_repository" {
  description = "Repository of the image to be used for the virtual machine"
  type        = string
}
