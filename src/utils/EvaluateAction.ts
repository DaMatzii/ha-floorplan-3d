import { useHass } from "@hakit/core";

export const evaluateAction = async (action, callService, callbacks = {}) => {
	if (!action) return;

	switch (action.action) {
		case "call-service":
			if (!action.service) return;
			const [domain, serviceName] = action.service.split(".");
			callService({
				domain: domain,
				service: serviceName,
				target: {
					entity_id: action.target.entity_id,
				},
			});

			if (typeof callbacks["call-service"] === "function") {
				callbacks["call-service"](action);
			}
			break;


		case "more-info":
			if (typeof callbacks["more-info"] === "function") {
				callbacks["more-info"](action);
			}
			break;

		case "none":
		default:
			if (typeof callbacks["none"] === "function") {
				callbacks["none"](action);
			}
			break;
	}
};

