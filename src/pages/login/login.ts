import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, MenuController } from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {HttpProvider} from "../../providers/http/http";
import {User} from "../../models/user";


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

/**
 * @author: KMR
 * @email: yajuve.25.dz@gmail.com
 */

export class LoginPage {
 //Cette variable nous permets de pre-remplir les Formulaire
 //de login ou register
  public account:User = {
    username: 'yajuve',
    fullname: 'Mohamed Raouf',
    email: 'alexdoye5@gmail.com',
    password: 'alex92',
    avatar: 'Raouf.png'
  };

  // Our translated text strings
  public loginErrorString: string; //Message d'erreur l'or de la connection
  private opt: string = 'signin'; //Definir le "tabs" par default. Soit connection, soit inscription

  constructor(
    public http:HttpProvider, 
    public userProvider: UserProvider, 
    public menuCtrl: MenuController, 
    public navCtrl: NavController,
    public translateService: TranslateService) {
    this.menuCtrl.enable(false);// Pas d'affichage de menu

  }

  // Attempt to login in through our User service
  doLoginV1() {
    this.http.get('my-profile.json').subscribe((profile:User) => { //Requet asychrone sur le fichier my-profile.json
      //qui ce situe dans assets->mocks et le contenu du fichier est mise dans la variable profile
      this.userProvider.user = <User>profile; // Ajout du profile user dans la classe UserProvider grace au Setter
      // grace a se, nous pouvons récuperer le profile à tout moments vu qu'il est stocker dans la class UserProvider
      if (this.checkedUser(profile))
        this.navCtrl.setRoot('ListFriendsPage');//setRoot -> permet de supprimer toutes les vues de la stack 
      // et de naviguer vers la root page.
      //navCtrl -> permet de naviguer sur plusieurs pages.
      else{
      this.account.email = "alexdoye5@gmail.com";
      this.account.password = "alex92";
      this.translateService.get('LOGIN_ERROR').subscribe((value) => { //translateService permet d'effectuer
      //du multi-langue
      //subscibe -> concept de PROMISE - OBSERVABLE, le traitement ce fait de maniere asynchrone.
        this.loginErrorString = value; //Affichage du message d'erreur dans la page html via la 
        // variable "loginErrorString"
      })
      }
    }, (err) => {
      console.error(err); // en cas d'erreur sur la recup de l'utilisateur
    });

  }

  doLoginv2(){
    this.userProvider.loginUser(this.account.email, this.account.password).then(
      isConnect => {
        if(isConnect)
          this.navCtrl.setRoot('ListFriendsPage');
        else 
          this.loginErrorString = "connection error";
      }
    )
  }

  doLogin(){
    this.userProvider.loginUser2(this.account.email, this.account.password).then(
      (data:any) => {
        if(data.error)
          this.loginErrorString = "connection error";
        else{
          localStorage.setItem("user", data.user);
          this.navCtrl.setRoot('ListFriendsPage');
        }
      }
    )
  }

  doRegister(){
    this.userProvider.registeurUser(this.account).then(
      isConnect => {
        if(isConnect)
        this.navCtrl.setRoot('ListFriendsPage');
        else 
        this.loginErrorString = "connection error";
      }
    )
  }

  checkedUser(users:User){
    if( users.email === this.account.email && users.password === this.account.password )
      return true;
    else
      return false;

      //return ( users.email === this.account.email && users.password === this.account.password) ? true : false
  }
}
