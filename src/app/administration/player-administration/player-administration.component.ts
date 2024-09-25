import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable, switchMap, tap } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PlayerDto, PlayerService } from '../../api/openapi';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { PlayerAdministrationFormComponent } from './player-administration-form/player-administration-form.component';

@Component({
  selector: 'hop-player-administration',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatIconModule, MatButton, MatIconButton, MatFabButton],
  templateUrl: './player-administration.component.html',
  styleUrl: './player-administration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerAdministrationComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['name', 'registered', 'active', 'actions'];
  dataSource: MatTableDataSource<PlayerDto> = new MatTableDataSource<PlayerDto>();

  players$: Observable<PlayerDto[]> | null = null;

  private playerService = inject(PlayerService);

  @ViewChild(MatSort) sort: MatSort | null = null;

  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.players$ = this.playerService.findAll();
    this.loadList();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadList(): void {
    this.players$!.subscribe(data => this.dataSource.data = data);
  }

  openDialog(player?: PlayerDto): void {
    const dialogRef = this.dialog.open(PlayerAdministrationFormComponent, {
      minWidth: 400,
      height: '300px',
      data: {
        player,
      }
    });
    dialogRef.afterClosed().pipe(
      filter(result => !!result),
      switchMap(formValue => player
        ? this.playerService.update(player.id, formValue)
        : this.playerService.create(formValue)
      ),
      tap(() => this.loadList()),
    ).subscribe();
  }

  openConfirmation(id: string, name: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `Spieler löschen`,
        message: `Beim Löschen eines Spielers bleiben dessen Ereignisse oder Teilnahmen erhalten. Der Spieler ist bei neuen Spielen jedoch nicht mehr auswählbar.\n\nBist du sicher, dass du "${name}" löschen möchtest?`,
      }
    });
    dialogRef.afterClosed().pipe(
      filter(result => !!result),
      switchMap(() => this.playerService.remove(id)),
      tap(() => this.loadList()),
    ).subscribe();
  }

}
