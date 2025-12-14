import { useHass } from "@hakit/core";

import { useBottomSheetStore } from "@/store";
import { Action } from "@/types/types"

export function useEvaluateAction() {
	const { callService } = useHass();
	const { openBottomSheet } = useBottomSheetStore()


	const evaluateAction = (action: Action, callbacks?: any, data?: any) => {
		_evaluateAction(action, callService, openBottomSheet, callbacks ?? {}, data ?? {})
	};

	return { evaluateAction }
}

const _evaluateAction = async (action: Action, callService, openBottomSheet, callbacks = {}, data?: any) => {
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
			console.log(action)
			openBottomSheet(action);

			break;

		case "hass-more-info":
			window.top.document.querySelector("home-assistant").dispatchEvent(
				new CustomEvent("hass-more-info", {
					detail: { entityId: action?.target?.entity_id },
					bubbles: true,
					composed: true,
				}),
			);
			break
		default:
			if (typeof callbacks["none"] === "function") {
				callbacks["none"](action);
			}
			break;
	}
};

