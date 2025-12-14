export interface Building {
    event: Event;
    [property: string]: any;
}

export interface Event {
    message?: string;
    type:     Type;
    code?:    number;
    [property: string]: any;
}

export enum Type {
    Error = "error",
    Text = "text",
}
