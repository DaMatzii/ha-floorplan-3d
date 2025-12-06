package main

import (
	"backend/config"
	"backend/routes"
	"github.com/gin-gonic/gin"
	"log"

	"fmt"
	"github.com/gin-gonic/contrib/static"
	"gopkg.in/yaml.v3"
	"io"
	"net/http"

	"github.com/fsnotify/fsnotify"
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

const sseDataFormat = "data: %s\n\n"

func SSEHandler(c *gin.Context, watcher *fsnotify.Watcher) {
	fmt.Println("REQUEST IN")
	c.Writer.Header().Set("Content-Type", "text/event-stream")
	c.Writer.Header().Set("Cache-Control", "no-cache")
	c.Writer.Header().Set("Connection", "keep-alive")
	c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

	flusher, ok := c.Writer.(http.Flusher)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Streaming not supported"})
		return
	}

	for {
		select {
		case <-c.Request.Context().Done():
			return

		case event, ok := <-watcher.Events:
			if !ok {
				return
			}
			if event.Has(fsnotify.Create) || event.Has(fsnotify.Write) {
				fmt.Println("EVENT")

				fmt.Fprintf(c.Writer, "data: %s\n\n", event.Name)
				flusher.Flush()

			}
		}
	}

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

	r := gin.New()

	if viper.GetString("MODE") == "prod" {
		fmt.Println("PROD")
		config.AppConfig.ConfigPath = "/homeassistant/floorplan/"

		r.Use(static.Serve("/", static.LocalFile("./client/dist", true)))
	} else {
		fmt.Println("DEV")
		config.AppConfig.ConfigPath = "./pro2/"
		r.NoRoute(func(c *gin.Context) {
			proxyURL := "http://192.168.22.21:5173" + c.Request.RequestURI

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

	r.Use(static.Serve("/config", static.LocalFile(config.AppConfig.ConfigPath, true)))

	routes.RegisterRoutes(r)

	r.GET("/api/configuration", func(c *gin.Context) {
		c.JSON(http.StatusOK, viper.AllSettings())

	})

	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Fatal(err)
	}

	err = watcher.Add(config.AppConfig.ConfigPath)
	if err != nil {
		fmt.Println("WATCH ERROR")
		watcher.Close()
	}

	defer watcher.Close()

	r.GET("/api/events", func(c *gin.Context) {
		SSEHandler(c, watcher)
	})

	r.GET("/api/ui/:ui", func(c *gin.Context) {
		name := c.Param("ui")
		ui := loadUI(name + ".yml")

		c.JSON(http.StatusOK, ui)
	})

	// Start listening for events.

	r.Run(":8099")

}
