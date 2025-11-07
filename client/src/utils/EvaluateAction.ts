import { useHass } from "@hakit/core";

import { useBottomSheet } from "@/context/HomeContext";
import { BottomSheetType } from "@/types/";


export const evaluateAction = async (action, callService, openBottomSheet, callbacks = {}, data?: any) => {

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

			const roomName = action.card ?? ""
			openBottomSheet(
				roomName,
				window.innerHeight * 0.25,
				{ ...data, ...action?.target }
			);

			break;

		case "none":
		default:
			if (typeof callbacks["none"] === "function") {
				callbacks["none"](action);
			}
			break;
	}
};

