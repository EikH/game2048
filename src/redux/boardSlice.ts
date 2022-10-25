import { createSlice } from '@reduxjs/toolkit';

import { BoardType } from '../functions/board';
import { Animation } from '../types/Animations';
import { getStoredData, setStoredData } from '../functions/localStorage';
import { initializeBoard, updateBoard, movePossible } from '../functions/board';
import { defaultBoardSize, victoryTileValue } from '../config';
import { ActionModel } from '../types/Models';
import { Direction } from '../types/Direction';

export interface StateType {
	// 矩阵大小.    默认值:4
	boardSize: number;

	// 当前矩阵列表
	board: BoardType;

	// 上次渲染的矩阵列表
	previousBoard?: BoardType;

	//	游戏是否胜利（是否组成2048）
	victory: boolean;

	// 游戏是否失败
	defeat: boolean;

	// 是否需要把胜利画面隐藏
	victoryDismissed: boolean;

	// 得分
	score: number;

	// 加分
	scoreIncrease?: number;

	// 历史最高分
	best: number;

	// 用于某些动画。主要作为“键”属性的值
	moveId: string;

	// 需要在页面上渲染的动画
	animations?: Animation[];
}

// 读取缓存
const storedData = getStoredData();

// 初始化state
function initializeState(): StateType {
	// 初始化矩阵
	const updata = initializeBoard(defaultBoardSize);

	return {
		boardSize: storedData.boardSize || defaultBoardSize,
		board: storedData.board || updata.board,
		victory: false,
		defeat: storedData.defeat || false,
		victoryDismissed: storedData.victoryDismissed || false,
		score: storedData.score || 0,
		best: storedData.best || 0,
		moveId: new Date().getDate().toString(),
	};
}

const initialState: StateType = initializeState();

function SaveNewRecord(state: StateType) {
	if (state.score > state.best) {
		state.best = state.score;
	}

	state.defeat = !movePossible(state.board);
	state.victory = !!state.board.find((value) => value === victoryTileValue);
	setStoredData(state);
}

const boardSlice = createSlice({
	name: 'board',
	initialState,
	reducers: {
		// 继续游戏action
		dismiss(state: StateType): void {
			state.victoryDismissed = true;
			
			SaveNewRecord(state);
		},
		// 重新开始action
		reset(state: StateType, action: ActionModel): void {
			const size = action.payload.value || state.boardSize;
			const update = initializeBoard(size);
			state.boardSize = size;
			state.board = update.board;
			state.score = 0;
			state.previousBoard = undefined;
			state.animations = update.animations;
			state.victory = false;
			state.victoryDismissed = false;

			SaveNewRecord(state);
		},
		// 移动action
		move(state: StateType, action: ActionModel): void {
			if (state.defeat) {
				return;
			}
			const direction = action.payload.value as Direction;
			const update = updateBoard(state.board, direction);
			state.previousBoard = [...state.board];
			state.board = update.board;
			state.score += update.scoreIncrease;
			state.animations = update.animations;
			state.scoreIncrease = update.scoreIncrease;
			state.moveId = new Date().getTime().toString();

			SaveNewRecord(state);
		},
		// 撤回action
		undo(state: StateType): void {
			if (!state.previousBoard) {
				return;
			}

			state.board = state.previousBoard;
			state.previousBoard = undefined;

			if (state.scoreIncrease) {
				state.score -= state.scoreIncrease;
			}

			SaveNewRecord(state);
		},
	},
});

export default boardSlice;

export const { dismiss, reset, move, undo } = boardSlice.actions;
