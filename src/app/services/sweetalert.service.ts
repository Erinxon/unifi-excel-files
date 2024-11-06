import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetalertService {
  warning(params: {
    title?: string,
    text?: string,
    confirmButtonText?: string
  }){
    Swal.fire({
      title: params.title,
      text: params.text,
      icon: 'warning',
      confirmButtonText: params.confirmButtonText ?? 'OK'
    });
  }
}