import { useMemo } from 'react';

import { Maze, parseMaze, stepsToFurthestPointInLoop, insideTilesCount, findInsideTiles, findLoop, filterMaze } from '../../lib/pipe-maze';
import Panel from '../panel';
import Solution from '../solution';

import './pipe-maze.css';

interface GridProps {
	coords: number[],
	width: number;
}

interface VisualizationProps {
	data: Maze;
}

const Grid = ( { coords, width }: GridProps ) => (
	<Panel className="pipe-maze__grid">
		<div className="pipe-maze__grid-container">
			{ coords.map( ( position ) => {
				const styles = {
					top: Math.floor( position / width ) * 3,
					left: ( position % width ) * 3
				};

				return <div className="pipe-maze__grid-dot" style={ styles } />;
			} ) }
		</div>
	</Panel>
);

const Visualization = ( { data }: VisualizationProps ) => {
	const loop = useMemo( () => findLoop( data ), [ data ] );
	const insideTiles = useMemo( () => findInsideTiles( data, loop ), [ data, loop ] );

	return (
		<>
			<Grid coords={ loop } width={ data.width } />
			<Grid coords={ insideTiles } width={ data.width } />
		</>
	);
};

const PipeMaze = () => (
	<Solution
		parseInput={ parseMaze }
		partOne={ stepsToFurthestPointInLoop }
		partTwo={ insideTilesCount }
		visualization={ Visualization }
	/>
);

export default PipeMaze;
