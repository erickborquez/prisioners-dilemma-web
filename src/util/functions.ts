import { GameActionType } from "@/game/type";

// ********************************************************************************
// Returns a random choice
export function randomChoice(probability: number): GameActionType {
  const randomChance = Math.random();
  if(randomChance <= probability){
    return GameActionType.Take;
  } else {
    return GameActionType.Split;
  }
}