import { ActorStrategy, ActorStrategyType } from "@/actor/type";

import { IGameActorStrategy } from "./ActorStrategy";
import { GameActorStrategyAlwaysSplit } from "./AlwaysSplit";
import { GameActorStrategyAlwaysTake } from "./AlwaysTake";

// ********************************************************************************
export const gameActorStrategyFactory = (actor: ActorStrategy): IGameActorStrategy => {
  switch(actor.strategy){
    case ActorStrategyType.AlwaysSplit: return new GameActorStrategyAlwaysSplit(actor);
    case ActorStrategyType.AlwaysTake: return new GameActorStrategyAlwaysTake(actor);
    default: throw new Error(`Unknown strategy: ${actor.strategy}`);
  }
}