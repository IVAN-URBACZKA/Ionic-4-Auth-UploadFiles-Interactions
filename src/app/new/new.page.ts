import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
})
export class NewPage implements OnInit {

  image: string;
  filePath: string;
 task: any;
  postData = {
  userId: '',
  userPseudo: '',
  userImg: '',
  description: ''
  };
  date = new Date().getTime();

  constructor(
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    public afSG: AngularFireStorage,
    private router: Router,
    private camera: Camera

  ) { 
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
      this.router.navigateByUrl('/login');
      console.log('non connecté');
      } else {
      this.postData.userId = auth.uid;
      this.getUserInfo(auth.uid);
      console.log('Connecté: ' + auth.uid);
      }
      });
  }

  ngOnInit() {
  }

  getUserInfo(userId: string) {
    const userRef = this.afDB.list('Users/');
    userRef.snapshotChanges(['child_added'])
    .subscribe(actions => {
    const that = this;
    actions.forEach((action: any) => {
    if (action.key === userId) {
    that.postData.userPseudo =
   action.payload.val().pseudo;
    that.postData.userImg =
   action.payload.val().imgUrl;
    }
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
      this.filePath = 'post_' + this.date + '.jpg';
      this.image = 'data:image/jpg;base64,' + file;
      }

      publish() {
        this.task =
       this.afSG.ref(this.filePath).putString(this.image,
       'data_url');
        this.task.then(res => {
        this.afDB.object('Posts/' + this.date).set({
        userId: this.postData.userId,
        userPseudo: this.postData.userPseudo,
        userImg: this.postData.userImg,
        description: this.postData.description,
        imgUrl: this.filePath,
        likesNb: 0,
        date: new Date().toISOString()
        });
        this.afDB.object('Users/' + this.postData.userId + '/Posts/' + this.date).set({
        post: this.date,
        description: this.postData.description,
        imgUrl: this.filePath
        });
        this.refreshData();
        this.router.navigateByUrl('/');
        });
        }

        refreshData() {
          this.postData.description = '';
          this.image = '';
         }

}
