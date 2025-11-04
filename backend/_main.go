package main

import (
	"net/http"

	"backend/routes"
	"strconv"

	"encoding/json"
	// "fmt"
	"github.com/clbanning/mxj/v2"
	"github.com/gin-contrib/cors"
	// "github.com/gin-gonic/contrib/static"
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
	Name      string   `yaml:"name"`
	Buildings []string `yaml:"buildings"`
}
type Building struct {
	Title          string `yaml:"title" json:"title"`
	Floorplan_path string `yaml:"floorplan_name" json:"floorplan"`
	Rooms          any    `yaml:"rooms" json:"rooms"`
	Floorplan      any    `json:"floorplan_building"`
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
func loadBuilding(path string) *Building {
	yamlData, err := os.ReadFile("config/" + path)
	if err != nil {
		return nil
	}

	var obj Building
	if err := yaml.Unmarshal(yamlData, &obj); err != nil {
		return nil
	}

	return &obj
}

func stripDashKeys(v interface{}) interface{} {
	switch val := v.(type) {
	case map[string]interface{}:
		newMap := make(map[string]interface{})
		for k, v := range val {
			newKey := k
			if len(k) > 0 && k[0] == '-' {
				newKey = k[1:] // remove leading dash
			}
			newMap[newKey] = stripDashKeys(v)
		}
		return newMap
	case []interface{}:
		for i, elem := range val {
			val[i] = stripDashKeys(elem)
		}
		return val
	default:
		return val
	}
}
func loadUI(path string) any {
	yamlData, err := os.ReadFile("config/" + path)
	if err != nil {
		return nil
	}

	var obj any
	if err := yaml.Unmarshal(yamlData, &obj); err != nil {
		return nil
	}

	return &obj
}
func loadFloorplan(path string) map[string]any {
	data, err := os.ReadFile("config/" + path)
	if err != nil {
		return nil
	}

	mv, err := mxj.NewMapXml(data)
	if err != nil {
		panic(err)
	}

	dd := stripDashKeys(mv.Old())

	// Convert the mxj.Map into a standard Go map[string]any
	jsonData, err := json.Marshal(dd)
	if err != nil {
		panic(err)
	}

	var result map[string]any
	if err := json.Unmarshal(jsonData, &result); err != nil {
		panic(err)
	}

	return result
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
	// router.Use(static.Serve("/", static.LocalFile("../client/dist", true)))

	{

		api := router.Group("api")
		api.GET("/home", func(c *gin.Context) {
			returnConfig("home.yml", c)
		})

		api.GET("/building/:building/", func(c *gin.Context) {
			b := c.Param("building") // get the path parameter
			id, err := strconv.Atoi(b)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
				return
			}
			config := loadConfig("home.yml")
			building := loadBuilding(config.Buildings[id])

			data, err := os.ReadFile("config/" + building.Floorplan_path)
			if err != nil {
				return
			}

			build, er := os.ReadFile("config/" + config.Buildings[id])
			if er != nil {
				return
			}

			c.JSON(http.StatusOK, gin.H{
				"floorplan": string(data),
				"building":  string(build),
			})
		})

		api.GET("/ui/:ui", func(c *gin.Context) {
			name := c.Param("ui")
			ui := loadUI(name + ".yml")

			c.JSON(http.StatusOK, ui)
		})

	}
	router.POST("/wizard/start", routes.WizardStart)

	router.Run(":8080")
}
