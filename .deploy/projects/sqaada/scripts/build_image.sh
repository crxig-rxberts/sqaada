# Login to ECR
aws ecr get-login-password --region ${aws_region} | docker login --username AWS --password-stdin ${ecr_repository_url}

# Navigate to the correct directory
cd ../../..

# Export environment variables for use in the npm script
export ECR_REPOSITORY_URL=${ecr_repository_url}
export IMAGE_TAG=${image_tag}

# Build the Docker image
docker build -t ${ecr_repository_url}:${image_tag} .

# Push the image to ECR
docker push ${ecr_repository_url}:${image_tag}
