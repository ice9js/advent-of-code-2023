import { parseCards, totalCards, totalPoints } from '../../lib/scratchcards'
import { sum } from '../../lib/util'
import Solution from '../solution';

const Scratchcards = () => (
	<Solution
		parseInput={ parseCards }
		partOne={ totalPoints }
		partTwo={ totalCards }
	/>
);

export default Scratchcards;
