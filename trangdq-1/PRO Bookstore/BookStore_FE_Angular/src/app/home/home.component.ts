import {Component} from '@angular/core';
import {Product, ResponseObject, TakeUntilDestroy} from '../shared/resources';
import {filter, merge, Observable, of, switchMap, takeUntil} from 'rxjs';
import {ProductService} from '../shared/services/product.service';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {SearchService} from "../shared/services/search.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends TakeUntilDestroy {
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
    private route: ActivatedRoute,
    private router: Router
  ) {
    super()
  }

  public ngOnInit(): void {
    merge(
      of(null),
      this.router.events.pipe(filter(event => event instanceof NavigationEnd))
    ).pipe(
      takeUntil(this.destroy$),
      switchMap(() => this.fetchProducts())
    ).subscribe({
      next: (response) => {
        this.products = <Array<Product>>response.data.content ?? []
        this.total_pages = <number>response.data.totalPages ?? 0
        this.loading = false
        this.hasLoaded = true
      },
      error: (error) => {
        console.log(error)
        this.products = []
        this.total_pages = 0
        this.loading = false
        this.hasLoaded = true
      }
    })
  }

  private fetchProducts(): Observable<ResponseObject> {
    this.loading = true

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
