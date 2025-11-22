package handlers

import (
	"backend/services"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
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
		idString := c.Param("id")
		id, err := strconv.Atoi(idString)

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "id must be a int",
			})
			return
		}
		home, err := services.GetBuilding(id)
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
