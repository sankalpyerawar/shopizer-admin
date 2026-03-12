import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as Papa from 'papaparse';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'ngx-product-import',
  templateUrl: './product-import.component.html',
  styleUrls: ['./product-import.component.scss']
})
export class ProductImportComponent implements OnInit {

  selectedFile: File | null = null;
  parsedData: any[] = [];
  validationErrors: any[] = [];
  importMode = 'CREATE_ONLY';
  importResult: any = null;
  isValidating = false;
  isImporting = false;
  previewRows: any[] = [];

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router,
  ) {}

  ngOnInit() {}

  downloadTemplate() {
    this.productService.downloadImportTemplate().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'product-import-template.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  onFileSelected(event: any) {
    const file = event.target?.files?.[0] || event;
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      this.toastr.error('Only CSV files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.toastr.error('File size must be under 5MB');
      return;
    }
    this.selectedFile = file;
    this.importResult = null;
    this.parseFile(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files?.[0];
    if (file) this.onFileSelected(file);
  }

  private parseFile(file: File) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.data.length > 1000) {
          this.toastr.error('Maximum 1000 rows allowed');
          this.selectedFile = null;
          return;
        }
        this.parsedData = result.data;
        this.previewRows = result.data.slice(0, 10);
        this.validateData();
      },
      error: () => {
        this.toastr.error('Failed to parse CSV file');
      }
    });
  }

  private validateData() {
    this.isValidating = true;
    this.productService.validateProductImport(this.parsedData).subscribe(
      (errors) => {
        this.validationErrors = errors;
        this.isValidating = false;
      },
      () => {
        this.toastr.error('Validation request failed');
        this.isValidating = false;
      }
    );
  }

  get validCount(): number {
    return this.parsedData.length - this.validationErrors.length;
  }

  get hasErrors(): boolean {
    return this.validationErrors.length > 0;
  }

  executeImport() {
    this.isImporting = true;
    this.productService.executeProductImport(this.parsedData, this.importMode).subscribe(
      (result) => {
        this.importResult = result;
        this.isImporting = false;
        this.toastr.success(`Import complete: ${result.created} created, ${result.updated} updated`);
      },
      () => {
        this.toastr.error('Import failed');
        this.isImporting = false;
      }
    );
  }

  downloadErrorReport() {
    if (!this.importResult?.errors?.length) return;
    const csv = Papa.unparse(this.importResult.errors);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'import-errors.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  cancel() {
    this.router.navigate(['/pages/catalogue/products/products-list']);
  }

  reset() {
    this.selectedFile = null;
    this.parsedData = [];
    this.validationErrors = [];
    this.importResult = null;
    this.previewRows = [];
  }
}
