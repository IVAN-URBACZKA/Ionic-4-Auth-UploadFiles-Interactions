import { Component, OnInit } from '@angular/core';

import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

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
    link:'',
  }

  image = '../assets/user.png';
  filePath: string;
  task: any;
 
  constructor(
    public toastController: ToastController,
    // Seulement pour l'e-mail et le mot de passe
    public afAuth: AngularFireAuth,
    // Permet de stocker des informations supplémentaires
    public afDB: AngularFireDatabase,
    public afSG: AngularFireStorage,
    private router: Router,
    private camera: Camera
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
    this.task =
   this.afSG.ref(this.filePath).putString(this.image,
   'data_url');
    this.task.then(res => {
    this.afDB.object('Users/' + userId).set({
    pseudo: this.signupData.password,
    bio: this.signupData.bio,
    link: this.signupData.link,
    imgUrl: this.filePath
    });
    });
    }

async addPhoto() {
  const base64 = await this.captureImage();
  this.createUploadTask(base64);
  }

  async captureImage() {
    const options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    targetWidth: 1000,
    targetHeight: 1000,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    return await this.camera.getPicture(options);
    }
    createUploadTask(file: string): void {
    this.filePath = `Users/user_${ new
   Date().getTime() }.jpg`;
    this.image = 'data:image/jpg;base64,' + file;
    }

}
