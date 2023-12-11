import { parseUniverse, sumWithSlowExpansion, sumWithRapidExpansion } from '../../lib/universe';
import Solution from '../solution';

const Universe = () => (
	<Solution
		parseInput={ parseUniverse }
		partOne={ sumWithSlowExpansion }
		partTwo={ sumWithRapidExpansion }
	/>
);

export default Universe;
