package handlers

import (
	"backend/config"
	"fmt"
	"github.com/fsnotify/fsnotify"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"time"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func SSEHandler(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}
	defer conn.Close()

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

	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			conn.WriteMessage(websocket.TextMessage, []byte("timer"))
		case event, ok := <-watcher.Events:
			if !ok {
				return
			}
			fmt.Println("Event")
			if event.Has(fsnotify.Create) || event.Has(fsnotify.Write) {

				conn.WriteMessage(websocket.TextMessage, []byte("reload"))
			}

		}
	}

}
