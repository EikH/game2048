import { ActionType } from './ActionType';
import { BoardType } from '../functions/board';

export interface ActionModel {
	payload: {
		value?: number;
	};
}

export interface StorageModel {
	boardSize?: number;
	best?: number;
	score?: number;
	board?: BoardType;
	defeat?: boolean;
	victoryDismissed?: boolean;
}

export interface Point {
	x: number;
	y: number;
}
