import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './base/app.component';
import { HomeComponent } from './home/home.component';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { AuthGuard } from './guards/auth.guard.services';
import { environment } from '../environments/environment';
import { UsersService } from './services/user.services';
import { routes } from './routers';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { LoginComponent } from './login/login.component';
import { SesionComponent } from './sesion/sesion.component';
import { AuthService } from './services/auth.services';
import { RegisterComponent } from './register/register.component';
import { listCreatorComponent } from './creator/list.creator.component';
import { ListasService } from './services/listas.services';
import { LibroCreatorComponent } from './creator/libro.creator.component';
import { LibrosService } from './services/libros.services';
import { ListsService } from './services/lists.service';
import { ListComponent } from './creator/listas/list.component';
import { TodoCreatorComponent } from './creator/todos/todos.creator.component';
import { TodoCardComponent } from './creator/card/todo.card.component';
import { TodoService } from './services/todos.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SesionComponent,
    RegisterComponent,
    listCreatorComponent,
    LibroCreatorComponent,
    ListComponent,
    TodoCreatorComponent,
    TodoCardComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    TransferHttpCacheModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  providers: [AuthService, AuthGuard, UsersService, ListasService, LibrosService, ListsService, TodoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
