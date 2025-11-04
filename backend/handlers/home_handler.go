package handlers

import (
	"backend/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetHome() gin.HandlerFunc {
	return func(c *gin.Context) {
		home, err := services.GetHome()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, home)
	}
}
func GetBuilding() gin.HandlerFunc {
	return func(c *gin.Context) {
		home, err := services.GetBuilding("main")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		// c.JSON(http.StatusOK, gin.H{
		// "floorplan": string(data),
		// "building":  string(build),
		// })

		c.JSON(http.StatusOK, home)
	}
}
