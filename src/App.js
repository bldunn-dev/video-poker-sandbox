import "./styles.css";
import { useState } from "react";
import { Button } from "@material-ui/core";
import Card from "./Card";
import {
  addOrRemove,
  shuffledDeck,
  deal,
  redraw,
  evaluate,
  calculate
} from "./utils";

function App() {
  const [discards, setDiscards] = useState([]);
  const [deck, setDeck] = useState(shuffledDeck());
  const [hand, setHand] = useState(["AD", "AD"]);
  const [status, setStatus] = useState("finished");
  const [result, setResult] = useState(null);
  const [bet, setBet] = useState(null);
  const [won, setWon] = useState(0);
  const [bank, setBank] = useState(100);

  const handleSelect = (value) => {
    setDiscards(addOrRemove(discards, value));
  };

  const handleDraw = () => {
    const finalHand = redraw(hand, discards, deck);
    const result = evaluate(finalHand);
    setHand(finalHand);
    setResult(result);
    const winnings = calculate(result, bet);
    setWon(winnings);
    setBank(bank + winnings);
    setStatus("finished");
  };

  const handleBet = (value = 5) => {
    const shuffled = shuffledDeck();
    setDeck(shuffled);
    setHand(deal(shuffled, 5));
    setDiscards([]);
    setStatus("initial");
    setResult(null);
    setBet(value);
    setBank(bank - value);
  };

  return (
    <div className="App">
      <div className="scoreboard">
        <div className="result">{result}</div>
        <div className="bank">Bank: ${bank}</div>
        <div className="bet">Bet: ${bet}</div>
        <div className="won">Won: ${won}</div>
      </div>
      <div className="card-table">
        <div className="hand">
          {hand.map((value) => (
            <Card
              key={value}
              value={value}
              handleSelect={() => handleSelect(value)}
              isSelected={discards.includes(value)}
            />
          ))}
          <div className="action-row">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDraw}
              disabled={status === "finished"}
            >
              Draw
            </Button>
            <div className="bets">
              <span>BET: </span>
              {[5, 10, 15, 20, 25].map((val) => (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleBet(val)}
                  disabled={status === "initial"}
                >
                  ${val}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
