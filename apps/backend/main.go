package main

import (
	"backend/config"
	"backend/routes"
	"github.com/gin-gonic/gin"
	"log"
)

func main() {
	log.SetPrefix("TEST APP")
	log.Println("test")
	config.LoadConfig()

	r := gin.Default()

	routes.RegisterRoutes(r)

	r.Run(":8099")

}
