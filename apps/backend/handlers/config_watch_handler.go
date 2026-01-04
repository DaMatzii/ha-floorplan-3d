package handlers

import (
	"backend/config"
	"fmt"
	"github.com/fsnotify/fsnotify"
	"github.com/gin-gonic/gin"
	"io"
	"log"
	"net/http"
)

func SSEHandler(c *gin.Context) {
	fmt.Println("REQUEST IN")
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

	c.Stream(func(w io.Writer) bool {
		select {
		case event, ok := <-watcher.Events:
			if !ok {
				return true
			}
			if event.Has(fsnotify.Create) || event.Has(fsnotify.Write) {
				c.SSEvent("reload", "lol")
			}

		case <-c.Request.Context().Done():
			return true

		}
		return true
	})

}
