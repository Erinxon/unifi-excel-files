import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MergeService } from './services/merge.service';
import { ColumnSelectorComponent } from './components/column-selector/column-selector.component';
import { ResultComponent } from './components/result/result.component';
import { UploadFilesComponent } from './components/upload-files/upload-files.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LoaderService } from './services/loader.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ColumnSelectorComponent, ResultComponent, UploadFilesComponent, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly mergeService: MergeService = inject(MergeService);
  private readonly loaderService: LoaderService = inject(LoaderService);

  relationColumns: string[] = [];
  availableColumns: string[] = [];
  resultColumns: string[] = [];
  unifiedData: any[] = [];

  private destinoData: any[] = [];
  private origenData: any[] = [];

  isLoading = this.loaderService.isLoading;

  async onFilesUploaded(files: { destino: File; origen: File }): Promise<void> {
    this.loaderService.isLoading.set(true);
    this.destinoData = await this.mergeService.readExcel(files.destino);
    this.origenData = await this.mergeService.readExcel(files.origen);

    this.relationColumns = Object.keys(this.destinoData[0] || {});
    this.availableColumns = Object.keys(this.origenData[0] || {});
    this.loaderService.isLoading.set(false);
  }

  onColumnsSelected(selection: { relationColumn: string; mergeColumns: string[] }): void {
    try {
      this.loaderService.isLoading.set(true);
      this.resultColumns = this.relationColumns.concat(
        selection.mergeColumns.filter(col => !this.relationColumns.includes(col))
      );

      this.unifiedData = this.mergeService.mergeFiles(
        this.destinoData,
        this.origenData,
        selection.relationColumn,
        selection.mergeColumns
      );
      this.loaderService.isLoading.set(false);
    } catch (error) {
      this.loaderService.isLoading.set(false);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al unificar los archivos.',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo'
      });
    }
  }
}