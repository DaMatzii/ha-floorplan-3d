package routes

import (
	"backend/handlers"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		api.GET("/home", handlers.GetHome())
		api.GET("/building/:id", handlers.GetBuilding())
	}
}
