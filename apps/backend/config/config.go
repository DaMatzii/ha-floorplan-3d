package config

import (
	"backend/models"
	"fmt"
	"github.com/spf13/viper"
)

var AppConfig models.AppConfig

func LoadConfig() {
	viper.AutomaticEnv()

	if viper.GetString("MODE") == "prod" {
		fmt.Println("PROD")
		AppConfig.ExternalConfig = "/config/"
		AppConfig.InternalConfig = "/app/config/"
		AppConfig.Resources = "/app/resources/"

	} else {
		fmt.Println("DEV")
		AppConfig.ExternalConfig = "./new-app-config-system/external/"
		AppConfig.InternalConfig = "./new-app-config-system/internal/"
		AppConfig.Resources = "./new-app-config-system/resources/"
	}

	viper.SetConfigName("config")
	viper.AddConfigPath(AppConfig.InternalConfig)
	viper.SafeWriteConfigAs(AppConfig.InternalConfig + "config.json")

	viper.SetDefault("configured", false)

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			fmt.Println("No config file found. Using defaults.")
		} else {
			panic(fmt.Errorf("fatal error reading config file: %w", err))
		}
	}

	err := viper.Unmarshal(&AppConfig)
	if err != nil {
		fmt.Println("fuck up")
	}

}
