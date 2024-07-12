# DynamoDB Table
resource "aws_dynamodb_table" "main" {
  name           = "to-do-table-${var.env_name}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "listId"

  attribute {
    name = "listId"
    type = "S"
  }

  tags = merge(
    local.common_tags,
    {
      Name = "to-do-table-${var.env_name}"
    }
  )
}
