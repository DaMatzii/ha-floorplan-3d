package main

import (
	"backend/config"
	"backend/routes"
	"github.com/gin-gonic/gin"

	// "github.com/gin-gonic/contrib/static"
	"gopkg.in/yaml.v3"
	"net/http"
	"os"
)

func loadUI(path string) any {
	yamlData, err := os.ReadFile(config.ConfigPath + path)
	if err != nil {
		return nil
	}

	var obj any
	if err := yaml.Unmarshal(yamlData, &obj); err != nil {
		return nil
	}

	return &obj
}

func main() {
	r := gin.Default()
	// r.Use(static.Serve("/", static.LocalFile("../client/dist", true)))

	routes.RegisterRoutes(r)

	r.GET("/api/ui/:ui", func(c *gin.Context) {
		name := c.Param("ui")
		ui := loadUI(name + ".yml")

		c.JSON(http.StatusOK, ui)
	})

	r.Run(":8080")
}
