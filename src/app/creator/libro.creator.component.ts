import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.services';
import { ILibro } from '../structures/libro';
import { LibrosService } from '../services/libros.services';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'libro-creator',
    templateUrl: './libro.creator.component.html'
})
export class LibroCreatorComponent implements OnInit {
    public libro: ILibro = { titulo: '' };
    private currentUser: any;

    constructor(private librosService: LibrosService, private authService: AuthService, private http: HttpClient) { }

    ngOnInit(): void {
        this.authService.getUser().subscribe(user => {
            if (user) {
                this.currentUser = user;
            }
        });
    }

    save() {
        if (this.currentUser) {
            this.libro.userUid = this.currentUser.uid;
            this.libro.userName = this.currentUser.name || this.currentUser.displayName || '';
            this.libro.userEmail = this.currentUser.email || '';
        }
        console.log('Guardando libro:', this.libro);

        // Enviar a la terminal del servidor
        this.http.post('/api/log', { tipo: 'Nuevo Libro', datos: this.libro }).subscribe();

        this.librosService.add(this.libro).then(() => {
            console.log('¡Libro guardado exitosamente!');
            this.libro = { titulo: '' }; // Limpiar el input después de guardar
        }).catch(err => {
            console.error('Error al guardar libro:', err);
        });
    }
}
