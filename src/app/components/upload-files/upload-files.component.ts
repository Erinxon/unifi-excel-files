import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { SweetalertService } from '../../services/sweetalert.service';
import {  FormsModule } from '@angular/forms';
@Component({
  selector: 'app-upload-files',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './upload-files.component.html',
  styleUrl: './upload-files.component.css'
})
export class UploadFilesComponent {
  private readonly sweetalert: SweetalertService = inject(SweetalertService);
  
  destinationFile = signal<File>(null!);
  fileOrigin = signal<File>(null!);

  filesUploaded = output<{ destination: File, origin: File }>();

  processed = computed(() => this.destinationFile() !== null && this.fileOrigin() !== null);

  constructor(){
    effect(() => {
      if(this.destinationFile() !== null && this.fileOrigin() !== null){
        this.processFiles();
      }
    });
  }

  onFileSelected(event: any, type: string): void {
    const file = event.target.files[0] as File;

    if(!file){
      return;
    }

    if(file?.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
      this.sweetalert.warning({
        title: 'Archivo no válido',
        text: 'Sólo se permiten archivos de Excel'
      });
      return;
    }

    if (type === 'destination') {
      this.destinationFile.set(file);
    } else {
      this.fileOrigin.set(file);
    }
    event.target.value = '';
  }

  processFiles(): void {
    if(!this.destinationFile() || !this.fileOrigin()){
      return;
    }
    this.filesUploaded.emit({ destination: this.destinationFile(), origin: this.fileOrigin() });
  }

  reset(){
    this.destinationFile.set(null!);
    this.fileOrigin.set(null!);
  }
  
}