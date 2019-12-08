import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor
  (
    public afAuth: AngularFireAuth,
    private router: Router
    ) {}


    logout()
    {
      this.afAuth.auth.signOut();
      this.router.navigateByUrl('/login');

    }
}
