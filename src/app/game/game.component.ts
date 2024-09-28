import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CreateGameDto, GameDetailDto, GameService, PlayerService } from '../api/openapi';
import { PlaceTypeToLabelPipe } from '../shared/pipes/place-type-to-label.pipe';
import { SuccessMessageService } from '../shared/success-message.service';
import { GameDetailsFormComponent } from './game-details-form/game-details-form.component';
import PlaceTypeEnum = CreateGameDto.PlaceTypeEnum;

@Component({
  selector: 'hop-game',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButton,
    MatIconButton,
    PlaceTypeToLabelPipe
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {

  readonly dialog = inject(MatDialog);

  PlaceTypeEnum = PlaceTypeEnum;

  game$: Observable<GameDetailDto> | null = null;

  private route = inject(ActivatedRoute);
  private gameService = inject(GameService);
  private playerService = inject(PlayerService);
  private successMessageService = inject(SuccessMessageService);

  ngOnInit() {
    this.game$ = this.route.params.pipe(
      switchMap(({ id }) => this.gameService.getDetails(id)),
    );
  }

  openGameDetailsDialog(gameDetails: GameDetailDto): void {
    this.playerService.findAll(true).pipe(
      switchMap(activePlayers => {
        return this.dialog.open(GameDetailsFormComponent, {
          minWidth: 500,
          height: '350px',
          data: {
            gameDetails,
            activePlayers,
          }
        }).afterClosed();
      }),
      filter(result => !!result),
      switchMap(({ type, hostedById, placeOfAwayGame, excludeFromStatistics }) => this.gameService.update(gameDetails.id, { placeType: type, hostedById, placeOfAwayGame, excludeFromStatistics })),
      tap(() => this.successMessageService.showSuccess(`Spiel aktualisiert`)),
    ).subscribe();
  }
}
