FROM emscripten/emsdk:3.1.45

WORKDIR /src

# Install additional dependencies that might be needed
RUN apt-get update && apt-get install -y \
    autoconf \
    automake \
    libtool \
    git \
    && rm -rf /var/lib/apt/lists/*

# Configure git to trust the /src directory and submodules
RUN git config --global --add safe.directory /src && \
    git config --global --add safe.directory '*'

# Default command
CMD ["bash"]