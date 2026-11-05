import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { ILibro } from '../structures/libro';

@Injectable()
export class LibrosService {
    private librosCollection: AngularFirestoreCollection<ILibro>;

    constructor(private afs: AngularFirestore) {
        this.librosCollection = this.afs.collection<ILibro>('libros');
    }

    add(libro: ILibro) {
        libro.createdAt = new Date().getTime();
        return this.librosCollection.add(libro);
    }
}
