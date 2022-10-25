import { StorageModel } from '../types/Models';

const ITEM_NAME = '2048_data';

export function getStoredData(): StorageModel {
	if (!localStorage.getItem(ITEM_NAME)) return {};

	let model: StorageModel = {};

	try {
		const data = JSON.parse(localStorage.getItem(ITEM_NAME) as string);

		// 判断缓存中是否都存在类型字段，有没有出现数据缺失
		if (
			data.hasOwnProperty('boardSize') &&
			data.hasOwnProperty('best') &&
			data.hasOwnProperty('score') &&
			data.hasOwnProperty('board') &&
			data.hasOwnProperty('defeat') &&
			data.hasOwnProperty('victoryDismissed')
		) {
			// 检验数据的正确性
			if (
				Array.isArray(data.board) &&
				data.board.length === data.boardSize ** 2 &&
				typeof data.score === 'number' &&
				typeof data.defeat === 'boolean' &&
				typeof data.victory === 'boolean'
			) {
				// 继续检验矩阵中的数据是否正常
				for (let value of data.board) {
					// 类型检查
					if (typeof value !== 'number') {
						throw new Error('数据异常.');
					}
					// 具体数据检查
					if (value !== 0 && Math.log2(value) % 1 !== 0) {
						throw new Error('数据异常.');
					}
				}
			}

			// 取出数据
			model.best = data.best;
			model.board = data.board;
			model.boardSize = data.boardSize;
			model.defeat = data.defeat;
			model.score = data.score;
			model.victoryDismissed = data.victoryDismissed;
		} else {
			throw new Error('数据异常.');
		}
	} catch {
		// 数据异常，则清楚数据
		localStorage.removeItem(ITEM_NAME);
	}

	return model;
}

// 缓存数据
export function setStoredData(model: StorageModel) {
	localStorage.setItem(
		ITEM_NAME,
		JSON.stringify({
			best: model.best,
			score: model.score,
			board: model.board,
			boardSize: model.boardSize,
			defeat: model.defeat,
			victoryDismissed: model.victoryDismissed,
		})
	);
}
