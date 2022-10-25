import { Direction } from '../types/Direction';
import { Animation, AnimationType } from '../types/Animations';

export type BoardType = number[];

export interface BoardUpdate {
	board: BoardType;
	animations?: Animation[];
	scoreIncrease: number;
}

interface NewTileResult {
	board: BoardType;
	index?: number;
}

// 随机生成2或者4
export function newTileValue() {
	return Math.random() > 0.1 ? 2 : 4;
}

// 检查是否存在空块
function containsEmpty(board: BoardType): boolean {
	return board.find((value) => value === 0) === 0;
}

// 在矩阵空位置随机生成块
function newTile(board: BoardType): NewTileResult {
	// 检查空块
	if (!containsEmpty(board)) {
		return { board };
	}

	let index: number | undefined = undefined;

	// 在随机空位随机生成2或者4
	while (true) {
		index = Math.floor(Math.random() * board.length);
		if (board[index] === 0) {
			board[index] = newTileValue();
			break;
		}
	}

	return {
		board,
		index,
	};
}

// 计算坐标改变后的位置
function getRotatedIndex(index: number, boardSize: number, direction: Direction): number {
	let x = index % boardSize;
	let y = Math.floor(index / boardSize);

	switch (direction) {
		case Direction.LEFT:
			{
				const temp = y;
				y = boardSize - 1 - x;
				x = temp;
			}
			break;
		case Direction.RIGHT:
			{
				const temp = x;
				x = boardSize - 1 - y;
				y = temp;
			}
			break;
		case Direction.UP:
			x = boardSize - 1 - x;
			y = boardSize - 1 - y;
			break;
	}

	return y * boardSize + x;
}

// 对相应的操作，改变矩阵坐标
function rotateBoard(board: BoardType, direction: Direction, undo = false): BoardType {
	// 不需要旋转，它已经在正确的方向
	if (direction === Direction.DOWN) {
		return [...board];
	}

	const boardSize = Math.sqrt(board.length);
	const newBoard = new Array(board.length);

	// 是否是撤销操作
	if (undo) {
		switch (direction) {
			case Direction.LEFT:
				direction = Direction.RIGHT;
				break;
			case Direction.RIGHT:
				direction = Direction.LEFT;
				break;
		}
	}

	// 重新排列矩阵
	for (let i = 0; i < board.length; i++) {
		const index = getRotatedIndex(i, boardSize, direction);
		newBoard[index] = board[i];
	}

	return newBoard;
}

// 获得需要加入动画 块的位置
function rotateAnimations(board: BoardType, animations: Animation[], direction: Direction): Animation[] {
	// 不需要旋转，它已经在正确的方向
	if (direction === Direction.DOWN) {
		return animations;
	}

	const boardSize = Math.sqrt(board.length);

	switch (direction) {
		case Direction.LEFT:
			direction = Direction.RIGHT;
			break;
		case Direction.RIGHT:
			direction = Direction.LEFT;
			break;
	}

	for (let animation of animations) {
		animation.index = getRotatedIndex(animation.index, boardSize, direction);
	}

	return animations;
}

// 更新矩阵
export function updateBoard(board: BoardType, direction: Direction): BoardUpdate {
	const boardSize = Math.sqrt(board.length);

	// 首先，旋转板子，使重力向下作用
	board = rotateBoard(board, direction);

	let changed = false;
	let scoreIncrease = 0;
	let animations: Animation[] = [];
	let lastMergedIndex: number | undefined = undefined;

	for (let col = 0; col < boardSize; col++) {
		// 从倒数第二到旋转板上的第一行
		for (let row = boardSize - 2; row >= 0; row--) {
			const initialIndex = row * boardSize + col;
			if (board[initialIndex] === 0) {
				continue;
			}

			let i = initialIndex;
			let below = i + boardSize;
			let merged = false;
			let finalIndex: number | undefined = undefined;

			while (board[below] === 0 || (!merged && board[i] === board[below])) {
				if (below === lastMergedIndex) {
					break;
				}

				changed = true;

				if (board[below] !== 0) {
					// 确保非贪婪行为，只允许合并一次
					merged = true;

					scoreIncrease += board[i] * 2;
				}

				// 合并或更新视图
				board[below] += board[i];
				board[i] = 0;
				i = below;
				finalIndex = below;
				below = i + boardSize;
			}

			if (finalIndex !== undefined) {
				animations.push({
					type: AnimationType.MOVE,
					index: initialIndex,
					direction,
					value: Math.floor((finalIndex - initialIndex) / boardSize),
				});

				if (merged) {
					lastMergedIndex = finalIndex;

					animations.push({
						type: AnimationType.MERGE,
						index: finalIndex,
					});
				}
			}
		}
	}

	// 撤销旋转
	board = rotateBoard(board, direction, true);
	animations = rotateAnimations(board, animations, direction);

	// 在更改时生成一个新的贴图
	if (changed) {
		const result = newTile(board);
		board = result.board;

		if (result.index !== undefined) {
			animations.push({
				type: AnimationType.NEW,
				index: result.index,
			});
		}
	}

	return { board, scoreIncrease, animations };
}

// 检查是否存在可移动块
export function movePossible(board: BoardType): boolean {
	const boardSize = Math.sqrt(board.length);

	if (containsEmpty(board)) {
		return true;
	}

	// 检查附近的块是否可以合并
	for (let i = 0; i < board.length; i++) {
		if (
			board[i] === board[i + boardSize] ||
			board[i] === board[i - boardSize] ||
			(i % boardSize !== 0 && board[i] === board[i - 1]) ||
			(i % boardSize !== boardSize - 1 && board[i] === board[i + 1])
		) {
			return true;
		}
	}

	return false;
}

// 初始化矩阵
export function initializeBoard(boardSize: number): BoardUpdate {
	// 创建容器
	const board = new Array(boardSize ** 2).fill(0);
	const animations: Animation[] = [];

	// 初始化块，初始存在两块
	let result = newTile(board);
	if (result.index) {
		animations.push({
			type: AnimationType.NEW,
			index: result.index,
		});
	}

	result = newTile(board);
	if (result.index) {
		animations.push({
			type: AnimationType.NEW,
			index: result.index,
		});
	}

	return { board, scoreIncrease: 0, animations };
}
