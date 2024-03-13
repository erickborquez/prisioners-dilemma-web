import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";

import { useMemo } from "react";

import { ActorIdentifier } from "@/actor/type";

import { GameActionType, GameState, GameStatus } from "../type"
import { ISoloStrategyGame } from "../SoloStrategyGame"
import { getLastWonPoints } from "../util";

// ********************************************************************************
interface Props {
  game: ISoloStrategyGame;
  state: GameState;

  actorPlayerId: ActorIdentifier;

  onRestart: () => void;
}

export const SoloStrategyGameComponent: React.FC<Props> = ({ game, state, actorPlayerId, onRestart }) => {
  const opponent = useMemo(
    () => game.spec.actors.find(actor => actor.id !== actorPlayerId)!,
    [game, actorPlayerId]
  );
  
  const isWaiting = state.status !== GameStatus.Ended && state.actorId !== actorPlayerId,
        isPlayerTurn = state.status !== GameStatus.Ended && state.actorId === actorPlayerId;

  const history = state.status === GameStatus.Idle ? [/*empty state*/] : state.history;
  const playerLastReceivedPoints = getLastWonPoints(game.spec, history, actorPlayerId),
        opponentLastReceivedPoints = getLastWonPoints(game.spec, history, opponent.id);

  const playerPoints = state.points[actorPlayerId],
        opponentPoints = state.points[opponent.id];

  // == Handler ===================================================================
  const handleSplit = () => game.makeAction({ actorId: actorPlayerId, action: GameActionType.Split });
  const handleTake = () => game.makeAction({ actorId: actorPlayerId, action: GameActionType.Take });

  // == UI ========================================================================
  return (
    <Flex direction='column'>
      <Flex justifyContent='space-between' fontSize='32px' color='#444' fontWeight='600'>
        <Box textAlign='center'>
          <Text>{opponent.name}</Text>
          <Text>
            {state.points[opponent.id]}
            {opponentLastReceivedPoints !== null && (
              <Text as='span' color='#0f0' fontSize='16px'>+{opponentLastReceivedPoints}</Text>
            )}
          </Text>
        </Box>
        <Box textAlign='center'>
          <Text>Tu</Text>
          <Text>
            {state.points[actorPlayerId]}
            {playerLastReceivedPoints !== null && (
              <Text as='span' color='#0f0' fontSize='16px'>+{playerLastReceivedPoints}</Text>
            )}
          </Text>
        </Box>
      </Flex>

      <Flex height='30vh' alignItems='center' justifyContent='center'>
        {isWaiting && <Spinner size='lg'/>}
        {isPlayerTurn && <Text fontSize='48px' color='#555'>Tu turno</Text>}
        {state.status === GameStatus.Ended && (
          <Flex
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            gap='32px'
          >
            {playerPoints > opponentPoints ? (
              <Text fontSize='32px' color='#0f0'>¡Ganaste!</Text>
            ) : playerPoints < opponentPoints ? (
              <Text fontSize='32px' color='#f00'>¡Perdiste!</Text>
            ) : (
              <Text fontSize='32px' color='#555'>Empate</Text>
            )}
            <Button size='lg' colorScheme='blue' onClick={onRestart}>Buscar otro contrincante</Button>
          </Flex>
        )}
      </Flex>
      
      {isPlayerTurn && (
        <Flex alignItems='center' justifyContent='center' gap='16px' marginTop='40px'>
          <Button size='lg' colorScheme='blue' onClick={handleSplit}>Compartir</Button>
          <Button size='lg' colorScheme='blue' onClick={handleTake}>Robar</Button>
        </Flex>
      )}
    </Flex>
  );
}