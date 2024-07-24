import { GameStates, Row } from "@/types";
import { HStack, useToast, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import * as shuffleSeed from "shuffle-seed";
import data from "../../../data/arr.json";
import GameResultModal from "../Modal/GameResultModal";
import Key from "./Key";
import Keyboard from "./Keyboard";
import moment from "moment-timezone";
// @ts-ignore
import * as checker from "word-exists";

export default function GamePanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [text, setText] = useState("");
  const [solution, setSolution] = useState("");
  const [gameState, setGameState] =
    useState<keyof typeof GameStates>("playing");
  const toast = useToast();

  const handleLetterClick = (letter: string) => {
    if (text.length > 4) return;
    setText(text + letter);
  };

  const handleReset = () => {
    let temp: Row[] = [];
    for (let i = 0; i < 6; i++) {
      const row: Row = [
        {
          value: "",
          status: "guessing",
        },
        {
          value: "",
          status: "guessing",
        },
        {
          value: "",
          status: "guessing",
        },
        {
          value: "",
          status: "guessing",
        },
        {
          value: "",
          status: "guessing",
        },
      ];
      temp.push(row);
    }
    setRows(temp);
    setCurrentRowIndex(0);
    setSolution(loadSolution());
  };

  const loadSolution = () => {
    const time = moment.tz("Asia/Ho_Chi_Minh");
    return shuffleSeed.shuffle(data, time.toString)[0];
  };

  const deleteChar = () => {
    setText((prev) => text.substring(0, prev.length - 1));
  };

  const handleSubmit = () => {
    if (text.length !== 5) {
      toast({
        title: "Please fill in the word",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (!checker(text)) {
      toast({
        title: "Word not found",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    getStatuses();
    if (text === solution.toUpperCase()) {
      setGameState("win");
      return;
    }
    if (currentRowIndex === 5 && text !== solution.toUpperCase()) {
      setGameState("lose");
      return;
    }
    setText("");
    setCurrentRowIndex((prev) => prev + 1);
  };

  const getStatuses = () => {
    let currentRow = rows[currentRowIndex];
    for (let i = 0; i < currentRow.length; i++) {
      if (!solution.includes(text[i].toLocaleLowerCase()))
        currentRow[i].status = "absent";
      if (solution.includes(text[i].toLocaleLowerCase()))
        currentRow[i].status = "present";
      if (solution[i] === text[i].toLocaleLowerCase())
        currentRow[i].status = "correct";
    }
    setRows([...rows]);
  };

  useEffect(() => {
    handleReset();
  }, []);

  useEffect(() => {
    if (rows.length === 0) return;
    let currentRow = rows[currentRowIndex];
    for (let i = 0; i < currentRow.length; i++) {
      if (i < text.length) {
        currentRow[i].value = text[i];
      } else {
        currentRow[i].value = "";
      }
    }
    setRows([...rows]);
  }, [text]);

  return (
    <>
      <VStack justify="center" h="full" spacing={20}>
        <VStack>
          {rows.map((play, index) => (
            <HStack key={index}>
              {play.map((guess, idx) => (
                <Key
                  key={idx}
                  value={guess.value}
                  status={guess.status as any}
                  onLetterClick={(letter: string) => handleLetterClick(letter)}
                  type="cell"
                />
              ))}
            </HStack>
          ))}
        </VStack>
        <Keyboard
          onLetterClick={handleLetterClick}
          onSubmit={handleSubmit}
          rows={rows.slice(0, currentRowIndex)}
          onDelete={deleteChar}
          onReset={handleReset}
        />
      </VStack>
      <GameResultModal gameState={gameState} resetGame={handleReset} />
    </>
  );
}
