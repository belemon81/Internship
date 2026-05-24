import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {filter, Observable, takeUntil} from 'rxjs';
import {AuthService} from '../../services/auth.service';
import {getRole, getUserId, OrderStatus, TakeUntilDestroy} from "../../resources";
import {ActivatedRoute, IsActiveMatchOptions, NavigationEnd, Router} from "@angular/router";
import {SearchService} from "../../services/search.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent extends TakeUntilDestroy implements OnInit {
  public isLoggedIn$: Observable<boolean> = new Observable<boolean>()
  public isAdmin$: Observable<boolean> = new Observable<boolean>()
  public keyword: string = ''
  public avatarUrl: string = ''
  public username: string = ''
  @Output()
  public searchKeywordsChange: EventEmitter<string> = new EventEmitter<string>();
  public options: IsActiveMatchOptions = {
    queryParams: 'ignored',
    matrixParams: 'exact',
    paths: 'subset',
    fragment: 'exact'
  }
  protected readonly OrderStatus = OrderStatus;

  constructor(private searchService: SearchService, private authService: AuthService, private userService: UserService, private router: Router, private route: ActivatedRoute) {
    super();
    this.router.events.pipe(
      takeUntil(this.destroy$),
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadState()
    });
  }

  public ngOnInit(): void {
    this.loadState()
  }

  public logout(): void {
    this.authService.logout().pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => console.log('Logout successfully!'),
        error: (error) => alert(error.message)
      })
  }

  public search(event?: Event): void {
    event?.preventDefault()
    const trimmed = this.keyword.trim()
    this.searchService.setSearchKeyword(trimmed)
    this.router.navigate(['/home/1'], {
      queryParams: trimmed ? {search: trimmed} : {}
    })
  }

  public returnToHomepage(event?: Event) {
    event?.preventDefault()
    this.keyword = ''
    this.searchService.setSearchKeyword('')
    this.router.navigate(['/home/1'])
  }

  private loadState() {
    const searchParam = this.route.snapshot.queryParamMap.get('search')
    if (searchParam !== null) {
      this.keyword = searchParam
    }
    this.isLoggedIn$ = this.authService.isLoggedIn()
    this.isAdmin$ = this.authService.isAdmin()
    if (getUserId() && getRole() === 'ROLE_ADMIN') {
      this.userService.getUserById(parseInt(getUserId())).subscribe({
        next: (response) => {
          this.username = response.username
          this.avatarUrl = response.avatar
        },
        error: (error) => {
          console.log(error)
        }
      })
    } else if (getUserId() && getRole() === 'ROLE_CUSTOMER') {
      this.userService.getCustomerById(parseInt(getUserId())).subscribe({
        next: (response) => {
          this.username = response.username
          this.avatarUrl = response.avatar
        },
        error: (error) => {
          console.log(error)
        }
      })
    }
  }
}
