// merge.service.ts
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class MergeService {
  constructor() {}

  async readExcel(file: File): Promise<any[]> {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    return XLSX.utils.sheet_to_json(worksheet);
  }

  mergeFiles(destino: any[], origen: any[], relationColumn: string, mergeColumns: string[]): any[] {
    const mergedData = destino.map(destRow => {
      const relatedRow = origen.find(origRow => origRow[relationColumn] === destRow[relationColumn]);
      if (relatedRow) {
        mergeColumns.forEach(col => {
          destRow[col] = relatedRow[col] || destRow[col];
        });
      }
      return destRow;
    });
    return mergedData;
  }
}