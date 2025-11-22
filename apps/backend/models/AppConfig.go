package models

type AppConfig struct {
	ConfigPath     string `json:"config_path,omitempty"`
	Configured     bool   `json:"configured"`
	CurrentVersion string `json:"currentVersion,omitempty"`
}
