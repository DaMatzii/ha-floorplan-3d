export interface Types {
    $schema:              string;
    title:                string;
    type:                 string;
    properties:           Properties;
    required:             string[];
    additionalProperties: boolean;
}

export interface Properties {
    currentVersion: ConfigPath;
    configured:     ConfigPath;
    config_path:    ConfigPath;
}

export interface ConfigPath {
    type: string;
}
