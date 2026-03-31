variable "resource_group_name" {
  type = string
}

variable "location" {
  type    = string
  default = "italynorth"
}

variable "tags" {
  type    = map(string)
  default = {}
}

variable "subnet_id" {
  type = string
}

variable "admin" {
  type = object({
    username = string
    password = string
  })
}

variable "name" {
  type = string
}

variable "prefix" {
  type = string
}

variable "suffix" {
  type = string
}

variable "custom_data" {
  type    = string
  default = null
}

variable "sku" {
  type    = string
  default = "Standard_B1s"

}