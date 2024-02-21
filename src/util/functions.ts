import { GameActionType } from "@/game/type";

// Returns a random choice
export function randomChoice<GameActionType>(probability: number): GameActionType[keyof GameActionType] {

    const randomChance = Math.random();
    if (randomChance <= probability){
        return GameActionType.Take as GameActionType[keyof GameActionType];
    }else {
        return GameActionType.Split as GameActionType[keyof GameActionType];
    }
}