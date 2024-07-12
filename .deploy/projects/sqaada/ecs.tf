# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.service_name}-${var.env_name}-cluster"

  tags = merge(
    local.common_tags,
    {
      Name = "${var.service_name}-${var.env_name}-cluster"
    }
  )

}

# ECS Task Definition
resource "aws_ecs_task_definition" "main" {
  family                   = "${var.service_name}-${var.env_name}-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.resource_cpu
  memory                   = var.resource_memory
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([{
    name  = var.service_name
    image = "${aws_ecr_repository.main[0].repository_url}:${var.app_version}"
    portMappings = [{
      containerPort = 8080
      hostPort      = 8080
    }]
    environment = [
      {
        name  = "DYNAMODB_ENDPOINT"
        value = "https://dynamodb.${var.aws_region}.amazonaws.com"
      },
      {
        name  = "AWS_REGION"
        value = var.aws_region
      },
      {
        name  = "DYNAMODB_TABLE_NAME"
        value = aws_dynamodb_table.main.name
      }
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = "/ecs/${var.service_name}-${var.env_name}"
        awslogs-region        = var.aws_region
        awslogs-stream-prefix = "ecs"
      }
    }
  }])

  tags = merge(
    local.common_tags,
    {
      Name = "${var.service_name}-${var.env_name}-task"
    }
  )
}

# ECS Service
resource "aws_ecs_service" "main" {
  name            = "${var.service_name}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.main.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets          = aws_subnet.public[*].id
    assign_public_ip = true
    security_groups  = [aws_security_group.ecs_tasks.id]
  }

  tags = merge(
    local.common_tags,
    {
      Name = "${var.service_name}-${var.env_name}-service"
    }
  )
}

resource "aws_cloudwatch_log_group" "ecs_logs" {
  name              = "/ecs/${var.service_name}-${var.env_name}"
  retention_in_days = 7

  tags = merge(
    local.common_tags,
    {
      Name = "${var.service_name}-${var.env_name}-logs"
    }
  )
}
