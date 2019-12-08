import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // Objet qui permet de récupèrer via binding l'email et le mdp
  loginData = {
    email: '',
    password: ''
  };

  constructor(
    public afAuth: AngularFireAuth,
    public toastController: ToastController,
    private router: Router
    ) 
   {
     

   }

  ngOnInit() {
  }

  login()
  {
    this.afAuth.auth.signInWithEmailAndPassword(this.loginData.email, this.loginData.password)
    .then(auth => {
        console.log('utilisateur connecté');
        this.router.navigateByUrl('/');
           })
              .catch(err => {
                   console.log('utilisateur non connecté');
                   this.errorMail();
                     });
  }

  async errorMail() {const toast = await this.toastController.create
    ({message: 'Email ou mot de passe incorrect',
    duration: 2000,
    position: 'top'});
    toast.present();}



}
