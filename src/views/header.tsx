import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { StateType, undo, reset } from '../redux/boardSlice';

const Header: React.FC = () => {
	const dispatch = useDispatch();

	const { score, best, scoreIncrease, previousBoard, moveId } = useSelector((state: { boards: StateType }) => state.boards);

	// 撤销操作
	const undoFn = useCallback(() => dispatch(undo()), [dispatch]);
	//	重开
	const resetFn = useCallback(() => dispatch(reset({})), [dispatch]);
	return (
		<div className='header'>
			<div className='content-row'>
				<h1>2048</h1>
				<div className='header-scores'>
					<div className='header-scores-score'>
						<div>分数</div>
						<div>{score}</div>
						{scoreIncrease ? (
							<div className='header-scores-score-increase' key={moveId}>
								+8
							</div>
						) : (
							''
						)}
					</div>
					<div className='header-scores-score'>
						<div>最高分</div>
						<div>{best}</div>
					</div>
				</div>
			</div>
			<div className='content-row'>
				<div>
					获得2048方块<br></br> <strong>开源！开源！开源！</strong>
				</div>
				<div className='header-buttons'>
					<button onClick={undoFn} disabled={!previousBoard}>
						撤回
					</button>
					<button onClick={resetFn}>新游戏</button>
				</div>
			</div>
		</div>
	);
};

export default Header;
