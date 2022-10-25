import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BoardTile from './boardTile';
import Overlay from './overlay';
import { StateType } from '../redux/boardSlice';
import { Point } from '../types/Models';
import { move } from '../redux/boardSlice';
import { Direction } from '../types/Direction';
import { BoardType } from '../functions/board';
import { AnimationType, Animation } from '../types/Animations';
import { animationDuration } from '../config';

const Board: React.FC = () => {
	const dispatch = useDispatch();
	const { board, boardSize, animations } = useSelector((state: { boards: StateType }) => state.boards);

	const startPointerLocation = useRef<Point>();
	const currentPointerLocation = useRef<Point>();

	const onMove = useCallback((direction: Direction) => dispatch(move({ value: direction })), [dispatch]);

	const [renderedBoard, setRenderedBoard] = useState(board);
	const [renderedAnimations, setRenderedAnimations] = useState<Animation[]>([]);
	const lastBoard = useRef<BoardType>([...board]);
	const animationTimeout = useRef<any>();

	useEffect(() => {
		const keydownListener = (e: KeyboardEvent) => {
			e.preventDefault();

			switch (e.key) {
				case 'ArrowDown':
					onMove(Direction.DOWN);
					break;
				case 'ArrowUp':
					onMove(Direction.UP);
					break;
				case 'ArrowLeft':
					onMove(Direction.LEFT);
					break;
				case 'ArrowRight':
					onMove(Direction.RIGHT);
					break;
			}
		};

		window.addEventListener('keydown', keydownListener);

		return () => {
			window.removeEventListener('keydown', keydownListener);
		};
	}, [onMove]);

	const finishPointer = useCallback(
		(a: Point, b: Point) => {
			const distance = Math.sqrt((b.y - a.y) ** 2 + (b.x - a.x) ** 2);
			if (distance < 20) {
				return;
			}

			const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
			if (angle < -135 || angle > 135) {
				onMove(Direction.LEFT);
			} else if (angle < -45) {
				onMove(Direction.UP);
			} else if (angle < 45) {
				onMove(Direction.RIGHT);
			} else if (angle < 135) {
				onMove(Direction.DOWN);
			}
		},
		[onMove]
	);

	const onTouchStart = useCallback((e: React.TouchEvent) => {
		e.preventDefault();
		const touch = e.touches[0];
		if (touch) {
			const point: Point = { x: touch.pageX, y: touch.pageY };
			startPointerLocation.current = point;
		}
	}, []);
	const onTouchMove = useCallback((e: React.TouchEvent) => {
		// e.preventDefault();
		const touch = e.touches[0];
		if (touch) {
			const point: Point = { x: touch.pageX, y: touch.pageY };
			currentPointerLocation.current = point;
		}
	}, []);
	const onTouchEnd = useCallback(
		(e: React.TouchEvent) => {
			// e.preventDefault();
			if (startPointerLocation.current && currentPointerLocation.current) {
				finishPointer(startPointerLocation.current, currentPointerLocation.current);
			}

			startPointerLocation.current = undefined;
			currentPointerLocation.current = undefined;
		},
		[finishPointer]
	);

	const onMouseStart = useCallback((e: React.MouseEvent) => {
		const point: Point = { x: e.pageX, y: e.pageY };
		startPointerLocation.current = point;
	}, []);
	const onMouseEnd = useCallback(
		(e: React.MouseEvent) => {
			if (startPointerLocation.current) {
				finishPointer(startPointerLocation.current, { x: e.pageX, y: e.pageY });
				startPointerLocation.current = undefined;
			}
		},
		[finishPointer]
	);

	useEffect(() => {
		if (!animations) {
			setRenderedBoard([...board]);
			return;
		}

		const moveAnimations = animations.filter((animation: Animation) => animation.type === AnimationType.MOVE);
		const otherAnimations = animations.filter((animation: Animation) => animation.type !== AnimationType.MOVE);

		if (moveAnimations.length > 0) {
			setRenderedBoard(lastBoard.current);
			setRenderedAnimations(moveAnimations);

			clearTimeout(animationTimeout.current);
			animationTimeout.current = setTimeout(() => {
				setRenderedAnimations(otherAnimations);
				setRenderedBoard([...board]);
			}, animationDuration);
		} else {
			setRenderedAnimations(otherAnimations);
			setRenderedBoard([...board]);
		}

		lastBoard.current = [...board];
	}, [animations, board, setRenderedBoard, setRenderedAnimations]);

	return (
		<div
			className={`board board-${boardSize}`}
			style={{ '--board-size': boardSize } as any}
			onMouseDown={onMouseStart}
			onMouseUp={onMouseEnd}
			onTouchStart={onTouchStart}
			onTouchMove={onTouchMove}
			onTouchEnd={onTouchEnd}
		>
			{renderedBoard.map((value: number, index: number) => (
				<BoardTile value={value} animations={renderedAnimations?.filter((animation) => animation.index === index)} key={index}></BoardTile>
			))}
			<Overlay></Overlay>
		</div>
	);
};

export default Board;
