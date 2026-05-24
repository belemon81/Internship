import {Component, OnInit} from '@angular/core';
import {Product, ResponseObject, TakeUntilDestroy} from '../shared/resources';
import {catchError, combineLatest, Observable, of, switchMap, takeUntil, tap} from 'rxjs';
import {ProductService} from '../shared/services/product.service';
import {ActivatedRoute} from "@angular/router";
import {SearchService} from "../shared/services/search.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends TakeUntilDestroy implements OnInit {
  public page: number = 1
  public products: Array<Product> = []
  public total_pages: number = 0
  public name_asc = true
  public price_asc = true
  public inStock_asc = true
  public query_params: string = ''
  public loading = false
  public hasLoaded = false

  constructor(
    private searchService: SearchService,
    private productService: ProductService,
    private route: ActivatedRoute
  ) {
    super()
  }

  public ngOnInit(): void {
    combineLatest([
      this.route.paramMap,
      this.route.queryParamMap
    ]).pipe(
      takeUntil(this.destroy$),
      tap(() => {
        this.loading = true
      }),
      switchMap(() =>
        this.fetchProducts().pipe(
          catchError((error) => {
            console.log(error)
            return of({data: {content: [], totalPages: 0}} as ResponseObject)
          })
        )
      )
    ).subscribe({
      next: (response) => {
        const content = response?.data?.content
        this.products = Array.isArray(content) ? content : []
        this.total_pages = response?.data?.totalPages ?? 0
        this.loading = false
        this.hasLoaded = true
      }
    })
  }

  private fetchProducts(): Observable<ResponseObject> {
    const pageNo = this.route.snapshot.paramMap.get('page')
    if (pageNo) {
      this.page = Number.parseInt(pageNo, 10)
    }

    const categoryOn = this.route.snapshot.queryParamMap.get('category')
    const nameOn = this.route.snapshot.queryParamMap.get('name')
    const priceOn = this.route.snapshot.queryParamMap.get('price')
    const inStockOn = this.route.snapshot.queryParamMap.get('inStock')
    const searchKeyword = this.route.snapshot.queryParamMap.get('search')?.trim() ?? ''

    this.name_asc = !(nameOn && nameOn === 'true')
    this.price_asc = !(priceOn && priceOn === 'true')
    this.inStock_asc = !(inStockOn && inStockOn === 'true')

    if (categoryOn) {
      this.query_params = "?category=" + categoryOn
      return this.productService.getProducts(this.page - 1, "category", false, true, categoryOn)
    }
    if (nameOn) {
      this.query_params = "?name=" + !this.name_asc
      return this.productService.getProducts(this.page - 1, "name", true, false, !this.name_asc ? "asc" : "desc")
    }
    if (priceOn) {
      this.query_params = "?price=" + !this.price_asc
      return this.productService.getProducts(this.page - 1, "price", true, false, !this.price_asc ? "asc" : "desc")
    }
    if (inStockOn) {
      this.query_params = "?inStock=" + !this.inStock_asc
      return this.productService.getProducts(this.page - 1, "inStock", true, false, !this.inStock_asc ? "asc" : "desc")
    }
    if (searchKeyword) {
      this.query_params = '?search=' + encodeURIComponent(searchKeyword)
      return this.searchService.searchProducts(this.page - 1, searchKeyword)
    }

    this.query_params = ''
    return this.productService.getProducts(this.page - 1)
  }
}
