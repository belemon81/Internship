import {Component} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {ErrorMessage, PASSWORD_PATTERN, TakeUntilDestroy} from '../../shared/resources';
import {Observable, takeUntil} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends TakeUntilDestroy {
  public isLoggedIn$: Observable<boolean> = new Observable<boolean>()
  public errors: Array<ErrorMessage> = []
  public username: string = ""
  public password: string = ""

  constructor(private authService: AuthService) {
    super()
  }

  public ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn()
  }

  public login(): void {
    if (this.validateData(this.username, this.password)) {
      this.authService.login(this.username, this.password)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => console.log("Login successfully!"),
          error: (error) => {
            if (error.message.indexOf("User") !== -1) {
              this.errors[0].message = "*" + error.message
            } else {
              this.errors[1].message = "*" + error.message
            }
          }
        })
    }
  }

  private validateData(username: string, password: string): boolean {
    this.errors = [{}, {}]
    let should = true
    if (!username.trim()) {
      this.errors[0].message = "*Username is not available."
      should = false
    }
    if (!password.trim()) {
      this.errors[1].message = "*Password is not available."
      should = false
    }
    return should
  }
}
