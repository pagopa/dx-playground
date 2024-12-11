resource "azurerm_network_interface" "nic" {
  name                = "${var.prefix}-${var.name}-nic-${var.suffix}"
  location            = var.location
  resource_group_name = var.resource_group_name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = var.subnet_id
    private_ip_address_allocation = "Dynamic"
  }

  tags = var.tags
}

resource "azurerm_linux_virtual_machine" "vm" {
  name                            = "${var.prefix}-${var.name}-vm-${var.suffix}"
  location                        = var.location
  resource_group_name             = var.resource_group_name
  size                            = "Standard_B1s"
  admin_username                  = var.admin.username
  admin_password                  = var.admin.password
  disable_password_authentication = false

  network_interface_ids = [
    azurerm_network_interface.nic.id,
  ]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "20.04-LTS"
    version   = "latest"
  }

  custom_data = var.custom_data

  tags = var.tags
}