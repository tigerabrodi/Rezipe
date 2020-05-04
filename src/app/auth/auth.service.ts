import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
import { UiService } from '../shared/ui.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(public auth: AngularFireAuth, private router: Router, private uiService: UiService) { }


  initAuthListener() {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.authChange.next(true);
        this.isAuthenticated = true;
        this.router.navigate(["/dashboard"]);
        console.log(user);
      } else {
        this.authChange.next(false);
        this.isAuthenticated = false;
        this.router.navigate(["/"]);
      }
    });
  }

  // setTimeout is used to prevent the user from seeing the auth page after succeded by keep loading a while.
  registerUser(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.auth.createUserWithEmailAndPassword(authData.email, authData.password)
    .then(result => {
      setTimeout(() => {
        this.uiService.loadingStateChanged.next(false);
      }, 500);
    })
    .catch(error => {
      this.uiService.loadingStateChanged.next(false);
      this.uiService.alertAction(error.message, "danger");
    })
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.auth.signInWithEmailAndPassword(authData.email, authData.password)
    .then(result => {
      setTimeout(() => {
        this.uiService.loadingStateChanged.next(false);
      }, 500);
    })
    .catch(error => {
      this.uiService.loadingStateChanged.next(false);
      this.uiService.alertAction(error.message, "danger");
    })
  }

  logout() {
    this.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }

}