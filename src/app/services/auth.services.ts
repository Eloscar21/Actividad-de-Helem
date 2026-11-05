import { Injectable } from "@angular/core";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { from, Observable } from "rxjs";
import { map, take, filter } from 'rxjs/operators';

import { IUser } from '../structures/users';
import 'firebase/auth';
import { UsersService } from "./user.services";

@Injectable()
export class AuthService {

    constructor(private afAuth: AngularFireAuth, private usersService: UsersService) { }

    getUser(): Observable<IUser> {
        return this.afAuth.authState.pipe(
            filter(user => !!user),
            take(1),
            map((user => user as IUser))
        );
    }

    login(): Promise<void> {
        return this.afAuth.auth.signInWithPopup(
            new firebase.auth.GoogleAuthProvider()
        ).then(result => {
            if (result.user) {
                const userObj: IUser = {
                    uid: result.user.uid,
                    name: result.user.displayName || '',
                    email: result.user.email || ''
                };
                this.usersService.add(userObj).catch(console.log);
            }
        }).catch(console.log);
    }
}
