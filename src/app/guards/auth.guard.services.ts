import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AngularFireAuth } from "angularfire2/auth";
import { take, map, tap } from "rxjs/operators";



@Injectable()

export class AuthGuard implements CanActivate {

    constructor(private afAuth: AngularFireAuth, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.afAuth.authState.pipe(
            take(1),
            map(user => !!user),
            tap((authenticated: boolean) => {
                if (!authenticated)
                    this.router.navigate(['/login']);
            })
        );
    }

}