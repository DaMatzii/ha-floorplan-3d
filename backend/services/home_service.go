package services

import (
	"backend/config"
	"backend/models"
	"errors"
	"gopkg.in/yaml.v3"
	"os"
)

func GetHome() (*models.Home, error) {
	yamlData, err := os.ReadFile(config.ConfigPath + "home.yml")
	if err != nil {
		return nil, errors.New("test")
	}

	var obj models.Home
	if err := yaml.Unmarshal(yamlData, &obj); err != nil {
		return nil, errors.New("test")
	}

	return &obj, nil
}

func GetBuilding(building string) (*models.Building, error) {
	yamlData, err := os.ReadFile(config.ConfigPath + "main" + ".yml")
	if err != nil {
		return nil, errors.New("tes1t")
	}

	var obj models.Building
	if err := yaml.Unmarshal(yamlData, &obj); err != nil {
		return nil, errors.New("tes2t")
	}

	data, err := os.ReadFile(config.ConfigPath + obj.Floorplan_path)
	if err != nil {
		return nil, errors.New("tes3t")
	}

	obj.Floorplan = string(data)

	d, err := yaml.Marshal(&obj.Rooms)
	if err != nil {
		panic(err)
	}
	obj.Raw_Rooms = string(d)

	return &obj, nil
}
