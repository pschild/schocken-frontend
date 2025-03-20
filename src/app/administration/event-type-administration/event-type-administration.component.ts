import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable, switchMap, tap } from 'rxjs';
import { filter } from 'rxjs/operators';
import { EventTypeDto, EventTypeService } from '../../api/openapi';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { PenaltyWithUnitComponent } from '../../shared/penalty-with-unit/penalty-with-unit.component';
import { ContextToLabelPipe } from '../../shared/pipes/context-to-label.pipe';
import { SuccessMessageService } from '../../shared/success-message.service';
import { EventTypeAdministrationFormComponent } from './event-type-administration-form/event-type-administration-form.component';

@Component({
  selector: 'hop-event-type-administration',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatIconModule, MatButton, MatIconButton, MatFabButton, PenaltyWithUnitComponent, ContextToLabelPipe],
  templateUrl: './event-type-administration.component.html',
  styleUrl: './event-type-administration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventTypeAdministrationComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['description', 'context', 'penalty', 'actions'];
  dataSource: MatTableDataSource<EventTypeDto> = new MatTableDataSource<EventTypeDto>();

  eventTypes$: Observable<EventTypeDto[]> | null = null;

  private eventTypeService = inject(EventTypeService);
  private successMessageService = inject(SuccessMessageService);

  @ViewChild(MatSort) sort: MatSort | null = null;

  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.eventTypes$ = this.eventTypeService.findAll();
    this.loadList();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadList(): void {
    this.eventTypes$!.subscribe(data => this.dataSource.data = data);
  }

  openDialog(eventType?: EventTypeDto): void {
    const dialogRef = this.dialog.open(EventTypeAdministrationFormComponent, {
      width: '90vw',
      height: '500px',
      data: {
        eventType,
      }
    });
    dialogRef.afterClosed().pipe(
      filter(result => !!result),
      switchMap(formValue => eventType
        ? this.eventTypeService.update(eventType.id, formValue).pipe(tap(() => this.successMessageService.showSuccess(`Ereignis "${eventType.description}" aktualisiert`)))
        : this.eventTypeService.create(formValue).pipe(tap(() => this.successMessageService.showSuccess(`Ereignis "${formValue.description}" erstellt`)))
      ),
      tap(() => this.loadList()),
    ).subscribe();
  }

  openConfirmation(id: string, description: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `Ereignis löschen`,
        message: `Beim Löschen eines Ereignisses bleiben Strafen erhalten.\n\nBist du sicher, dass du das Ereignis "${description}" löschen möchtest?`,
      }
    });
    dialogRef.afterClosed().pipe(
      filter(result => !!result),
      switchMap(() => this.eventTypeService.remove(id)),
      tap(() => this.loadList()),
      tap(() => this.successMessageService.showSuccess(`Ereignis "${name}" gelöscht`)),
    ).subscribe();
  }
}
