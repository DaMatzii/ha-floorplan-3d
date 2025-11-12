export interface BottomSheetState {
	cardsNode: any;
	openBottomSheet: (
		node: BottomSheetType,
		maxHeight: number,
		data: any,
	) => void;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<any>>;
	maxHeight: number;
	setMaxHeight: React.Dispatch<React.SetStateAction<any>>;
}
