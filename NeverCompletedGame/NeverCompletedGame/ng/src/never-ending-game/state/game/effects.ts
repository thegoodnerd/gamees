import { RxEventListenerService } from './../../service/rx.event-listener.service';
import { GameId } from './../../model/game.interface';
import { LocalStorageService } from './../../service/local-storage-service.service';
import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { catchError, concatMap, map, filter, tap, switchMap, throttle } from 'rxjs/operators';

import * as gameAction from './actions';

import { RxNeverCompletedGameService } from '../../service';
import { IGame } from '../../model';

@Injectable()
export class GameEffects {

  constructor(
    private actions$: Actions,
    private gameService: RxNeverCompletedGameService,
    private localStorage: LocalStorageService,
    private eventListener: RxEventListenerService
  ) {
  }

  @Effect()
  openGame$: Observable<Action> = this.actions$.pipe(
    ofType<gameAction.OpenGame>(
      gameAction.GameActionTypes.OPEN_GAME
    ),
    concatMap((action: gameAction.OpenGame) =>
      this.gameService.openGame().pipe(
        map((gameId: GameId) => new gameAction.OpenGameSuccess(gameId)),
        catchError(err => {
          return of(new gameAction.OpenGameFail(err));
        })
      )
    )
  );

  @Effect()
  openGameSuccess$: Observable<Action> = this.actions$.pipe(
    ofType<gameAction.OpenGameSuccess>(
      gameAction.GameActionTypes.OPEN_GAME_SUCCESS
    ),
    concatMap((action: gameAction.OpenGameSuccess) => {
       this.localStorage.storeOpenGameId(action.payload);
       return of(new gameAction.LoadGame(action.payload));
    })
  );

  @Effect()
  initGame$: Observable<Action> = this.actions$.pipe(
    ofType<gameAction.InitGame>(
      gameAction.GameActionTypes.INIT_GAME
    ),
    concatMap((action: gameAction.InitGame) => {
      console.log('init action');
     if (this.localStorage.containsOpenGameId) {
       return of(new gameAction.LoadGame(this.localStorage.getOpenGameId()));
     } else {
       return of(new gameAction.OpenGame());
     }
    })
  );

  @Effect()
  resetGame$: Observable<Action> = this.actions$.pipe(
    ofType<gameAction.ResetGame>(
      gameAction.GameActionTypes.RESET_GAME
    ),
    concatMap((action: gameAction.ResetGame) => {
      this.localStorage.resetOpenGame();
      return of(new gameAction.InitGame());
    })
  );

  @Effect()
  loadGame$: Observable<Action> = this.actions$.pipe(
    ofType<gameAction.LoadGame>(
      gameAction.GameActionTypes.LOAD_GAME
    ),
    concatMap((action: gameAction.LoadGame) =>
      this.gameService.fetchGame(action.payload).pipe(
        map((game: IGame) => new gameAction.LoadGameSuccess(game)),
        catchError(err => {
          return of(new gameAction.LoadGameFail(err));
        })
      )
    )
  );

  @Effect()
  makeGuess$: Observable<Action> = this.actions$.pipe(
    ofType<gameAction.MakeGuess>(
      gameAction.GameActionTypes.MAKE_GUESS
    ),
    concatMap((action: gameAction.MakeGuess) =>
      this.gameService.makeGuess(action.payload.gameId, action.payload.solution).pipe(
        map((gameId: GameId) => new gameAction.MakeGuessSuccess(gameId)),
        catchError(err => {
          return of(new gameAction.MakeGuessFail(err));
        })
      )
    )
  );


  @Effect()
  loadGameSuccess$: Observable<Action> = this.actions$.pipe(
    ofType<gameAction.LoadGameSuccess>(
      gameAction.GameActionTypes.LOAD_GAME_SUCCESS
    ),
    concatMap((action: gameAction.LoadGameSuccess) =>
      this.eventListener.startConnection(action.payload.id).pipe(
        map((b) => b ? {type: 'success'} : {type: 'fail'})
      )
    )
  );



}
