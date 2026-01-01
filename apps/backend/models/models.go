package models

type AppConfig struct {
	ExternalConfig string `json:"external_config,omitempty"`
	InternalConfig string `json:"internal_config,omitempty"`
	Resources      string `json:"resources,omitempty"`
	Configured     bool   `json:"configured"`
	CurrentVersion string `json:"currentVersion,omitempty"`
}
type SweetHome3DHome struct {
	Home any `xml:"Home"`
}
type Room struct {
	Id   string `yaml:"id"`
	Name string `yaml:"alias"`
}
type Home struct {
	Name      string   `yaml:"name"`
	Buildings []string `yaml:"buildings"`
}
type HomeConfig struct {
	Name      string   `yaml:"name"`
	Buildings []string `yaml:"buildings"`
}

type Building struct {
	Title          string `yaml:"title" json:"title"`
	Floorplan_path string `yaml:"floorplan_name" json:"floorplan"`
	Rooms          any    `yaml:"rooms" json:"rooms"`
	Raw_Rooms      any    `yaml:"raw_rooms" json:"raw_rooms"`
	Floorplan      any    `json:"floorplan_building"`
}

type BuildingConfig struct {
	Title         string `yaml:"title"`
	FloorplanPath string `yaml:"floorplan_name"`
	Rooms         []Room `yaml:"rooms"`
}
