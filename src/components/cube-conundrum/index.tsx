import { parseGames, sumOfPossibleGames, sumOfPowers } from '../../lib/cube-conundrum';
import Solution from '../solution';

const CubeConundrum = () => (
	<Solution
		parseInput={ parseGames }
		partOne={ sumOfPossibleGames }
		partTwo={ sumOfPowers }
	/>
);

export default CubeConundrum;
