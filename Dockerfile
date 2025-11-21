# ---- Build frontend ----
FROM node:20-alpine AS frontend
WORKDIR /client
COPY ./client/package*.json ./

RUN npm ci

COPY ./client .

RUN npm run build

# ---- Build Go server ----
FROM golang:latest AS backend
WORKDIR /app

# Copy the module files first (better caching + avoids missing mod files)
COPY ./backend/go.mod ./backend/go.sum ./
RUN go mod download

# Now copy the source
COPY ./backend .

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux go build -o /backend-exec

# ---- Final HA runtime image ----
FROM alpine:3.20
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=backend /backend-exec /backend-exec
# RUN mkdir /homeassistant/floorplan
ENV MODE=prod 
COPY --from=backend /app/pro /homeassistant/floorplan
COPY --from=frontend /client/dist ./client/dist
EXPOSE 8099
ENTRYPOINT ["/backend-exec"]
