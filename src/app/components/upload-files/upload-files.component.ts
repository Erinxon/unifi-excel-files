import { Component, EventEmitter, inject, Output } from '@angular/core';
import { SweetalertService } from '../../services/sweetalert.service';

@Component({
  selector: 'app-upload-files',
  standalone: true,
  imports: [],
  templateUrl: './upload-files.component.html',
  styleUrl: './upload-files.component.css'
})
export class UploadFilesComponent {
  private readonly sweetalert: SweetalertService = inject(SweetalertService);
  
  destinationFile: File | null = null;
  fileOrigin: File | null = null;

  @Output() filesUploaded = new EventEmitter<{ destination: File, origin: File }>();

  onFileSelected(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;

    if(!input?.files){
      return;
    }

    const file = input.files[0];

    if(file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
      this.sweetalert.warning({
        title: 'Archivo no válido',
        text: 'Sólo se permiten archivos de Excel'
      });
      return;
    }

    if (type === 'destination') {
      this.destinationFile = file;
    } else {
      this.fileOrigin = file;
    }
  }

  nextStep(): void {
    if(!this.destinationFile || !this.fileOrigin){
      this.sweetalert.warning({
        text: 'Debe seleccionar ambos archivos antes de continuar.'
      });
      return;
    }
    this.filesUploaded.emit({ destination: this.destinationFile, origin: this.fileOrigin });
  }
  
}