interface Range {
	start: number;
	size: number;
	visited?: boolean;
}

type SeedStrategy = ( numbers: number[] ) => Range[];

interface CategoryMap {
	from: Range;
	to: Range;
}

interface SeedMap {
	seeds: Range[];
	maps: CategoryMap[][];
}

const seedIndex = ( seeds: number[] ): Range[] =>
	seeds.map( ( index ) => ( { 
		start: index,
		size: 1,
	} ) );

const seedRange = ( [ start, size, ...seeds ]: number[] ): Range[] =>
	start && size
		? [ { start, size }, ...seedRange( seeds ) ]
		: [];

const parseNumbers = ( input: string ): number[] =>
	( input.match( /\d+/g ) || [] ).map( ( n ) => parseInt( n, 10 ) );

const parseCategoryMaps = ( input: string[], n: number = 0 ): CategoryMap[] =>
	input
		.map( parseNumbers )
		.filter( ( results ) => results && results.length )
		.map( ( [ to, from, size ] ) => ( {
			from: { start: from, size },
			to: { start: to, size }
		} ) );

export const parseMap = ( input: string, parseSeeds: SeedStrategy ): SeedMap => {
	const [ seeds, ...categories ] = input.split( '\n\n' );

	return ( {
		seeds: parseSeeds( parseNumbers( seeds || '' ) ),
		maps: categories.map(
			( c ) => parseCategoryMaps( c.split( '\n' ) || '' )
		),
	} );
};

const mapSeedRange = ( { from, to }: CategoryMap ) =>
	( { start, size, visited }: Range ): Range[] => {
		if ( visited || start + size <= from.start || from.start + from.size <= start ) {
			return [ { start, size, visited } ];
		}

		const nBefore = Math.min( Math.max( from.start - start, 0 ), size );
		const nAfter = Math.min( Math.max( start + size - (from.start + from.size), 0 ), size );

		return [
			{
				start,
				size: nBefore,
			},
			{
				start: to.start + Math.max( start - from.start, 0 ),
				size: size - nBefore - nAfter,
				visited: true,
			},
			{
				start: from.start + from.size,
				size: nAfter,
			}
		];
	};

const seedsToLocations = ( seedMap: SeedMap ): Range[] => {
	let seeds = seedMap.seeds;

	for ( let category of seedMap.maps ) {
		seeds = category
			.reduce(
				( range: Range[], map: CategoryMap ): Range[] =>
					range
						.map( mapSeedRange( map ) )
						.flat()
						.filter( ( { size } ) => 0 < size ),
				seeds
			)
			.map( ( { start, size } ) => ( { start, size } ) );
	}

	return seeds;
};

const findLocation = ( parseSeeds: SeedStrategy ) =>
	( input: string ): number =>
		seedsToLocations( parseMap( input, parseSeeds ) )
			.reduce( ( min, { start } ) => Math.min( min, start ), Number.MAX_SAFE_INTEGER );

export const findLowestLocation = findLocation( seedIndex );

export const findLowestLocationFromRange = findLocation( seedRange );
