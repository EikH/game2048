import React from 'react';

import './App.css';
import Header from './views/header';
import Board from './views/board';
import BoardSizePicker from './views/boardSizePicker';
import Info from './views/info';
import { animationDuration, gridGap } from './config';

function App() {
	return (
		<div
			className='page'
			style={
				{
					'--animation-duration': animationDuration + 'ms',
					'--grid-gap': gridGap,
				} as any
			}
		>
			<Header></Header>
			<Board></Board>
			<BoardSizePicker></BoardSizePicker>
			<Info></Info>
		</div>
	);
}

export default App;
