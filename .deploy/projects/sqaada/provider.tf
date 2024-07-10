terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
    }
  }

  backend "local" {
    path = "terraform.tfstate"
  }
}

# Provider
provider "aws" {
  region = "eu-west-1"
}

provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"
}