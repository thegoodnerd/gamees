
export type GameId = string;

export interface IGuess {

  readonly guess: string;

  readonly guessStatus: string;

  readonly guessTime: Date;

}

export interface IGame {
  readonly id: GameId;

  readonly level: number;

  readonly question: string;

  readonly score: number;

  readonly completed: boolean;
}
