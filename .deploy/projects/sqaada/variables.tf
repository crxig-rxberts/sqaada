################################################
# TF Vars
variable "app_version" { type = string }
variable "aws_region" { type = string }
variable "env_name" { type = string }
variable "service_name" { type = string }



################################################
# ECS Vars
variable "resource_cpu" { type = string }
variable "resource_memory" { type = string }
#variable "service_count" { type = string }



################################################
# Local Vars
locals {
  bool_ecr_repo_exists = try(data.aws_ecr_repository.existing_repo[0].arn, "") != ""
  bool_create_new_repo = !local.bool_ecr_repo_exists

  common_tags = {
    Environment = var.env_name
    Service     = var.service_name
    Version     = var.app_version
    ManagedBy   = "Terraform"
  }
}

################################################
# Data
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_ecr_repository" "existing_repo" {
  count = try(data.aws_ecr_repository.existing_repo[0].arn, "") != "" ? 1 : 0
  name = "${var.service_name}-${var.env_name}-repo"
}