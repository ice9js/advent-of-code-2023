import { parseUniverse, sumOfDistancesBetweenAllGalaxies } from '../../lib/universe';
import Solution from '../solution';

const Universe = () => (
	<Solution
		parseInput={ parseUniverse }
		partOne={ sumOfDistancesBetweenAllGalaxies }
		// partTwo={ insideTilesCount }
	/>
);

export default Universe;
