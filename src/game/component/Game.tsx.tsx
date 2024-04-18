import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react"

import { ActorStrategyType, ActorType } from "@/actor/type"
import { SoloStrategyGameComponent } from "@/game/component/SoloStrategyGame";
import { SoloStrategyGame } from "@/game/SoloStrategyGame";
import { useObservable } from "@/util/hook/useObservable";
import { delay } from "@/util/async";
import { useAsyncStatus } from "@/util/hook/useAsyncStatus";
import { getRandomName } from "@/util/name";
import { GameSpec } from "../type";

// ********************************************************************************
const createGameSpecs = (name: string): GameSpec[] => {
  const strategies = [
    ActorStrategyType.Gladstein,
    ActorStrategyType.Grofman,
    ActorStrategyType.Hufford,
    ActorStrategyType.SecondByBlack,
    ActorStrategyType.TitForTat,
  ];
  // shuffle strategies
  strategies.sort(() => Math.random() - 0.5);

  return strategies.map((strategy, index) => ({
    actors: [
      {
        id: 'player',
        type: ActorType.Player,
      
        name,
      },
      {
        id: 'strategy',
        type: ActorType.Strategy,

        name: getRandomName(),
        strategy,
      }
    ],

    maxRounds: 40,

    splitSplitPoints: 3,
    splitTakePoints: 0,
    takeSplitPoints: 5,
    takeTakePoints: 1,
  }));
}

// ********************************************************************************
interface Props {
  name: string
}
export const Game: React.FC<Props> = ({ name }) => {
  const [index, setIndex] = useState(0);

  const gameSpecs = useMemo(() => createGameSpecs(name), [name]);
  const [newGameStatus, setNewGameStatus] = useAsyncStatus();

  const [game, setGame] = useState<SoloStrategyGame | null/*no active game*/>(null/*initially none*/);
  const [state] = useObservable('SoloStrategyGameComponent', () => game ?  game.onState$() : null, [game]);
  
  useEffect(() => {
    const load = async () => {
      await delay(Math.min(4000/*4s*/, Math.random() * 10000/*10s*/));
      
      // invalid state, no more games to play
      if(index >= gameSpecs.length) {
        setNewGameStatus('error');
        return/*nothing else to do*/;
      }/** else -- valid spec */
      
      const gameSpec = gameSpecs[index];
      setGame(new SoloStrategyGame(gameSpec));
      
      setNewGameStatus('complete');
    }

    load();
  }, [gameSpecs, index, setNewGameStatus])

  const canRestart = index < gameSpecs.length;
  const handleRestart = async () => {
    setNewGameStatus('loading');

    // stuck player indefinitely since there is no more artificial players to play
    // against
    if(!canRestart) return/*nothing else to do*/;
    setIndex(index + 1);
  };

  if(newGameStatus !== 'complete') return (
    <Flex direction='column' alignItems='center' textAlign='center' gap='32px'>
      <Text fontSize='32px' color='#555'>Buscando un contrincante</Text>
      <Spinner size='lg'/>
    </Flex>
  )

  if(state && game) return (
    <SoloStrategyGameComponent
      game={game}
      state={state}
      actorPlayerId='player'

      onRestart={handleRestart}
    />
  );
}
