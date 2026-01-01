package routes

import (
	"backend/config"
	"backend/handlers"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"io"
	"net/http"
	"path/filepath"
)

func RegisterRoutes(r *gin.Engine) {

	r.Use(static.Serve("/config/", static.LocalFile(config.AppConfig.ExternalConfig, true)))
	r.Use(static.Serve("/resources/", static.LocalFile(config.AppConfig.Resources, true)))

	//Setting up the serving of frontend
	if viper.GetString("MODE") == "prod" {
		r.Use(static.Serve("/assets/", static.LocalFile("/app/client/dist/assets/", true)))
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

	api := r.Group("/api")
	{
		api.POST("/upload/sh3d", handlers.InitApp())
		api.GET("/furniture/:id", handlers.GetFurniturePiece())
		api.GET("/events", func(c *gin.Context) {
			handlers.SSEHandler(c)
		})
		api.GET("/configuration", func(c *gin.Context) {
			c.JSON(http.StatusOK, viper.AllSettings())

		})

	}
}
