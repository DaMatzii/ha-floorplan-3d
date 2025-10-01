package routes

import (
	"archive/zip"
	"bytes"
	"fmt"
	"io"
	"net/http"
	"os"

	// "path/filepath"

	"github.com/gin-gonic/gin"
)

func WizardStart(c *gin.Context) {
	fileHeader, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File is required"})
		return
	}

	file, err := fileHeader.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer file.Close()

	buf := new(bytes.Buffer)
	if _, err := io.Copy(buf, file); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file"})
		return
	}

	zipReader, err := zip.NewReader(bytes.NewReader(buf.Bytes()), int64(buf.Len()))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read zip"})
		return
	}

	for _, f := range zipReader.File {
		if f.Name != "Home.xml" {
			continue
		}
		inFile, err := f.Open()
		if err != nil {
			continue
		}

		// Create destination file
		outFile, err := os.OpenFile("Home.xml", os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
		if err != nil {
			inFile.Close()
			continue
		}

		// Copy contents
		if _, err := io.Copy(outFile, inFile); err != nil {
			inFile.Close()
			outFile.Close()
			continue
		}

		inFile.Close()
		outFile.Close()
		fmt.Println("File is good")

		c.JSON(http.StatusOK, gin.H{"message": "File is good", "file": outFile})
		return
	}

	c.JSON(http.StatusBadRequest, gin.H{"message": "Not proper sweethome"})

}
func Test() {

}
