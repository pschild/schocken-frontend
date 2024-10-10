import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import confetti from 'canvas-confetti';
import { Observable } from 'rxjs';
import { CreateGameDto, EventDto, GameDetailDto, PlayerDto, RoundDetailDto } from '../api/openapi';
import { PenaltyWithUnitComponent } from '../shared/penalty-with-unit/penalty-with-unit.component';
import { PlaceTypeToLabelPipe } from '../shared/pipes/place-type-to-label.pipe';
import { SuccessMessageService } from '../shared/success-message.service';
import { EventListComponent } from './event-list/event-list.component';
import { GameState } from './game.state';
import { RoundComponent } from './round/round.component';
import PlaceTypeEnum = CreateGameDto.PlaceTypeEnum;
import ContextEnum = EventDto.ContextEnum;

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
    MatBadgeModule,
    PlaceTypeToLabelPipe,
    PenaltyWithUnitComponent,
    RoundComponent,
    EventListComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {

  readonly dialog = inject(MatDialog);
  readonly destroyRef = inject(DestroyRef);

  PlaceTypeEnum = PlaceTypeEnum;
  Context = ContextEnum;

  private state = inject(GameState);
  private route = inject(ActivatedRoute);
  private successMessageService = inject(SuccessMessageService);

  gameDetails$: Observable<GameDetailDto | null> = this.state.gameDetails$;
  rounds$: Observable<RoundDetailDto[]> = this.state.rounds$;
  players$: Observable<PlayerDto[]> = this.state.players$;
  playersForGameEvents$: Observable<PlayerDto[]> = this.state.playersForGameEvents$;

  ngOnInit() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({ id }) => this.state.init(id));
  }

  openGameDetailsDialog(): void {
    this.state.openGameDetailsDialog();
  }

  handleEventRemove(id: string): void {
    console.log('remove game event', id);
  }

  handleFinalistsChange(payload: { roundId: string; finalistIds: string[] }): void {
    this.state.updateFinalists(payload);
  }

  handleRoundRemove(id: string): void {
    console.log('remove round', id);
  }

  celebrate(e: MouseEvent) {
    confetti({
      shapes: ['circle'],
      particleCount: 200,
      startVelocity: 30,
      spread: 120,
      origin: {
        x: e.x / window.innerWidth,
        y: e.y / window.innerHeight
      }
    });
  }
}
