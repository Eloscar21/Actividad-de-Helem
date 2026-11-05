import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";
import { AuthService } from "./auth.services";
import { ILista } from "../structures/lista";
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable()
export class ListsService {
    public uid: string = '';
    public lists!: AngularFirestoreCollection<ILista>;
    public listas!: Observable<ILista[]>;

    constructor(private afs: AngularFirestore, private auth: AuthService) {
        this.auth.getUser().subscribe(user => {
            if (user && user.uid) {
                this.uid = user.uid;
                this.setCollection();
            }
        });
    }

    setCollection() {
        this.lists = this.afs.collection('users').doc(this.uid).collection<ILista>('listas');
        this.listas = this.lists.snapshotChanges().pipe(
            map(actions => actions.map(item => {
                const data = item.payload.doc.data() as ILista;
                const id = item.payload.doc.id;
                return { id, ...data };
            }))
        );
    }

    add(list: ILista): Promise<any> {
        if (!this.lists) {
            if (this.uid) {
                this.setCollection();
            } else {
                return Promise.reject(new Error('Asignar un valor a la coleccion antes de tratar de guardar un nuevo documento'));
            }
        }

        const createdAt = firebase.firestore.FieldValue.serverTimestamp();
        list.createdAt = createdAt;

        return this.lists.add(list);
    }
}

