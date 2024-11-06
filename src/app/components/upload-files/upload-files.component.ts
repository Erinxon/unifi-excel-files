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
  destinationFile: File | null = null;
  fileOrigin: File | null = null;

  @Output() filesUploaded = new EventEmitter<{ destination: File, origin: File }>();

  onFileSelected(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (type === 'destination') {
        this.destinationFile = input.files[0];
      } else {
        this.fileOrigin = input.files[0];
      }
    }
  }

  nextStep(): void {
    if (this.destinationFile && this.fileOrigin) {
      this.filesUploaded.emit({ destination: this.destinationFile, origin: this.fileOrigin });
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