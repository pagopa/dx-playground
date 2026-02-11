output "image" {
  value = {
    repository = var.image_repository
    tag        = var.image_tag
  }
}
