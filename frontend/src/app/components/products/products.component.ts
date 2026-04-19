import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../models/models';
import { ProductService } from '../services/product.service';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchKeyword = '';
  loading = false;
  showModal = false;
  editingProduct: Product | null = null;
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private appService: AppService
  ) {
    this.productForm = this.fb.group({
      productCode: ['', [Validators.required]],
      name: ['', [Validators.required]],
      category: [''],
      unit: ['个'],
      purchasePrice: [0, [Validators.min(0)]],
      sellingPrice: [0, [Validators.min(0)]],
      stock: [0, [Validators.min(0)]],
      lowStockThreshold: [10, [Validators.min(0)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = [...data];
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
           p.productCode.toLowerCase().includes(keyword) ||
           (p.category && p.category.toLowerCase().includes(keyword))
    );
  }

  openAddModal(): void {
    this.editingProduct = null;
    this.productForm.reset({
      unit: '个',
      purchasePrice: 0,
      sellingPrice: 0,
      stock: 0,
      lowStockThreshold: 10
    });
    this.showModal = true;
  }

  openEditModal(product: Product): void {
    this.editingProduct = product;
    this.productForm.patchValue({
      productCode: product.productCode,
      name: product.name,
      category: product.category || '',
      unit: product.unit || '个',
      purchasePrice: product.purchasePrice || 0,
      sellingPrice: product.sellingPrice || 0,
      stock: product.stock || 0,
      lowStockThreshold: product.lowStockThreshold || 10,
      description: product.description || ''
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingProduct = null;
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const productData: Product = this.productForm.value;

    if (this.editingProduct) {
      this.productService.updateProduct(this.editingProduct.id!, productData).subscribe({
        next: () => {
          this.appService.success('商品更新成功');
          this.closeModal();
          this.loadProducts();
        },
        error: (err) => {
          this.appService.error(err.error?.message || '更新商品失败');
        }
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.appService.success('商品创建成功');
          this.closeModal();
          this.loadProducts();
        },
        error: (err) => {
          this.appService.error(err.error?.message || '创建商品失败');
        }
      });
    }
  }

  deleteProduct(product: Product): void {
    if (!confirm(`确定要删除商品「${product.name}」吗？`)) {
      return;
    }

    this.productService.deleteProduct(product.id!).subscribe({
      next: () => {
        this.appService.success('商品删除成功');
        this.loadProducts();
      },
      error: (err) => {
        this.appService.error(err.error?.message || '删除商品失败');
      }
    });
  }

  isLowStock(product: Product): boolean {
    return (product.stock || 0) <= (product.lowStockThreshold || 10);
  }

  getStockBadgeClass(product: Product): string {
    if (this.isLowStock(product)) {
      return 'badge-danger';
    }
    return 'badge-success';
  }
}
