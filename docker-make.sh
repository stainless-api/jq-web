#!/usr/bin/env bash
set -e

DOCKER_IMAGE_NAME="jq-emscripten"

# Build Docker image if it doesn't exist
if ! docker image inspect "$DOCKER_IMAGE_NAME" >/dev/null 2>&1; then
    echo "Building Docker image..."
    docker build -t "$DOCKER_IMAGE_NAME" .
fi

# Default to 'all' if no arguments provided
MAKE_ARGS="${@:-all}"

echo "Running: make $MAKE_ARGS"
docker run --rm -v "$(pwd):/src" -w /src "$DOCKER_IMAGE_NAME" make $MAKE_ARGS

echo "Complete!"