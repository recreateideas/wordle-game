import { useUser } from "@/lib/useUser";
import { GameStates } from "@/types";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";

export default function GameResultModal({
  gameState,
  resetGame,
}: {
  gameState: keyof typeof GameStates;
  resetGame: () => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [countdown, setCountdown] = useState("");
  const user = useUser();

  const mutation = useMutation(() => {
    return axios.post(`/api/rank`, { id: user.id });
  });

  useEffect(() => {
    setIsOpen(gameState !== "playing");
    if (gameState === "win") mutation.mutate();
  }, [gameState]);

  useEffect(() => {
    let interval: NodeJS.Timer;
    interval = setInterval(() => {
      var date = new Date();
      var hours = date.getHours();
      var minute = date.getMinutes();
      var second = date.getSeconds();

      var leftHour = 23 - hours;
      var leftMinute = 59 - minute;
      var leftSecond = 59 - second;
      setCountdown(
        `${leftHour.toString().padStart(2, "0")}:${leftMinute
          .toString()
          .padStart(2, "0")}:${leftSecond.toString().padStart(2, "0")}`
      );
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent pb={5}>
          <ModalHeader textAlign={"center"}>
            {gameState === "win" ? "Bless" : "Booooo"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {gameState === "lose" && "Better try again"}
            {gameState === "win" && "Congratulation on your winning !"}
            <HStack justify={"space-between"}>
              <Text>Next word</Text>
              <Text>{countdown}</Text>
            </HStack>
          </ModalBody>
          {gameState !== "win" && (
            <ModalFooter>
              <Button onClick={resetGame}>Reset</Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
