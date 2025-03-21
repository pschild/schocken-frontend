import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable, shareReplay, switchMap, tap } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PlayerDto, PlayerService, UserDto, UserService } from '../../api/openapi';
import { Role } from '../../auth/model/role.enum';
import { PermissionsService } from '../../auth/permissions.service';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { CurrentUserDirective } from '../../shared/current-user.directive';
import { SuccessMessageService } from '../../shared/success-message.service';
import { PlayerAdministrationFormComponent } from './player-administration-form/player-administration-form.component';

@Component({
  selector: 'hop-player-administration',
  imports: [CommonModule, MatTableModule, MatSortModule, MatIconModule, MatIconButton, MatFabButton, CurrentUserDirective],
  templateUrl: './player-administration.component.html',
  styleUrl: './player-administration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerAdministrationComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['name', 'registered', 'active', 'auth0UserId', 'actions'];
  dataSource: MatTableDataSource<PlayerDto> = new MatTableDataSource<PlayerDto>();

  players$: Observable<PlayerDto[]> | null = null;
  users$: Observable<UserDto[]> | null = null;

  private playerService = inject(PlayerService);
  private userService = inject(UserService);
  private successMessageService = inject(SuccessMessageService);
  private permissionsService = inject(PermissionsService);

  @ViewChild(MatSort) sort: MatSort | null = null;

  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.players$ = this.playerService.findAll();
    this.users$ = this.userService.findAllIds().pipe(shareReplay(1));
    this.loadList();

    this.permissionsService.hasRole(Role.ADMIN).subscribe(isAdmin => {
      if (!isAdmin) {
        this.displayedColumns = this.displayedColumns.filter(col => col !== 'auth0UserId');
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadList(): void {
    this.players$!.subscribe(data => this.dataSource.data = data);
  }

  openDialog(player?: PlayerDto): void {
    this.users$!.pipe(
      switchMap(users => {
        return this.dialog.open(PlayerAdministrationFormComponent, {
          width: '90vw',
          height: '300px',
          data: {
            player,
            users,
          }
        }).afterClosed();
      }),
      filter(result => !!result),
      switchMap(formValue => player
        ? this.playerService.update(player.id, formValue).pipe(tap(() => this.successMessageService.showSuccess(`Spieler "${player.name}" aktualisiert`)))
        : this.playerService.create(formValue).pipe(tap(() => this.successMessageService.showSuccess(`Spieler "${formValue.name}" erstellt`)))
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
      tap(() => this.successMessageService.showSuccess(`Spieler "${name}" gelöscht`)),
    ).subscribe();
  }

}
