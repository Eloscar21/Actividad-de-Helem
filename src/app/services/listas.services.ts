import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { ILista } from '../structures/lista';

@Injectable()
export class ListasService {
    private listasCollection: AngularFirestoreCollection<ILista>;

    constructor(private afs: AngularFirestore) {
        this.listasCollection = this.afs.collection<ILista>('listas');
    }

    add(lista: ILista) {
        lista.createdAt = new Date().getTime();
        return this.listasCollection.add(lista);
    }
}
