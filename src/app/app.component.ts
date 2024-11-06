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

  private destinationData: any[] = [];
  private originData: any[] = [];

  isLoading = this.loaderService.isLoading;

  async onFilesUploaded(files: { destination: File; origin: File }): Promise<void> {
    this.loaderService.isLoading.set(true);
    this.destinationData = await this.mergeService.readExcel(files.destination);
    this.originData = await this.mergeService.readExcel(files.origin);

    this.relationColumns = Object.keys(this.destinationData[0] || {});
    this.availableColumns = Object.keys(this.originData[0] || {});
    this.loaderService.isLoading.set(false);
  }

  onColumnsSelected(selection: { relationColumn: string; mergeColumns: string[] }): void {
    try {
      this.loaderService.isLoading.set(true);
      this.resultColumns = this.relationColumns.concat(
        selection.mergeColumns.filter(col => !this.relationColumns.includes(col))
      );

      this.unifiedData = this.mergeService.mergeFiles(
        this.destinationData,
        this.originData,
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