import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";
import { AuthService } from "./auth.services";
import { ILista } from "../structures/lista";
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable()
export class ListsService {
    public uid: string = '';
    public lists!: AngularFirestoreCollection<ILista>;
    private listasSubject = new BehaviorSubject<ILista[]>([]);
    public listas: Observable<ILista[]> = this.listasSubject.asObservable();
    public error: string = '';
    public slideTrigger = new Subject<void>();

    triggerSlide() {
        this.slideTrigger.next();
    }

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
        this.lists.snapshotChanges().pipe(
            map(actions => actions.map(item => {
                const data = item.payload.doc.data() as ILista;
                const id = item.payload.doc.id;
                return { id, ...data };
            }))
        ).subscribe(
            items => {
                this.error = '';
                this.listasSubject.next(items);
            },
            err => {
                console.error('Error leyendo listas de Firestore:', err);
                this.error = 'Firebase bloqueó el acceso (Permisos denegados). Ve a Firebase Console -> Firestore Database -> pestaña Reglas y publica "allow read, write: if true;".';
                this.listasSubject.next([]);
            }
        );
    }

    add(list: ILista): Promise<any> {
        const createdAt = firebase.firestore.FieldValue.serverTimestamp();
        list.createdAt = createdAt;

        if (this.lists) {
            return this.lists.add(list);
        }

        return new Promise((resolve, reject) => {
            this.auth.getUser().subscribe(user => {
                if (user && user.uid) {
                    this.uid = user.uid;
                    this.setCollection();
                    this.lists.add(list).then(resolve).catch(reject);
                } else {
                    reject(new Error('Usuario no autenticado'));
                }
            }, reject);
        });
    }
}

