import { sum } from './util';

interface ScratchCard {
	id: number;
	values: number[];
	winningNumbers: number[];
}

const parseNumbers = ( input: string ): number[] =>
	input.trim().split( /\s+/ ).map( ( n ) => parseInt( n, 10 ) );

export const parseCards = ( input: string ): ScratchCard[] =>
	input
		.split( '\n' )
		.map( ( line, id ) => {
			const numbers = line
				.replace( /^Card\s+\d+\:/, '' )
				.split( '|' )
				.map( parseNumbers );

			return {
				id,
				values: numbers[ 1 ] || [],
				winningNumbers: numbers[ 0 ] || [],
			};
		} );

const matchingNumbers = ( card: ScratchCard ): number[] =>
	card.values.filter( ( v ) => card.winningNumbers.some( ( n ) => n === v ) );

const cardPoints = ( card: ScratchCard ): number => {
	const numbers = matchingNumbers( card );

	return numbers.length ? Math.pow( 2, numbers.length - 1 ) : 0;
};

export const totalPoints = ( cards: ScratchCard[] ): number =>
	cards
		.map( cardPoints )
		.reduce( sum, 0 );

export const totalCards = ( cards: ScratchCard[] ): number =>
	cards.reduce(
		( copies, card ) => {
			const numbers = matchingNumbers( card );

			return copies.map(
				( n, id ) => ( card.id < id && id <= card.id + numbers.length )
					? copies[ card.id ] + n
					: n
			);
		},
		cards.map( () => 1 )
	)
	.reduce( sum, 0 );
