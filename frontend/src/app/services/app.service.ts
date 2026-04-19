import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Notification } from '../models/models';
import { InventoryService } from './inventory.service';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private toastSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastSubject.asObservable();
  private toastIdCounter = 0;

  private notificationSubject = new BehaviorSubject<Notification>({ hasLowStock: false, lowStockCount: 0 });
  notifications$ = this.notificationSubject.asObservable();

  constructor(private inventoryService: InventoryService) {
    this.startNotificationPolling();
  }

  private startNotificationPolling(): void {
    timer(0, 30000).pipe(
      switchMap(() => this.inventoryService.getNotifications()),
      tap((notification) => this.notificationSubject.next(notification))
    ).subscribe();
  }

  showToast(type: 'success' | 'error' | 'warning' | 'info', message: string): void {
    const toast: Toast = {
      id: ++this.toastIdCounter,
      type,
      message
    };

    const currentToasts = this.toastSubject.getValue();
    this.toastSubject.next([...currentToasts, toast]);

    setTimeout(() => {
      this.removeToast(toast.id);
    }, 3000);
  }

  removeToast(id: number): void {
    const currentToasts = this.toastSubject.getValue();
    this.toastSubject.next(currentToasts.filter(t => t.id !== id));
  }

  success(message: string): void {
    this.showToast('success', message);
  }

  error(message: string): void {
    this.showToast('error', message);
  }

  warning(message: string): void {
    this.showToast('warning', message);
  }

  info(message: string): void {
    this.showToast('info', message);
  }
}
