package services

import (
	"archive/zip"
	"backend/config"
	"backend/models"
	"bytes"
	"errors"
	"fmt"
	"github.com/spf13/viper"
	"gopkg.in/yaml.v3"
	"io"
	"log"
	"mime/multipart"
	"os"
	"path/filepath"
)

func openUpload(file *multipart.FileHeader) (*zip.Reader, error) {
	f, err := file.Open()
	if err != nil {
		return nil, err
	}
	defer f.Close()

	buf := new(bytes.Buffer)
	if _, err := io.Copy(buf, f); err != nil {
		return nil, err
	}

	zipReader, err := zip.NewReader(bytes.NewReader(buf.Bytes()), int64(buf.Len()))
	if err != nil {
		return nil, err
	}
	return zipReader, nil

}

func findHome(zipReader *zip.Reader) (*zip.File, error) {
	for _, zf := range zipReader.File {
		if zf.Name == "Home.xml" {
			fmt.Println("HOME FOUND!!")
			return zf, nil
			break
		}
	}
	return nil, errors.New("Not home found")

}
func saveHome(zf *zip.File) error {
	rc, err := zf.Open()
	if err != nil {
		return err
	}

	fileBuf := new(bytes.Buffer)
	if _, err := io.Copy(fileBuf, rc); err != nil {
		rc.Close()
		return err
	}

	path := filepath.Join(config.AppConfig.ConfigPath, "home.xml")
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()

	if _, err := f.Write(fileBuf.Bytes()); err != nil {
		return err
	}
	f.Sync()
	rc.Close()

	return nil
}

type SweetHome3DHome struct {
	Home any `xml:"Home"`
}
type Room struct {
	Id   string `yaml:"id"`
	Name string `yaml:"alias"`
}

// save home.xml --> generate home.yml --> generate main building yml that has all rooms and nicks inside --> set app conf inited=true
func HandleUpload(file *multipart.FileHeader) error {
	sh3d, err := openUpload(file)
	if err != nil {
		return fmt.Errorf("failed to open upload: %w", err)
	}

	homeFile, err := findHome(sh3d)
	if err != nil {
		return fmt.Errorf("failed to find home file: %w", err)
	}

	rc, err := homeFile.Open()
	if err != nil {
		return fmt.Errorf("failed to open home file reader: %w", err)
	}

	defer func() {
		if closeErr := rc.Close(); closeErr != nil {
			fmt.Printf("Warning: failed to close file reader: %v\n", closeErr)
		}
	}()

	fileBuf := new(bytes.Buffer)
	if _, err := io.Copy(fileBuf, rc); err != nil {
		return fmt.Errorf("failed to copy file contents: %w", err)
	}

	roomList, err := GetRooms(fileBuf)
	if err != nil {
		return fmt.Errorf("faled to parse rooms: %w", err)
	}

	if err := GenerateBaseConfigs("My first home", roomList); err != nil {
		return fmt.Errorf("failed to generate configs: %w", err)
	}

	if err := saveHome(homeFile); err != nil {
		return fmt.Errorf("failed to save home file: %w", err)
	}

	viper.Set("configured", true)
	viper.WriteConfig()

	return nil
}

type BuildingConfig struct {
	Title         string `yaml:"title"`
	FloorplanPath string `yaml:"floorplan_name"`
	Rooms         []Room `yaml:"rooms"`
}

func writeConfig(config any, basePath string, filename string) error {
	yml, err := yaml.Marshal(config)
	if err != nil {
		return err
	}

	fullPath := filepath.Join(basePath, filename)

	f, err := os.Create(fullPath)
	if err != nil {
		return err
	}
	defer func() {
		if closeErr := f.Close(); closeErr != nil {
			log.Printf("Warning: failed to close file %s: %v", fullPath, closeErr)
		}
	}()

	if _, err = f.Write(yml); err != nil {
		return err
	}

	return nil
}
func GenerateBaseConfigs(home_name string, rooms []Room) error {
	basePath := config.AppConfig.ConfigPath

	homeConfig := models.HomeConfig{
		Name:      "My Home",
		Buildings: []string{"building.yml"},
	}

	buildingConfig := BuildingConfig{
		Title:         "My first building",
		FloorplanPath: "home.xml",
		Rooms:         rooms,
	}

	if err := writeConfig(buildingConfig, basePath, "building.yml"); err != nil {
		return fmt.Errorf("failed to write building config: %w", err)
	}

	if err := writeConfig(homeConfig, basePath, "home.yml"); err != nil {
		return fmt.Errorf("failed to write home config: %w", err)
	}

	return nil
}
