type Card = string;

interface Hand {
	cards: Card[];
	bid: number;
}

const parseHand = ( input: string ): Hand => {
	const [ cards, bid ] = input.split( ' ' );

	return ( {
		cards: cards.split( '' ),
		bid: parseInt( bid, 10 ),
	} );
};

export const parseHands = ( input: string ): Hand[] =>
	input
		.split( '\n' )
		.map( parseHand );

const groupCardsByRank = ( cards: Card[] ): [Card, number][] =>
	Object.entries(
		cards.reduce(
			( cardsByRank: Record<Card, number>, card ) => ( {
				...cardsByRank,
				[ card ]: ( cardsByRank[ card ] || 0 ) + 1,
			} ),
			{}
		)
	);

const handType = ( cards: Card[] ) => {
	const cardsByRank = groupCardsByRank( cards )
		.sort( ( a, b ) => b[1] - a[1] );

	switch ( cardsByRank[0][1] ) {
	case 5:
		return 7;
	case 4:
		return 6;
	case 3:
		return cardsByRank.length === 2 ? 5 : 4;
	case 2:
		return cardsByRank.length === 3 ? 3 : 2;
	default:
		return 1;
	}
};

const compareRanks = ( cards: Card[], otherCards: Card[] ) =>
	handType( cards ) - handType( otherCards );

const CARD_ORDER = '23456789TJQKA';
const CARD_ORDER_WITH_JOKERS = 'J23456789TQKA';

const cardStrength = ( card: Card, cardOrder: string = CARD_ORDER ): number =>
	cardOrder.indexOf( card );

const compareCards = ( [ card, ...cards ]: Card[], [ otherCard, ...otherCards]: Card[], cardOrder: string = CARD_ORDER ): number =>
	card && otherCard
		? cardStrength( card, cardOrder ) - cardStrength( otherCard, cardOrder ) || compareCards( cards, otherCards, cardOrder )
		: otherCard.length - cards.length;

const bestCombination = ( cards: Card[] ): Card[] => {
	for ( let i = 0; i < cards.length; i++ ) {
		if ( cards[i] !== 'J' ) {
			continue;
		}

		return CARD_ORDER_WITH_JOKERS
			.slice( 1 )
			.split( '' )
			.filter( ( card ) => 0 <= cards.indexOf( card ) ) // Only looking for cards that can be combined.
			.map(
				( card ) => parseHand(
					[
						...cards.slice( 0, i ),
						card,
						...cards.slice( i + 1, cards.length )
					].join( '' ) + ' 0'
				).cards
			)
			.map( bestCombination )
			.sort( ( a, b ) => compareRanks( b, a ) )
			.shift() || cards;
	}

	return cards;
};

export const totalWinnings = ( hands: Hand[] ): number =>
	hands
		.sort(
			( a, b ) =>
				compareRanks( a.cards, b.cards ) ||
				compareCards( a.cards, b.cards )
		)
		.reduce(
			( score, hand, index ) => score + hand.bid * ( index + 1 ),
			0
		);

export const totalWinningsWithJokers = ( hands: Hand[] ): number =>
	hands
		.sort(
			( { cards }, { cards: otherCards } ) =>
				compareRanks( bestCombination( cards ), bestCombination( otherCards ) ) ||
				compareCards( cards, otherCards, CARD_ORDER_WITH_JOKERS )
		)
		.reduce(
			( score, hand, index ) => score + hand.bid * ( index + 1 ),
			0
		);
