import { difference, flattenDeep } from "lodash";

import {
  getFreshDeck,
  shuffledDeck,
  deal,
  sortedHand,
  evaluate,
  sortedString,
  isFlush,
  isStraight,
  groups,
  addOrRemove,
  redraw
} from "./utils";

test("deals the given number of cards", () => {
  let deck = shuffledDeck();
  const expectedHand = deck.slice(0, 5);

  const hand = deal(deck, 5);

  expect(hand).toHaveLength(5);
  expect(deck).toHaveLength(47);
  expect(difference(hand, expectedHand)).toHaveLength(0);
});

test("addOrRemove discards", () => {
  const result = addOrRemove([], "5S");
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual("5S");

  const result2 = addOrRemove(["4S"], "AH");
  expect(result2).toHaveLength(2);
  expect(result2[1]).toEqual("AH");

  const result3 = addOrRemove(["10S", "JH"], "JH");
  expect(result3).toHaveLength(1);
  expect(result3[0]).toEqual("10S");
});

test("replenishes discards", () => {
  let deck = getFreshDeck();
  let hand = deal(deck, 5);
  const newHand = redraw(hand, ["2C", "4C"], deck);

  expect(newHand).toHaveLength(5);
  expect(deck).toHaveLength(45);
  expect(difference(newHand, ["AC", "6C", "3C", "7C", "5C"])).toHaveLength(0);
});

test("sorts the hand by value", () => {
  const sorted = sortedHand(["6S", "3S", "5S", "4H", "6S"]);
  expect(
    difference(sortedString(sorted), ["2S", "3S", "4H", "5S", "6S"])
  ).toHaveLength(0);

  const flush = sortedHand(["2S", "10S", "QS", "4S", "7S"]);
  expect(
    difference(sortedString(flush), ["2S", "4S", "7S", "10S", "QS"])
  ).toHaveLength(0);
});

test("determines a flush", () => {
  const flush = sortedHand(["2S", "10S", "QS", "4S", "7S"]);
  expect(isFlush(flush)).toEqual(true);

  const straight = sortedHand(["2S", "3S", "5S", "4H", "6S"]);
  expect(isFlush(straight)).toEqual(false);
});

test("determines a straight", () => {
  const straight = sortedHand(["6S", "10H", "7D", "9S", "8C"]);
  expect(isStraight(straight)).toEqual(true);

  const highStraight = sortedHand(["QS", "9C", "KS", "JH", "10D"]);
  expect(isStraight(highStraight)).toEqual(true);

  const lowStraight = sortedHand(["AS", "5C", "3S", "2H", "4D"]);
  expect(isStraight(lowStraight)).toEqual(true);

  const flush = sortedHand(["2S", "10S", "QS", "4S", "7S"]);
  expect(isStraight(flush)).toEqual(false);
});

test("determines high card", () => {
  const hand = sortedHand(["QS", "7H", "AD", "8S", "3C"]);
  expect(flattenDeep(groups(hand))).toEqual([]);
});

test("determines one pair", () => {
  const hand = sortedHand(["6S", "7H", "8D", "7S", "10C"]);
  expect(flattenDeep(groups(hand))).toEqual([7, 7]);
});

test("determines two pair", () => {
  const hand = sortedHand(["8S", "7H", "8D", "7S", "10C"]);
  expect(flattenDeep(groups(hand))).toEqual([8, 8, 7, 7]);
});

test("determines three of a kind", () => {
  const hand = sortedHand(["8S", "7H", "8D", "8S", "10C"]);
  expect(flattenDeep(groups(hand))).toEqual([8, 8, 8]);
});

test("determines full house", () => {
  const hand = sortedHand(["8S", "7H", "8D", "8S", "7C"]);
  expect(flattenDeep(groups(hand))).toEqual([8, 8, 8, 7, 7]);
});

test("determines four of a kind", () => {
  const hand = sortedHand(["8S", "7H", "8D", "8S", "8C"]);
  expect(flattenDeep(groups(hand))).toEqual([8, 8, 8, 8]);
});

test("evaluate and discover a flush", () => {
  const isFlush = evaluate(["2S", "10S", "QS", "4S", "7S"]);
  expect(isFlush).toEqual("FLUSH");

  const isNotFlush = evaluate(["2S", "3S", "5S", "4H", "6S"]);
  expect(isNotFlush).not.toEqual("FLUSH");
});

test("evaluate and discover a straight", () => {
  const isResult = evaluate(["JS", "10H", "7D", "9S", "8C"]);
  expect(isResult).toEqual("STRAIGHT");

  const isNotResult = evaluate(["2S", "10S", "QS", "4S", "7S"]);
  expect(isNotResult).not.toEqual("STRAIGHT");
});

test("evaluate and discover a straight flush", () => {
  const isResult = evaluate(["JH", "10H", "7H", "9H", "8H"]);
  expect(isResult).toEqual("STRAIGHT_FLUSH");
});

test("evaluate and discover a royal flush", () => {
  const isResult = evaluate(["JH", "10H", "AH", "QH", "KH"]);
  expect(isResult).toEqual("ROYAL_FLUSH");
});

test("evaluate and discover four of a kind", () => {
  const isResult = evaluate(["JH", "10H", "JS", "JD", "JC"]);
  expect(isResult).toEqual("FOUR_OF_A_KIND");
});

test("evaluate and discover a full house", () => {
  const isResult = evaluate(["JH", "10H", "JS", "10D", "JC"]);
  expect(isResult).toEqual("FULL_HOUSE");

  const isResult2 = evaluate(["JH", "10H", "JS", "10D", "10C"]);
  expect(isResult2).toEqual("FULL_HOUSE");
});

test("evaluate and discover two pair", () => {
  const isResult = evaluate(["JH", "10H", "JS", "10D", "AC"]);
  expect(isResult).toEqual("TWO_PAIR");
});

test("evaluate and discover three of a kind", () => {
  const isResult = evaluate(["JH", "10H", "JS", "JD", "AC"]);
  expect(isResult).toEqual("THREE_OF_A_KIND");
});

test("evaluate and discover one pair", () => {
  const isResult = evaluate(["JH", "10H", "3S", "10D", "AC"]);
  expect(isResult).toEqual("ONE_PAIR");
});

test("evaluate and discover jacks or better", () => {
  const isResult = evaluate(["JH", "10H", "3S", "JD", "AC"]);
  expect(isResult).toEqual("JACKS_OR_BETTER");
});

test("evaluate and discover high card", () => {
  const isResult = evaluate(["KH", "10H", "3S", "JD", "AC"]);
  expect(isResult).toEqual("HIGH_CARD");
});
