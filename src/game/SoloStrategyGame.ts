import { ActorStrategy, isActorPlayer, isActorStrategy } from "@/actor/type";

import { gameActorStrategyFactory } from "./strategies/factory";
import { IGameActorStrategy } from "./strategies/ActorStrategy";
import { GameState, GameStatus } from "./type";
import { AbstractGame, IGame } from "./Game";

// ********************************************************************************
export interface ISoloStrategyGame extends IGame {
  /** the {@link ActorStrategy} that is playing the game against the player */
  actorStrategy: IGameActorStrategy;
}

export class SoloStrategyGame extends AbstractGame implements ISoloStrategyGame {
  /** the {@link ActorStrategy} that is playing the game against the player */
  public readonly actorStrategy: IGameActorStrategy;

  // == Lifecycle =================================================================
  constructor(...args: ConstructorParameters<typeof AbstractGame>) {
    super(...args);

    const actorStrategy = this.spec.actors.find(isActorStrategy);
    const actorPlayer = this.spec.actors.find(actor => !isActorPlayer(actor));
    if(!actorStrategy) throw new Error('The game must have a strategy actor');
    if(!actorPlayer) throw new Error('The game must have a player actor');

    this.actorStrategy = gameActorStrategyFactory(actorStrategy);

    // subscribe to the state
    this.state$.subscribe(this.onState.bind(this));
  }

  // == Subscription ==============================================================
  /** called when the state changes. Executes the actor's strategy if it's the
   *  actor's turn */
  private async onState(state: GameState): Promise<void> {
    console.log('state:', state);

    switch(state.status) {
      case GameStatus.Idle:
      case GameStatus.Ended: return/*nothing else to do*/;
      case GameStatus.InProgress: {
        const { actorId } = state;
        if(this.actorStrategy.actor.id !== actorId) return/*not the actor's turn*/;

        const action = await this.actorStrategy.requestAction(state);
        this.makeAction(action);
        return/*nothing else to do*/;
      }
      default: throw new Error(`Unknown state: ${state}`);
    }
  };
}