package handlers

import (
	"backend/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

func InitApp() gin.HandlerFunc {
	return func(c *gin.Context) {
		file, err := c.FormFile("file")
		if err != nil {
			c.String(http.StatusBadRequest, "No file is received: %v", err)
			return
		}

		if err := services.HandleUpload(file); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return

		}

		c.JSON(http.StatusOK, gin.H{
			"yes": true,
		})
	}
}
