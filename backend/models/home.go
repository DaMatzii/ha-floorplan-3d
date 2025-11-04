package models

type Home struct {
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
