import React from 'react';
import { useDispatch } from 'react-redux';

import { supportedBoardSizes } from '../config';
import { reset } from '../redux/boardSlice';

const BoardSizePicker: React.FC = () => {
	const dispatch = useDispatch();

	return (
		<div>
			<h2>游戏模式</h2>
			<div className='size-picker'>
				{supportedBoardSizes.map((size) => (
					<button
						key={size}
						onClick={() => {
							console.log(size);
							return dispatch(reset({ value: size }));
						}}
					>
						{size}x{size}
					</button>
				))}
			</div>
		</div>
	);
};

export default BoardSizePicker;
