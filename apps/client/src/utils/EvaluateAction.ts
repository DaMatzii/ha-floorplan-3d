import { useHass } from "@hakit/core";

import { useBottomSheetStore } from "@/store";
import { BottomSheetType } from "@/types/";
import { Action } from "@/types/types"

// export interface Action {
// 	action: "more-info" | "call-service"
// 	target: any
// }

export function useEvaluateAction() {
	const { callService } = useHass();
	const { openBottomSheet } = useBottomSheetStore()


	const evaluateAction = (action: Action, callbacks?: any, data?: any) => {
		_evaluateAction(action, callService, openBottomSheet, callbacks ?? {}, data ?? {})
	};

	return { evaluateAction }
}

const _evaluateAction = async (action, callService, openBottomSheet, callbacks = {}, data?: any) => {
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

			openBottomSheet(
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

