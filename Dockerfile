# ---- Build frontend ----
FROM node:latest AS frontend
WORKDIR /client
COPY ./apps/client/package*.json ./

RUN npm i

COPY ./apps/client/ .

RUN npm run build

# ---- Build Go server ----
FROM golang:latest AS backend
WORKDIR /app

# Copy the module files first (better caching + avoids missing mod files)
COPY ./apps/backend/go.mod ./apps/backend/go.sum ./
RUN go mod download

# Now copy the source
COPY ./apps/backend .

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux go build -o /backend-exec

# ---- Final HA runtime image ----
FROM ubuntu:22.04
WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive



RUN apt-get update && \
    apt-get install -y curl unzip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*


RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -

RUN apt-get install -y nodejs 

RUN npm install -g --save obj2gltf

COPY --from=backend /backend-exec /app/backend-exec
# RUN mkdir /homeassistant/floorplan
ENV MODE=prod 
ENV CONFIG_PATH=/testing/config

# COPY ./scripts/downloadAssets.sh /scripts/downloadAssets.sh
# COPY ./temp/download.zip /zips/download.zip
COPY ./scripts/run.sh /run.sh
RUN chmod +x /run.sh
# COPY --from=backend /app/pro2 /homeassistant/floorplan
COPY --from=frontend /client/dist /app/client/dist

EXPOSE 8099
ENTRYPOINT ["/run.sh"]
