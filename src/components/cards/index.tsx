import { parseHands, totalWinnings, totalWinningsWithJokers } from '../../lib/cards';
import Solution from '../solution';

const Cards = () => (
	<Solution
		parseInput={ parseHands }
		partOne={ totalWinnings }
		partTwo={ totalWinningsWithJokers }
	/>
);

export default Cards;
