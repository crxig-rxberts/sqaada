# ECR Repository
resource "aws_ecr_repository" "main" {
  count        = local.bool_create_new_repo ? 1 : 0
  name         = "${var.service_name}-${var.env_name}-repo"
  force_delete = true

  tags = merge(
    local.common_tags,
    {
      Name = "${var.service_name}-repo"
    }
  )
}

data "template_file" "build_script" {
  template = file("${path.module}/scripts/build_image.sh")

  vars = {
    aws_region         = var.aws_region
    ecr_repository_url = aws_ecr_repository.main[0].repository_url
    image_tag          = var.app_version
  }
}

resource "null_resource" "docker_build_push" {
  triggers = {
    ecr_repository_url = aws_ecr_repository.main[0].repository_url
    image_tag          = var.app_version
    build_script       = data.template_file.build_script.rendered
  }

  provisioner "local-exec" {
    command     = data.template_file.build_script.rendered
    interpreter = ["bash", "-c"]
  }

  depends_on = [aws_ecr_repository.main[0]]
}
