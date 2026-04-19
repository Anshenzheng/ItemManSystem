import { Component } from '@angular/core';
import { AppService, Toast } from './services/app.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  toasts$: Observable<Toast[]>;

  constructor(private appService: AppService) {
    this.toasts$ = this.appService.toasts$;
  }

  removeToast(toast: Toast): void {
    this.appService.removeToast(toast.id);
  }

  getToastClass(toast: Toast): string {
    return `toast-${toast.type}`;
  }

  getToastIcon(toast: Toast): string {
    switch (toast.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  }
}
