import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SweetalertService } from '../../services/sweetalert.service';

@Component({
  selector: 'app-column-selector',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './column-selector.component.html',
  styleUrl: './column-selector.component.css'
})
export class ColumnSelectorComponent {
  private readonly sweetalert: SweetalertService = inject(SweetalertService);

  @Input() relationColumns: string[] = []; 
  @Input() availableColumns: string[] = []; 
  @Output() columnsSelected = new EventEmitter<{ relationColumn: string, mergeColumns: string[] }>();

  selectedRelationColumn: string = '';
  selectedMergeColumns: string[] = [];

  onColumnSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const column = input.value;
    if (input.checked) {
      this.selectedMergeColumns.push(column);
    } else {
      this.selectedMergeColumns = this.selectedMergeColumns.filter(col => col !== column);
    }
  }

  processFiles(): void {
    this.columnsSelected.next({
      relationColumn: '',
      mergeColumns: []
    });
    
    if(!this.selectedRelationColumn || !this.selectedMergeColumns?.length){
      this.sweetalert.warning({
        text: 'Debe seleccionar una columna de relación y al menos una columna a unificar.'
      });
      return;
    }

    if(!this.availableColumns?.find(column => column == this.selectedRelationColumn)){
      this.sweetalert.warning({
        text: 'Columna de relación no se encontra en las columnas del archivo origen'
      });
      return;
    }

    this.columnsSelected.emit({
      relationColumn: this.selectedRelationColumn,
      mergeColumns: this.selectedMergeColumns,
    });
  }
}