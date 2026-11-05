import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AngularFireAuth } from "angularfire2/auth"
import { take, map, tap } from "rxjs/operators"

@Injectable()
export class AuthGuards implements CanActivate {
    constructor(private afAuth: AngularFireAuth, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.afAuth.authState.pipe(take(1), map(user => !!user),
            tap((authenticated: boolean) => {
                if (!authenticated) this.router.navigate(['/login']);
            })
        );
    }
}