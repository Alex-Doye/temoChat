import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, MenuController} from 'ionic-angular';
import {HttpProvider} from "../../providers/http/http";
import {Friend} from "../../models/user";
import {Util} from "../../providers/util/util";
import { UserApiProvider } from '../../providers/user-api/user-api';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';

@IonicPage()
@Component({
  selector: 'page-list-friends',
  templateUrl: 'list-friends.html',
})

export class ListFriendsPage {

  public Util = Util;
  private friends: Friend[] = [];

  constructor(
    public menuCtrl: MenuController, 
    public http:HttpProvider, 
    public navCtrl:NavController, 
    public navParams:NavParams,
    public userApi:UserApiProvider) {
  }

  ionViewDidLoad() {
    this.menuCtrl.enable(true);
    let isConnect = Observable.interval(5000).take(5).subscribe(() => {
      console.log("toto");
    });
    // setInterval(function(){
    //   setTimeout(function(){
    //     console.log("first")
    //   }, 5000)
    //   console.log("seconde")
    // }, 5000)
    this.http.get('friends.json').subscribe((friends) => {
      // this.friends = <Friend[]>friends;
    }, (err) => {
      console.error(err);
    });
    this.userApi.getAllUsers().subscribe((data) => {
      this.friends = data;
    }, (err) => {
      console.log(err);
    });
 }

  goToProfileFriend(sliding, friend: Friend) {
    sliding.close();
    this.navCtrl.push('ProfileFriendPage', {friend});
  }

  goToChatRoom(friend: Friend) {
    this.navCtrl.push('ChatRoomPage', {friend});
  }



}
