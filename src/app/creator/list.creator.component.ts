import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.services';
import { ILista } from '../structures/lista';
import { ListsService } from '../services/lists.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'creator',
    templateUrl: './list.creator.component.html',
    styles: [`
        .creator-container {
            max-width: 650px;
            margin: 32px auto;
            padding: 0 16px;
        }
        .form-card {
            background: #ffffff;
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
            border: 1px solid #e2e8f0;
        }
        .form-title {
            margin: 0 0 16px 0;
            color: #1e293b;
            font-size: 1.35rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .custom-input {
            width: 100%;
            box-sizing: border-box;
            padding: 12px 16px;
            font-size: 1rem;
            border: 1.5px solid #cbd5e1;
            border-radius: 6px;
            outline: none;
            transition: all 0.2s ease;
        }
        .custom-input:focus {
            border-color: #2196F3;
            box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.15);
        }
        .btn-submit {
            margin-top: 14px;
            width: 100%;
            padding: 12px;
            font-size: 1rem;
            font-weight: 600;
            background-color: #2196F3;
            color: #ffffff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s ease, transform 0.1s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .btn-submit:hover {
            background-color: #1976D2;
        }
        .btn-submit:active {
            transform: scale(0.99);
        }
        .lists-section {
            margin-top: 36px;
        }
        .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
        }
        .section-header h3 {
            margin: 0;
            color: #1e293b;
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .badge {
            background: #e3f2fd;
            color: #1976d2;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        }
        .list-card {
            background: #ffffff;
            border-radius: 8px;
            padding: 16px 20px;
            margin-bottom: 12px;
            border: 1px solid #e2e8f0;
            border-left: 4px solid #2196F3;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: all 0.2s ease;
        }
        .list-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
            border-color: #90caf9;
            border-left-color: #1976d2;
        }
        .list-info {
            display: flex;
            align-items: center;
            gap: 14px;
        }
        .list-icon {
            color: #2196F3;
            font-size: 1.25rem;
        }
        .list-title {
            font-size: 1.05rem;
            font-weight: 600;
            color: #1e293b;
            margin: 0;
        }
        .list-meta {
            font-size: 0.78rem;
            color: #64748b;
            margin-top: 4px;
        }
        .empty-state {
            text-align: center;
            padding: 45px 20px;
            background: #ffffff;
            border: 2px dashed #cbd5e1;
            border-radius: 8px;
            color: #64748b;
        }
        .empty-state i {
            font-size: 2.8rem;
            color: #94a3b8;
            margin-bottom: 12px;
            display: block;
        }
        .empty-state p {
            margin: 0 0 6px 0;
            font-size: 1rem;
            font-weight: 500;
            color: #334155;
        }
    `]
})
export class listCreatorComponent implements OnInit {
    public lista: ILista = { titulo: '' };
    private currentUser: any;

    constructor(
        public listS: ListsService,
        private authService: AuthService,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        this.authService.getUser().subscribe(user => {
            if (user) {
                this.currentUser = user;
            }
        });
    }

    save() {
        if (this.currentUser) {
            this.lista.userUid = this.currentUser.uid;
            this.lista.userName = this.currentUser.name || this.currentUser.displayName || '';
            this.lista.userEmail = this.currentUser.email || '';
        }
        console.log('Guardando lista:', this.lista);

        // Enviar a la terminal del servidor
        this.http.post('/api/log', { tipo: 'Nueva Lista', datos: this.lista }).subscribe();

        this.listS.add(this.lista).then(res => {
            console.log('¡Lista guardada exitosamente!', res);
            this.reset(); // Limpiar el input después de guardar
        }).catch(err => {
            console.error('Error al guardar:', err);
        });
    }

    reset() {
        this.lista.titulo = '';
        this.lista = { titulo: '' };
    }
}