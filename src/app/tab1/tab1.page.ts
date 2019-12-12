import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router';

import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public posts: any;

  constructor
  (
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    public afSG: AngularFireStorage,
    private router: Router) {
      this.getPost();
    }


    logout()
    {
      this.afAuth.auth.signOut();
      this.router.navigateByUrl('/login');

    }

    getPost() {
      const postRef = this.afDB.list('Posts/');
      postRef.snapshotChanges(['child_added'])
      .subscribe(actions => {
      const that = this;
      const data = [];
      actions.forEach((action: any) => {
     const date = action.payload.exportVal().date;
      console.log(action.payload.val().description);
     
     that.afSG.ref(action.payload.val().imgUrl).getDownloadURL().
     subscribe(postUrl => {
     
     that.afSG.ref(action.payload.val().userImg).getDownloadURL()
     .subscribe(userUrl => {
      data.push({
      userId: action.payload.val().userId,
      userPseudo: action.payload.val().userPseudo,
      userImg: userUrl,
      description: action.payload.val().description,
      imgUrl: postUrl,
      likesNb: action.payload.val().likesNb,
      date: action.payload.val().date,
      hour: date.substring(5, 7) + '/' +
     date.substring(8, 10) + ' - ' + date.substring(11, 16)
      });
      });
      });
      this.posts = data;
      });
      });
      }
}
