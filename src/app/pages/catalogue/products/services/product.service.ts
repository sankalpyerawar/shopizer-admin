import { Injectable } from '@angular/core';

import { CrudService } from '../../../shared/services/crud.service';
import { Observable } from 'rxjs';
import { StorageService } from '../../../shared/services/storage.service';
import { UrlTree, UrlSegment, UrlSegmentGroup, ActivatedRoute, Router, PRIMARY_OUTLET } from '@angular/router';
import {Location} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private crudService: CrudService,
    private storageService: StorageService,
    private http: HttpClient,
  ) {
  }

  getListOfProducts(params): Observable<any> {
    //release 3.2.1 use V2
    return this.crudService.get(`/v2/products`, params);
  }

  updateProductFromTable(id, product): Observable<any> {
    return this.crudService.patch(`/v1/private/product/${id}`, product);
  }

  updateProduct(id, product): Observable<any> {
    const params = {
      store: this.storageService.getMerchant()
    };
    return this.crudService.put(`/v2/private/product/${id}`, product, { params });
  }

  getProductById(id): Observable<any> {
    const params = {
      lang: '_all'
    };
    return this.crudService.get(`/v1/product/${id}`, params);
  }

  getProductDefinitionById(id): Observable<any> {
    const params = {
      lang: '_all'
    };
    return this.crudService.get(`/v2/private/product/definition/${id}`, params);
  }

  getProductDefinitionBySku(sku): Observable<any> {
    const params = {
      lang: '_all'
    };
    return this.crudService.get(`/v2/product/${sku}`, params);
  }

  createProduct(product): Observable<any> {
    const params = {
      store: this.storageService.getMerchant()
    };
    return this.crudService.post(`/v2/private/product/definition`, product, { params });
  }

  deleteProduct(id): Observable<any> {
    return this.crudService.delete(`/v1/private/product/${id}`);
  }

  getProductTypes(): Observable<any> {
    return this.crudService.get(`/v1/private/product/types`);
  }

  checkProductSku(code): Observable<any> {
    const params = {
      'code': code,
    };
    return this.crudService.get(`/v1/private/product/unique`, params);
  }

  addProductToCategory(productId, categoryId): Observable<any> {
    return this.crudService.post(`/v1/private/product/${productId}/category/${categoryId}`, {});
  }

  removeProductFromCategory(productId, categoryId): Observable<any> {
    return this.crudService.delete(`/v1/private/product/${productId}/category/${categoryId}`);
  }
  getProductByOrder(): Observable<any> {
    return this.crudService.get(`/v1/product?count=200&lang=en&page=0`)
  }
  getProductOrderById(id): Observable<any> {
    return this.crudService.get(`/v1/product?category=${id}&count=200&lang=en&page=0`)
  }
  getProductIdRoute(router: Router, location: Location) {
    const tree: UrlTree = router.parseUrl(location.path());
    const g: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
    const s: UrlSegment[] = g.segments; // returns 2 segments
    return s[4].path;
  }

  validateProductImport(csvData: any[]): Observable<any> {
    const params = { store: this.storageService.getMerchant() };
    return this.crudService.post(`/v2/private/product/import/validate`, csvData, { params });
  }

  executeProductImport(csvData: any[], mode: string): Observable<any> {
    const params = { store: this.storageService.getMerchant(), mode };
    return this.crudService.post(`/v2/private/product/import/execute`, csvData, { params });
  }

  downloadImportTemplate(): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/v2/private/product/import/template`, { responseType: 'blob' });
  }

}
