import { parseSchematic, partNumbersSum, gearRatiosSum } from '../../lib/gear-ratios';
import Solution from '../solution'

const GearRatios = () => (
	<Solution
		parseInput={ parseSchematic }
		partOne={ partNumbersSum }
		partTwo={ gearRatiosSum }
	/>
);

export default GearRatios;
