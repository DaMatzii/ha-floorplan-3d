package handlers

import (
	"backend/config"
	"fmt"
	"github.com/fsnotify/fsnotify"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

func SSEHandler(c *gin.Context) {
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

	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Fatal(err)
		c.Status(http.StatusInternalServerError)
		return
	}

	err = watcher.Add(config.AppConfig.ExternalConfig)
	if err != nil {
		log.Fatal("WATCH ERROR")
		watcher.Close()
		c.Status(http.StatusInternalServerError)
		return
	}

	defer watcher.Close()

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
