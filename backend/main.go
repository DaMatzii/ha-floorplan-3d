package main

import (
	"net/http"

	"backend/routes"
	"encoding/json"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gopkg.in/yaml.v3"
	"os"
	"time"
)

func returnConfig(path string, c *gin.Context) {
	yamlData, err := os.ReadFile("config/" + path)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "failed to read file", "details": err.Error()})
		return
	}

	var obj interface{}
	if err := yaml.Unmarshal(yamlData, &obj); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid YAML", "details": err.Error()})
		return
	}

	jsonData, err := json.MarshalIndent(obj, "", "  ")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to convert to JSON"})
		return
	}
	c.Data(http.StatusOK, "application/json", jsonData)

}

type AppConfig struct {
	Name      string              `yaml:"name"`
	Buildings []map[string]string `yaml:"buildings"`
}

func loadConfig(path string) *AppConfig {
	yamlData, err := os.ReadFile("config/" + path)
	if err != nil {
		return nil
	}

	var obj AppConfig
	if err := yaml.Unmarshal(yamlData, &obj); err != nil {
		return nil
	}

	return &obj
}
func main() {
	// Create a new Gin router
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://192.168.2.61:5173"}, // React dev server
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	// Define a simple GET route
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello, World!",
		})
	})
	router.GET("/home", func(c *gin.Context) {
		returnConfig("home.yml", c)
	})
	router.GET("/buildings/:building", func(c *gin.Context) {
		// building := c.Param("building") // get the path parameter
		config := loadConfig("home.yml")
		fmt.Println(config.Buildings[0]["main"])
		// c.JSON(http.StatusOK, gin.H{
		// "message":  "Building found",
		// "building": config.buildings[building],
		// })
	})
	router.POST("/wizard/start", routes.WizardStart)

	// Start the server on port 8080
	router.Run(":8080")
}
