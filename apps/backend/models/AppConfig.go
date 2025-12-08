package models

type AppConfig struct {
	ExternalConfig string `json:"external_config,omitempty"`
	InternalConfig string `json:"internal_config,omitempty"`
	Resources      string `json:"resources,omitempty"`
	Configured     bool   `json:"configured"`
	CurrentVersion string `json:"currentVersion,omitempty"`
}
