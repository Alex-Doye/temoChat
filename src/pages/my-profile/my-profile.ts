import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Util} from "../../providers/util/util";
import {User} from "../../models/user";
import {HttpProvider} from "../../providers/http/http";
import { UserProvider } from '../../providers/user/user';


/**
 * Generated class for the MyProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})


export class MyProfilePage {

  public Util = Util;
  private profile: User = new User();
  private isLoading: boolean = true;
  public oldEmail:string;
  //creation de variable//
  private string:string = "chaine de car";
  private intEtFloat:Number = 22.22;
  private boolean:boolean = true;
  private fourTout:any;
  private instanceUser:User = new User();
  private tableauInt:Array<Number> = [22,11];
  private tableauTout:Array<any> = [22,1.11, true, [22]];

  constructor(
    public http:HttpProvider, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    private userProvider:UserProvider) {
  }

  ionViewDidLoad() {
    this.isLoading = false;
    this.profile = <User>this.userProvider.user;
    this.oldEmail = this.profile.email;
  }

  doSubmit() {
    if(this.oldEmail === this.profile.email){
      this.userProvider.updateUser(this.profile).then(
        data => this.navCtrl.setRoot('ListFriendsPage')
      )
    }
    else {
      this.userProvider.updateUser(this.profile, {type: true, email: this.oldEmail}).then(
        data => this.navCtrl.setRoot('ListFriendsPage')
      )
    }
  }

}
