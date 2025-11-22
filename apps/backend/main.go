package main

import (
	"backend/config"
	"backend/routes"
	"github.com/gin-gonic/gin"

	"fmt"
	"github.com/gin-gonic/contrib/static"
	"gopkg.in/yaml.v3"
	"io"
	"net/http"
	// "net/http/httputil"
	// "net/url"
	"os"
	// "strings"
	"github.com/spf13/viper"
)

func loadUI(path string) any {
	yamlData, err := os.ReadFile(config.AppConfig.ConfigPath + path)
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

	viper.SetConfigName("config")
	viper.AddConfigPath("./app-config/")
	viper.SafeWriteConfigAs("./app-config/config.json")

	viper.SetDefault("configured", false)
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			fmt.Println("No config file found. Using defaults.")
		} else {
			panic(fmt.Errorf("fatal error reading config file: %w", err))
		}
	}

	err := viper.Unmarshal(&config.AppConfig)
	if err != nil {
		fmt.Println("fuck up")
	}

	r := gin.Default()

	if viper.GetString("MODE") == "prod" {
		fmt.Println("PROD")
		config.AppConfig.ConfigPath = "/homeassistant/floorplan/"

		r.Use(static.Serve("/", static.LocalFile("./client/dist", true)))
	} else {
		fmt.Println("DEV")
		config.AppConfig.ConfigPath = "./pro2_1/"
		r.NoRoute(func(c *gin.Context) {
			proxyURL := "http://192.168.2.61:5173" + c.Request.RequestURI

			resp, err := http.Get(proxyURL)
			if err != nil {
				c.String(http.StatusBadGateway, "Proxy error: %v", err)
				return
			}
			defer resp.Body.Close()

			for k, v := range resp.Header {
				for _, vv := range v {
					c.Writer.Header().Add(k, vv)
				}
			}
			c.Writer.WriteHeader(resp.StatusCode)
			io.Copy(c.Writer, resp.Body)
		})

	}

	routes.RegisterRoutes(r)

	r.GET("/api/configuration", func(c *gin.Context) {
		c.JSON(http.StatusOK, viper.AllSettings())

	})

	r.GET("/api/ui/:ui", func(c *gin.Context) {
		name := c.Param("ui")
		ui := loadUI(name + ".yml")

		c.JSON(http.StatusOK, ui)
	})

	r.Run(":8099")
}
