import { findLowestLocation, findLowestLocationFromRange } from '../../lib/seeds';
import Solution, { pass } from '../solution';

const Seeds = () => (
	<Solution
		parseInput={ pass }
		partOne={ findLowestLocation }
		partTwo={ findLowestLocationFromRange }
	/>
);

export default Seeds;
