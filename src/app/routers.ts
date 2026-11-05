import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './guards/auth.guard.services';

import { listCreatorComponent } from './creator/list.creator.component';
import { LibroCreatorComponent } from './creator/libro.creator.component';
import { ListComponent } from './creator/listas/list.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'creator', component: listCreatorComponent },
    { path: 'libro/nuevo', component: LibroCreatorComponent },
    { path: 'listas/:id', component: ListComponent },
    { path: 'lists/:id', component: ListComponent },
];
