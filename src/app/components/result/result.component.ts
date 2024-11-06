import { Component, inject, Input } from '@angular/core';
import * as XLSX from 'xlsx';
import { LoadingComponent } from '../loading/loading.component';
import { CommonModule, NgClass } from '@angular/common';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [LoadingComponent, NgClass, CommonModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent {
  private readonly loaderService: LoaderService = inject(LoaderService);
  
  @Input() destinationFileName: string = '';
  @Input() resultColumns: string[] = []; 
  @Input() unifiedData: any[] = []; 

  downloadExcel(): void {
    this.loaderService.isLoading.set(true);
    const worksheet = XLSX.utils.json_to_sheet(this.unifiedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultados Unificados');

    XLSX.writeFile(workbook, `${this.destinationFileName}-${new Date().getTime()}.xlsx`);
    this.loaderService.isLoading.set(false);
  }
}