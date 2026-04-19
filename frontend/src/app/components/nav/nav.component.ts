import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AppService } from '../services/app.service';
import { Notification } from '../models/models';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  currentRoute = '/dashboard';
  notifications: Notification = { hasLowStock: false, lowStockCount: 0 };

  navItems = [
    { path: '/dashboard', label: '仪表盘', icon: '📊' },
    { path: '/products', label: '商品管理', icon: '📦' },
    { path: '/sales', label: '开单卖货', icon: '🛒' },
    { path: '/inventory', label: '库存管理', icon: '📋' },
    { path: '/orders', label: '订单历史', icon: '📝' }
  ];

  constructor(
    private router: Router,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });

    this.appService.notifications$.subscribe(
      (notifications) => {
        this.notifications = notifications;
      }
    );
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.currentRoute === path || this.currentRoute.startsWith(path + '/');
  }
}
