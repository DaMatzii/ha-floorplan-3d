package routes

import (
	"backend/handlers"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		api.POST("/upload/sh3d", handlers.InitApp())
		api.GET("/furniture/:id", handlers.GetFurniturePiece())
	}
}
