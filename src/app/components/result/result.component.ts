import { Component, HostListener, inject, input } from '@angular/core';
import * as XLSX from 'xlsx';
import { LoadingComponent } from '../loading/loading.component';
import { NgClass } from '@angular/common';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [LoadingComponent, NgClass],
  templateUrl: './result.component.html'
})
export class ResultComponent {
  private readonly loaderService: LoaderService = inject(LoaderService);
  
  destinationFileName = input<string>('')
  resultColumns = input<string[]>([]); 
  unifiedData = input<any[]>([]); 

  displayedData: any[] = [];
  private currentPage: number = 1;
  private pageSize: number = 20; 

  ngOnInit() {
    this.loadMoreData();
  }

  loadMoreData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const newItems = this.unifiedData().slice(startIndex, startIndex + this.pageSize);
    this.displayedData = [...this.displayedData, ...newItems];
    this.currentPage++;
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    const threshold = 100; 
    const position = event.target.scrollTop + event.target.offsetHeight;
    const height = event.target.scrollHeight;

    if (position > height - threshold) {
      this.loadMoreData();
    }
  }

  downloadExcel(): void {
    this.loaderService.isLoading.set(true);
    const worksheet = XLSX.utils.json_to_sheet(this.unifiedData());
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultados Unificados');

    XLSX.writeFile(workbook, `${this.destinationFileName()}-${new Date().getTime()}.xlsx`);
    this.loaderService.isLoading.set(false);
  }
}