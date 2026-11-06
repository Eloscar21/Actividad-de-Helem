import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { ListsService } from '../services/lists.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private lists: ListsService
  ) { }

  onWhatToDoClick() {
    if (this.router.url === '/') {
      this.lists.triggerSlide();
    } else {
      this.router.navigate(['/']);
    }
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login'])
    })

  }

}
