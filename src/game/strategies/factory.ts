import { ActorStrategy, ActorStrategyType } from "@/actor/type";

import { IGameActorStrategy } from "./ActorStrategy";
import { GameActorStrategyAlwaysSplit } from "./AlwaysSplit";
import { GameActorStrategyAlwaysTake } from "./AlwaysTake";
import { GameActorStrategyRandom } from "@/game/strategies/Random";
import { GameActorStrategyProbablyTake } from "@/game/strategies/ProbablyTakes";
import { GameActorStrategySecondByBlack } from "./SecondByBlack";

// ********************************************************************************
export const gameActorStrategyFactory = (actor: ActorStrategy): IGameActorStrategy => {
  switch(actor.strategy){
    case ActorStrategyType.AlwaysSplit: return new GameActorStrategyAlwaysSplit(actor);
    case ActorStrategyType.AlwaysTake: return new GameActorStrategyAlwaysTake(actor);
    case ActorStrategyType.Random: return new GameActorStrategyRandom(actor);
    case ActorStrategyType.Probability: return new GameActorStrategyProbablyTake(actor);

    case ActorStrategyType.SecondByBlack: return new GameActorStrategySecondByBlack(actor);
    default: throw new Error(`Unknown strategy: ${actor.strategy}`);
  }
}