import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product, Order, OrderItem } from '../models/models';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { AppService } from '../services/app.service';

interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  cartItems: CartItem[] = [];
  searchKeyword = '';
  loading = false;
  submitting = false;
  showProductSearch = false;

  orderForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private orderService: OrderService,
    private appService: AppService
  ) {
    this.orderForm = this.fb.group({
      customerName: [''],
      customerPhone: [''],
      remark: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data.filter(p => (p.stock || 0) > 0);
        this.filteredProducts = [...this.products];
        this.loading = false;
      },
      error: () => {
        this.appService.error('加载商品列表失败');
        this.loading = false;
      }
    });
  }

  searchProducts(): void {
    if (!this.searchKeyword.trim()) {
      this.filteredProducts = [...this.products];
      return;
    }

    const keyword = this.searchKeyword.toLowerCase();
    this.filteredProducts = this.products.filter(
      p => p.name.toLowerCase().includes(keyword) ||
           p.productCode.toLowerCase().includes(keyword)
    );
  }

  toggleProductSearch(): void {
    this.showProductSearch = !this.showProductSearch;
    if (this.showProductSearch) {
      this.searchKeyword = '';
      this.filteredProducts = [...this.products];
    }
  }

  addToCart(product: Product): void {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);

    if (existingItem) {
      if (existingItem.quantity >= (product.stock || 0)) {
        this.appService.warning(`库存不足，当前库存：${product.stock}`);
        return;
      }
      existingItem.quantity++;
      existingItem.subtotal = existingItem.unitPrice * existingItem.quantity;
    } else {
      this.cartItems.push({
        product,
        quantity: 1,
        unitPrice: product.sellingPrice || 0,
        subtotal: product.sellingPrice || 0
      });
    }

    this.searchKeyword = '';
    this.filteredProducts = [...this.products];
  }

  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
  }

  updateQuantity(item: CartItem, change: number): void {
    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
      const index = this.cartItems.indexOf(item);
      if (index > -1) {
        this.cartItems.splice(index, 1);
      }
      return;
    }

    if (newQuantity > (item.product.stock || 0)) {
      this.appService.warning(`库存不足，当前库存：${item.product.stock}`);
      return;
    }

    item.quantity = newQuantity;
    item.subtotal = item.unitPrice * item.quantity;
  }

  setQuantity(item: CartItem, event: any): void {
    const value = parseInt(event.target.value, 10);

    if (isNaN(value) || value <= 0) {
      item.quantity = 1;
    } else if (value > (item.product.stock || 0)) {
      this.appService.warning(`库存不足，当前库存：${item.product.stock}`);
      item.quantity = item.product.stock || 1;
    } else {
      item.quantity = value;
    }

    item.subtotal = item.unitPrice * item.quantity;
  }

  getTotalAmount(): number {
    return this.cartItems.reduce((total, item) => total + item.subtotal, 0);
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  clearCart(): void {
    if (this.cartItems.length === 0) {
      return;
    }

    if (confirm('确定要清空购物车吗？')) {
      this.cartItems = [];
    }
  }

  submitOrder(): void {
    if (this.cartItems.length === 0) {
      this.appService.warning('请先添加商品到购物车');
      return;
    }

    this.submitting = true;

    const orderItems: OrderItem[] = this.cartItems.map(item => ({
      product: { id: item.product.id } as Product,
      productCode: item.product.productCode,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal
    }));

    const order: Order = {
      ...this.orderForm.value,
      orderItems
    };

    this.orderService.createOrder(order).subscribe({
      next: (createdOrder) => {
        this.appService.success(`订单创建成功！订单号：${createdOrder.orderNo}`);
        this.cartItems = [];
        this.orderForm.reset();
        this.loadProducts();
        this.submitting = false;
      },
      error: (err) => {
        this.appService.error(err.error?.message || '创建订单失败');
        this.submitting = false;
      }
    });
  }

  isLowStock(product: Product): boolean {
    return (product.stock || 0) <= (product.lowStockThreshold || 10);
  }
}
