import { GameActionType } from "@/game/type";

// ********************************************************************************
// Returns a random choice
export function randomAction(probability: number, action: GameActionType = GameActionType.Take): GameActionType {
  const randomChance = Math.random();
  if(randomChance < probability) return action;
  if(action === GameActionType.Take) return GameActionType.Split;
  else return GameActionType.Take;
}

