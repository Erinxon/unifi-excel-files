import { Component } from '@angular/core';
@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div class="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
    </div>
  `
})
export class LoadingComponent {
}