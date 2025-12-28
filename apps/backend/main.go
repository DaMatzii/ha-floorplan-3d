package main

import (
	"backend/config"
	"backend/routes"
	"errors"
	"fmt"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"

	"github.com/fsnotify/fsnotify"
	"github.com/spf13/viper"
	"path/filepath"
)

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

func loadConfig() {
	viper.AutomaticEnv()
	// configDir := viper.GetString("CONFIG_DIR")

	if viper.GetString("MODE") == "prod" {
		fmt.Println("PROD")
		config.AppConfig.ExternalConfig = "/config/"
		config.AppConfig.InternalConfig = "/app/config/"
		config.AppConfig.Resources = "/app/resources/"

	} else {
		fmt.Println("DEV")
		config.AppConfig.ExternalConfig = "./new-app-config-system/external/"
		config.AppConfig.InternalConfig = "./new-app-config-system/internal/"
		config.AppConfig.Resources = "./new-app-config-system/resources/"
	}

	viper.SetConfigName("config")
	viper.AddConfigPath(config.AppConfig.InternalConfig)
	viper.SafeWriteConfigAs(config.AppConfig.InternalConfig + "config.json")

	viper.SetDefault("configured", false)

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

}

func initialize() {
	// if !config.AppConfig.Configured {
	// 	fmt.Println("app is not configured")
	// }
	if _, err := os.Stat(config.AppConfig.Resources + "models"); errors.Is(err, os.ErrNotExist) {
		// fmt.Println("not setup :/()")
		go func() {
			cmd := exec.Command("/bin/sh", "/scripts/downloadAssets.sh")
			fmt.Println(cmd)
		}()
	}

}

// /data/config/internal/ --> App configuration file, like last version is configured etc
// /data/config/external/ --> ALL data that the user is supposed to touch
// /data/resources/ --> all things like .gltfs, home.xml and .properties file
func setup() {

}

func main() {
	loadConfig()
	initialize()

	r := gin.Default()

	r.Use(static.Serve("/config/", static.LocalFile(config.AppConfig.ExternalConfig, true)))
	r.Use(static.Serve("/resources/", static.LocalFile(config.AppConfig.Resources, true)))
	if viper.GetString("MODE") == "prod" {
		r.Use(static.Serve("/assets/", static.LocalFile("/app/client/dist/assets/", true)))
	}

	routes.RegisterRoutes(r)

	r.GET("/api/configuration", func(c *gin.Context) {
		c.JSON(http.StatusOK, viper.AllSettings())

	})

	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Fatal(err)
	}

	err = watcher.Add(config.AppConfig.ExternalConfig)
	if err != nil {
		fmt.Println("WATCH ERROR")
		watcher.Close()
	}

	defer watcher.Close()

	r.GET("/api/events", func(c *gin.Context) {
		SSEHandler(c, watcher)
	})

	if viper.GetString("MODE") == "prod" {
		r.NoRoute(func(c *gin.Context) {
			indexFilePath := filepath.Join("/app/client/dist", "index.html")
			c.File(indexFilePath)
		})
	} else {
		r.NoRoute(func(c *gin.Context) {
			proxyURL := "http://localhost:5173" + c.Request.RequestURI

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

	// Start listening for events.

	r.Run(":8099")

}
