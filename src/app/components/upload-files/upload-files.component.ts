import { Component, EventEmitter, Output } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-files',
  standalone: true,
  imports: [],
  templateUrl: './upload-files.component.html',
  styleUrl: './upload-files.component.css'
})
export class UploadFilesComponent {
  fileDestino: File | null = null;
  fileOrigen: File | null = null;

  @Output() filesUploaded = new EventEmitter<{ destino: File, origen: File }>();

  onFileSelected(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (type === 'destino') {
        this.fileDestino = input.files[0];
      } else {
        this.fileOrigen = input.files[0];
      }
    }
  }

  nextStep(): void {
    if (this.fileDestino && this.fileOrigen) {
      this.filesUploaded.emit({ destino: this.fileDestino, origen: this.fileOrigen });
    } else {
      Swal.fire({
        title: '',
        text: 'Debe seleccionar ambos archivos antes de continuar.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }
  
}