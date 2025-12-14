export interface Typestest {
    $schema:    string;
    title:      string;
    type:       string;
    properties: TypestestProperties;
    required:   string[];
}

export interface TypestestProperties {
    event: Event;
}

export interface Event {
    oneOf: OneOf[];
}

export interface OneOf {
    type:       string;
    required:   string[];
    properties: OneOfProperties;
}

export interface OneOfProperties {
    type:     Type;
    message?: Code;
    code?:    Code;
}

export interface Code {
    type: string;
}

export interface Type {
    const: string;
}
