import { shuffle, remove } from "lodash";

// prettier-ignore
const freshDeck = ['AC', '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', 'JC', 'QC', 'KC', 'AD', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', 'JD', 'QD', 'KD', 'AH', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'JH', 'QH', 'KH', 'AS', '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', 'JS', 'QS', 'KS'];

export function getFreshDeck() {
  return freshDeck.slice();
}

export function shuffledDeck() {
  return shuffle(getFreshDeck());
}

/*
  returns: array of given number of cards
 */
export function deal(deck, number) {
  return deck.splice(0, number);
}

/*
  Will add or remove given card from given array of cards, returning new array
 */
export function addOrRemove(cards, value) {
  const clone = cards.slice();
  const foundIndex = clone.findIndex((val) => val === value);
  if (foundIndex === -1) {
    clone.push(value);
  } else {
    clone.splice(foundIndex, 1);
  }
  return clone;
}

/*
  hand: array of cards
  discards: array of cards to replace
  returns: new hand
 */
export function redraw(hand, discards, deck) {
  let newHand = hand.slice();
  discards.forEach((value) => {
    const findIndex = newHand.findIndex((val) => val === value);
    if (findIndex > -1) {
      newHand[findIndex] = deal(deck, 1)[0];
    } else {
      throw new Error("You tried to replace cards you did not have");
    }
  });
  return newHand;
}

export function sortedHand(hand) {
  const cards = hand.map((card) => {
    let valueArray = card.split("");
    return {
      suit: valueArray.pop(),
      value: valueArray.join("")
    };
  });

  cards.forEach((card) => {
    switch (card.value) {
      case "A":
        card.value = 14;
        break;
      case "K":
        card.value = 13;
        break;
      case "Q":
        card.value = 12;
        break;
      case "J":
        card.value = 11;
        break;
      default:
        card.value = parseInt(card.value, 10);
    }
  });

  return cards.sort((a, b) => a.value - b.value);
}

export function sortedString(cards) {
  cards.forEach((card) => {
    switch (card.value) {
      case 14:
        card.value = "A";
        break;
      case 13:
        card.value = "K";
        break;
      case 12:
        card.value = "Q";
        break;
      case 11:
        card.value = "J";
        break;
      default:
        card.value = card.value.toString();
    }
  });

  return cards.map((card) => `${card.value}${card.suit}`);
}

export function isFlush(cards) {
  const firstSuit = cards[0].suit;
  return cards.every((card) => card.suit === firstSuit);
}

export function isStraight(hand) {
  const values = hand.map((card) => card.value);

  function checkForStraight(vals) {
    return vals.every((value, index, array) => {
      if (index === 0) return true;
      return array[index - 1] === value - 1;
    });
  }

  // typical straight
  if (checkForStraight(values)) {
    return true;
  }

  // low straight
  if (values[4] === 14) {
    let copy = values.slice();
    copy.pop();
    copy.unshift(1);
    return checkForStraight(copy);
  }

  return false;
}

export function groups(cards) {
  const values = cards.map((card) => card.value);
  let result = [];

  while (values.length) {
    const i = values.pop();
    const found = remove(values, (v) => v === i);
    if (found.length >= 1) {
      found.push(i);
      result.push(found);
    }
  }
  return result;
}

/*
  hand: array of five cards as strings, like ['AS', '9D', ...]
  returns: highest value of hand
*/
export function evaluate(hand) {
  const sortedHand = module.exports.sortedHand(hand);

  const isFlush = module.exports.isFlush(sortedHand);
  const isStraight = module.exports.isStraight(sortedHand);

  if (isFlush && isStraight && sortedHand[0].value === 10) {
    return "Royal Flush";
  }

  if (isFlush && isStraight) {
    return "Straight Flush";
  }

  if (isFlush) {
    return "Flush";
  }

  if (isStraight) {
    return "Straight";
  }

  const groups = module.exports.groups(sortedHand);

  // four of a kind
  if (groups.length === 1 && groups[0].length === 4) {
    return "Four of a Kind";
  }

  // full house
  if (
    groups.length === 2 &&
    (groups[0].length === 3 || groups[1].length === 3)
  ) {
    return "Full House";
  }

  // three of a kind
  if (groups.length === 1 && groups[0].length === 3) {
    return "Three of a Kind";
  }

  // two pair
  if (groups.length === 2) {
    return "Two Pair";
  }

  // jacks or better
  if (groups.length === 1 && groups[0][0] >= 11) {
    return "Jacks or Better";
  }

  // one pair or high card
  return "Bupkis";
}

export function calculate(result, bet = 5) {
  if (result === "Royal Flush") return bet * 250;
  if (result === "Straight Flush") return bet * 50;
  if (result === "Four of a Kind") return bet * 25;
  if (result === "Full House") return bet * 9;
  if (result === "Flush") return bet * 6;
  if (result === "Straight") return bet * 4;
  if (result === "Three of a Kind") return bet * 3;
  if (result === "Two Pair") return bet * 2;
  if (result === "Jacks or Better") return bet;
  return 0;
}
