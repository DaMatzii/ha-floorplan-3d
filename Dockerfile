# ---- Build frontend ----
FROM node:20-alpine AS frontend
WORKDIR /client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

# ---- Build Go server ----
FROM golang:1.23-alpine AS backend
WORKDIR /backend
COPY backend/ .
RUN go build -o /goapp

# ---- Final HA runtime image ----
FROM alpine:3.20
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=backend /goapp .
COPY --from=frontend /client/build ./client/build
ENV PORT=8099
EXPOSE 8099
CMD ["/app/goapp"]
