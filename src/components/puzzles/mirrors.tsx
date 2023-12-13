import { parsePatterns, partOne, partTwo } from '../../lib/mirrors';
import Solution from '../solution';

const Mirrors = () => (
	<Solution
		parseInput={ parsePatterns }
		partOne={ partOne }
		partTwo={ partTwo }
	/>
);

export default Mirrors;

// 8409 too low
// 8704 too low
// 8709 too low
// 
// 9409 is also wrong!
//
// 33329 - too low!