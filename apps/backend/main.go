package main

import (
	"backend/config"
	"backend/routes"
	"github.com/gin-gonic/gin"
	// "github.com/spf13/viper"
	"log"
)

func AllowOnlyIP(allowed string) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.ClientIP() != allowed {
			c.AbortWithStatus(403)
			return
		}
		c.Next()
	}
}

func main() {
	log.SetPrefix("TEST APP")
	log.Println("test")
	config.LoadConfig()

	r := gin.Default()

	// if viper.GetString("MODE") == "prod" {
	// 	r.Use(AllowOnlyIP("172.30.32.2"))
	// }
	//
	routes.RegisterRoutes(r)

	r.Run(":8099")

}
