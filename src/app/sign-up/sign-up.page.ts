import { Component, OnInit } from '@angular/core';

import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  signupData = {
    email: '',
    password: '',
    pseudo:'',
    bio:'',
    link:''
  }

  constructor(
    public toastController: ToastController,
    // Seulement pour l'e-mail et le mot de passe
    public afAuth: AngularFireAuth,
    // Permet de stocker des informations supplémentaires
    public afDB: AngularFireDatabase,
    public afSG: AngularFireStorage,
    private router: Router
  ) { }

  ngOnInit() {
  }

  signUp()
  {
    this.afAuth.auth.createUserWithEmailAndPassword(this.signupData.email, this.signupData.password)
       .then(auth => {
       this.createUserInfo(auth.user.uid);
       this.router.navigateByUrl('/');
       })
       .catch(err => {
       this.errorSignup();
       });
  }

  async errorSignup() {
    const toast = await this.toastController.create({
    message: 'Email incorrect ou mot de passe trop court',
    duration: 2000,
    position: 'top'
    });
    toast.present();
   }

   createUserInfo(userId: string) {
    this.afDB.object('Users/' + userId).set({
    pseudo: this.signupData.pseudo,
    bio: this.signupData.bio,
    link: this.signupData.link
    });

}

}
