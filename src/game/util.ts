import { ActorIdentifier } from "@/actor/type";
import { GameActionType, GamePoints, GameSpec, GameStateHistory } from "./type";

// ********************************************************************************
export const getGameActionPoints = (spec: GameSpec, action: GameActionType, otherAction: GameActionType): GamePoints => {
  if(action === GameActionType.Split && otherAction === GameActionType.Split) return spec.splitSplitPoints;
  if(action === GameActionType.Split && otherAction === GameActionType.Take) return spec.splitTakePoints;
  if(action === GameActionType.Take && otherAction === GameActionType.Split) return spec.takeSplitPoints;
  return spec.takeTakePoints;
}

/** return the points received on the last completed round */
export const getLastWonPoints = (spec: GameSpec, history: GameStateHistory, actorId: ActorIdentifier): GamePoints | null/*no points yet*/ => {
  // NOTE: last round could be not complete (i.e. the other player has not played yet)
  //       so this looks for the last and second last complete round to get the
  //       points
  for(let i = history.length - 1; i >= 0; i--){
    const round = history[i];
    // determinate the points based on the actor provided
    if(round[1] === null) continue/*nothing to do*/;

    const [a, b] = round;
    if(a.actorId === actorId) return getGameActionPoints(spec, a.action, b.action);
    if(b.actorId === actorId) return getGameActionPoints(spec, b.action, a.action);
  }

  return null/*no points yet*/;
}

export const getOtherActorId = (spec: GameSpec, actorId: ActorIdentifier): ActorIdentifier => {
  return spec.actors.find(actor => actor.id !== actorId)!.id;
}

export const getActorActions = (actorId: ActorIdentifier, history: GameStateHistory): GameActionType[] => {
  return history
    .map(([a, b]) => a.actorId === actorId ? a.action : b ? b.action : null)
    .filter(action => action !== null) as GameActionType[];
}