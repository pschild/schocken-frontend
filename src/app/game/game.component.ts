import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CreateGameDto, EventDetailDto, GameDetailDto, RoundDetailDto } from '../api/openapi';
import { PlaceTypeToLabelPipe } from '../shared/pipes/place-type-to-label.pipe';
import { SuccessMessageService } from '../shared/success-message.service';
import { GameState } from './game.state';
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
  readonly destroyRef = inject(DestroyRef);

  PlaceTypeEnum = PlaceTypeEnum;

  private state = inject(GameState);
  private route = inject(ActivatedRoute);
  private successMessageService = inject(SuccessMessageService);

  gameDetails$: Observable<GameDetailDto | null> = this.state.gameDetails$;
  rounds$: Observable<RoundDetailDto[]> = this.state.rounds$;
  gameEvents$: Observable<EventDetailDto[]> = this.state.gameEvents$;
  roundEvents$: Observable<EventDetailDto[]> = this.state.roundEvents$;
  roundEventsByRound$: (roundId: string) => Observable<EventDetailDto[]> = this.state.roundEventsByRound$;
  roundsWithEvents$: Observable<(RoundDetailDto & { events: EventDetailDto[] })[]> = this.state.roundsWithEvents$;

  ngOnInit() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({ id }) => this.state.init(id));
  }

  openGameDetailsDialog(): void {
    this.state.openGameDetailsDialog();
  }
}
