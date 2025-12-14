export interface Sample {
	id: number;
	payload: Payload;
}

export type Payload = string | PayloadClass;

export interface PayloadClass {
	code: number;
	message: string;
}
