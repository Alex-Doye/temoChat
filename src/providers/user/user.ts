import {Injectable} from '@angular/core';
import {User} from "../../models/user";
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';

/*
 Generated class for the UserProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class UserProvider {

  private _user:User = new User();
  private _status:Number = 0;

  constructor(private nativeStorage: Storage, private http: HttpClient) {
    console.log('Hello UserProvider Provider');
    this.statusUsers().then(
      theStatus => this._status = theStatus
    )
  }


  get user():User {
    return this._user;
  }

  set user(value:User) {
    this._user = value;
  }

  statusUsers(){
    return this.nativeStorage.get('users')
    .then(//tentative de récuperation de la data stocker via la key 'users'
      data => {//tentative success - Le plugin à pu se connecter au stockage local
        if(data === null){//Test si la data 'users' n'existe pas
          this.nativeStorage.set('users', []);//Création de la data 'users'
          return 0
        }
        else{//Test si la data 'users existe
          if(Array.isArray(data))//Test si c'est un tableau
            return (data.length > 0)? 1 : -1;
          else {//Test si c'est pas un tableau
            this.nativeStorage.set('users', []);
            return 0;
          }
        }
      },
      error => {//Tentative echec - on créé la data et on recommence le test
        this.nativeStorage.set('users', []);
        this.statusUsers();
        return 0;
      }
  );
  }

  checkedEmail(email:string){
    return this.nativeStorage.get('users').then(
      users => {
        for(let i = 0; i< users.length; i++){// boucle sur les elements stocker dans la key 'users'
          if(users[i].email === email)// test si l'email = l'email entrer en parametre.
            return true;
        }
        return false;
      }
    )
  }

  loginUser(email:string, password:string){
    return this.checkedEmail(email).then(//Test si l'adresse email est enregistrer
      data => {
        if(data){// verification du resultat de la promesse 'checkedEmail'
          return this.nativeStorage.get('users').then(//Récuperation des utilisateurs
            data => {
              for(let i = 0; i< data.length; i++)
                if(data[i].email === email && data[i].password === password){//vérification du password
                  this._user = data[i]// ajout du profil user dans la class userprovider grace au setter.
                  //Grace a sa, nous pouvont recuperer le profile à tout moments vu qu'il est stocker 
                  //dans la class UserProvider
                  return data[i]
                } 
              return false;
            }
          ) 
        }
        return false;
      }
    )
  }

  loginUser2(email: string, password: string){
    return new Promise(
      result => {
        this.http.post("http://localhost/PHP", {
          email: email,
          password: password,
        }).subscribe(data => result(data));
      }
    )
  }

  registeurUser( user:User ){
    switch(this._status){
      case 1://si les données recupéré ne sont pas vide
      return this.nativeStorage.get('users').then(
        users => {
          let isValided: boolean = false;//init variable - l'objectif est de tester si l'email est deja 
          //dans l'array. par default on dit qu'il n'y est pas
          if(users !== null) 
            for(let i = 0; i< users.length; i++)
              if(user[i].email === user.email)// test si l'email est la 
                isValided = true;// on enregistre dans la variable le fait qu'ont ai trouvé l'email de 
                //de l'utilisateur dans le tableau d'utilisateur 
            if(isValided)
              return false;
            this._user = user;
          users.push(user)//Ajouter le nouvelle utilisateur dans le tableaud'utilisateur
          return true;
        }
      )
      case 0:
      case -1:
        return this.nativeStorage.set('users', [user]).then(
          data => {return true;}
        )
      default:
      return this.nativeStorage.set('users', [user]).then(
        data => {return true;}
      )
    }
  }

  updateUser(user:User, isEmail:any = {type: false}){
    return this.nativeStorage.get('users').then(//Récuperation des utilisateurs
      users => {
        for(let i = 0; i< users.length; i++){
          if(users[i].email === user.email){//vérification du password
            this._user = user;// ajout du profil user dans la class userprovider grace au setter.
            //Grace a sa, nous pouvont recuperer le profile à tout moments vu qu'il est stocker 
            //dans la class UserProvider
            this.nativeStorage.set('users', users)
            return true;
          }
          if(isEmail){
            if(users[i].email === isEmail.email){//vérification du password
              this._user = user;// ajout du profil user dans la class userprovider grace au setter.
              //Grace a sa, nous pouvont recuperer le profile à tout moments vu qu'il est stocker 
              //dans la class UserProvider
              this.nativeStorage.set('users', users)
              return true;
            }
          } 
        }

        return false;
      }
    ) 
  }
}
