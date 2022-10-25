import React, { useMemo, CSSProperties } from 'react';

import { Animation, AnimationMerge, AnimationMove, AnimationNew, AnimationType } from '../types/Animations';
import { animationDuration, gridGap } from '../config';
import { Direction } from '../types/Direction';

export interface BoardTileProps {
	value: number;
	animations?: Animation[];
}

function findAnimation<T extends Animation>(animations: Animation[] | undefined, type: AnimationType): T {
	return animations?.find((animation) => animation.type === type) as T;
}

function tileTranslate(axis: 'X' | 'Y', value: number) {
	return `translate${axis}(calc(${value} * (${gridGap} + 100%))`;
}

const BoardTile: React.FC<BoardTileProps> = ({ value, animations }) => {
	const moveAnimation = useMemo(() => findAnimation<AnimationMove>(animations, AnimationType.MOVE), [animations]);
	const newAnimation = useMemo(() => findAnimation<AnimationNew>(animations, AnimationType.NEW), [animations]);
	const mergeAnimation = useMemo(() => findAnimation<AnimationMerge>(animations, AnimationType.MERGE), [animations]);

	const style = useMemo(() => {
		if (!moveAnimation) {
			return {};
		}

		const value: CSSProperties = {
			transition: animationDuration + 'ms ease-in-out all',
		};

		switch (moveAnimation.direction) {
			case Direction.UP:
				value.transform = tileTranslate('Y', -1 * moveAnimation.value);
				break;
			case Direction.DOWN:
				value.transform = tileTranslate('Y', moveAnimation.value);
				break;
			case Direction.LEFT:
				value.transform = tileTranslate('X', -1 * moveAnimation.value);
				break;
			case Direction.RIGHT:
				value.transform = tileTranslate('X', moveAnimation.value);
				break;
		}

		return value;
	}, [moveAnimation]);

	return (
		<div className='board-tile'>
			{value !== 0 && (
				<div
					style={style}
					className={`board-tile-value board-tile-${value} ${!!newAnimation ? 'board-tile-new' : ''} ${!!mergeAnimation ? 'board-tile-merge' : ''}`}
				>
					{value}
				</div>
			)}
		</div>
	);
};

export default BoardTile;
