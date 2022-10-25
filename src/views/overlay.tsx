import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { StateType, dismiss, reset } from '../redux/boardSlice';

const Overlay: React.FC = () => {
	const dispatch = useDispatch();
	const { victory, victoryDismissed, defeat } = useSelector((state: { boards: StateType }) => state.boards);

	const dismissFn = useCallback(() => dispatch(dismiss()), [dispatch]);
	const resetFn = useCallback(() => dispatch(reset({})), [dispatch]);
	console.log('victory:', victory, 'victoryDismissed:', victoryDismissed, 'defeat:', defeat);

	// 胜利渲染的组件
	if (victory && !victoryDismissed) {
		return (
			<div className='overlay overlay-victory'>
				<h1>你赢了!</h1>
				<div className='overlay-buttons'>
					<button onClick={dismissFn}>继续游戏</button>
					<button onClick={resetFn}>再来一把</button>
				</div>
			</div>
		);
	} else if (defeat) {
		return (
			<div className='overlay overlay-defeat'>
				<h1>游戏结束!</h1>
				<div className='overlay-buttons'>
					<button onClick={resetFn}>再试一次</button>
				</div>
			</div>
		);
	}
	return null;
};

export default Overlay;
