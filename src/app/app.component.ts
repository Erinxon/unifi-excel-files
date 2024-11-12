import { Component, inject, viewChild } from '@angular/core';
import { MergeService } from './services/merge.service';
import { ColumnSelectorComponent } from './components/column-selector/column-selector.component';
import { ResultComponent } from './components/result/result.component';
import { UploadFilesComponent } from './components/upload-files/upload-files.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ColumnSelectorComponent, ResultComponent, UploadFilesComponent, LoadingComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private readonly mergeService: MergeService = inject(MergeService);
  private readonly loaderService: LoaderService = inject(LoaderService);

  relationColumns: string[] = [];
  availableColumns: string[] = [];
  destinationFileName: string = '';
  resultColumns: string[] = [];
  unifiedData: any[] = [];

  private destinationData: any[] = [];
  private originData: any[] = [];

  isLoading = this.loaderService.isLoading;

  uploadFilesComponent = viewChild(UploadFilesComponent);   

  async onFilesUploaded(files: { destination: File; origin: File }): Promise<void> {
    this.isLoading.set(true);

    this.destinationFileName = files.destination?.name?.replace('xlsx', '');
    this.destinationData = await this.mergeService.readExcel(files.destination);
    this.originData = await this.mergeService.readExcel(files.origin);

    this.relationColumns = Object.keys(this.destinationData[0] || {});
    this.availableColumns = Object.keys(this.originData[0] || {});
    this.isLoading.set(false);
  }

  onColumnsSelected(selection: { relationColumn: string; mergeColumns: string[] }): void {
    this.isLoading.set(true);
    this.resultColumns = this.relationColumns.concat(
      selection.mergeColumns.filter(col => !this.relationColumns.includes(col))
    );

    this.unifiedData = this.mergeService.mergeFiles(
      this.destinationData,
      this.originData,
      selection.relationColumn,
      selection.mergeColumns
    );
    this.isLoading.set(false);
  }

  reset(){
    this.uploadFilesComponent()?.reset();
    this.destinationFileName = '';
    this.destinationData = [];
    this.originData = [];
    this.relationColumns = [];
    this.availableColumns = [];
    this.unifiedData = [];
    this.resultColumns = [];
  }

}