package main

import (
	"backend/routes"
	"github.com/gin-gonic/gin"

	"github.com/gin-gonic/contrib/static"
)

func main() {
	r := gin.Default()
	r.Use(static.Serve("/", static.LocalFile("../client/dist", true)))

	routes.RegisterRoutes(r)

	r.Run(":8080")
}
