package handlers

import (
	"backend/config"
	"bufio"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"os"
	"strings"
)

type AppConfigProperties map[string]string

func readPropertiesFile(filename string) (AppConfigProperties, error) {
	config := AppConfigProperties{}

	if len(filename) == 0 {
		return config, nil
	}
	file, err := os.Open(filename)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		if equal := strings.Index(line, "="); equal >= 0 {
			if key := strings.TrimSpace(line[:equal]); len(key) > 0 {
				value := ""
				if len(line) > equal {
					value = strings.TrimSpace(line[equal+1:])
				}
				config[key] = value
			}
		}
	}

	if err := scanner.Err(); err != nil {
		fmt.Println(err)
		return nil, err
	}

	return config, nil
}

func getPiece(props AppConfigProperties, id string) AppConfigProperties {
	var piece map[string]string = AppConfigProperties{}
	for k, v := range props {
		if v == id {

			index := strings.Split(k, "#")

			if len(index) < 2 {
				continue
			}

			for key2, value2 := range props {
				split := strings.Split(key2, "#")

				if len(split) < 2 {
					continue
				}

				if split[1] == index[1] {
					piece[split[0]] = value2
				}
			}

		}

	}

	return piece

}

func GetFurniturePiece() gin.HandlerFunc {
	return func(c *gin.Context) {
		props, err := readPropertiesFile(config.AppConfig.Resources + "DefaultFurnitureCatalog.properties")

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		idString := c.Param("id")

		piece := getPiece(props, strings.Replace(idString, "-", "#", 1))

		c.JSON(http.StatusOK, piece)
	}
}
