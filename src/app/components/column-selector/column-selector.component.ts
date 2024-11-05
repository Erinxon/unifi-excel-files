import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-column-selector',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './column-selector.component.html',
  styleUrl: './column-selector.component.css'
})
export class ColumnSelectorComponent {
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
    if (this.selectedRelationColumn && this.selectedMergeColumns.length > 0) {
      this.columnsSelected.emit({
        relationColumn: this.selectedRelationColumn,
        mergeColumns: this.selectedMergeColumns,
      });
    } else {
      Swal.fire({
        title: '',
        text: 'Debe seleccionar una columna de relación y al menos una columna a unificar.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }
}
