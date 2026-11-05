import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from "angularfire2/firestore";
import { AuthService } from "./auth.services";
import { ITodo } from "../structures/todos";
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Observable } from "rxjs";
import { map, share, switchMap } from 'rxjs/operators';

@Injectable()
export class TodoService {
    public uid: string = '';
    private collection!: AngularFirestoreCollection<ITodo>;
    private ref!: Observable<DocumentChangeAction<ITodo>[]>;
    private listId!: string;
    public todos!: Observable<ITodo[]>;

    constructor(private afs: AngularFirestore, private auth: AuthService) {
        this.auth.getUser().subscribe(user => {
            if (user && user.uid) {
                this.uid = user.uid;
                if (this.listId) {
                    this.setCollection(this.listId);
                }
            }
        });
    }

    setCollection(listId: string) {
        this.listId = listId;
        if (this.uid) {
            this.collection = this.afs.collection('users').doc(this.uid).collection('listas').doc(listId).collection<ITodo>('todos');
            this.ref = this.collection.snapshotChanges().pipe(share());
        } else {
            this.ref = this.auth.getUser().pipe(
                switchMap(user => {
                    this.uid = user.uid;
                    this.collection = this.afs.collection('users').doc(this.uid).collection('listas').doc(listId).collection<ITodo>('todos');
                    return this.collection.snapshotChanges();
                }),
                share()
            );
        }
        this.todos = this.ref.pipe(
            map(actions =>
                actions.map(item => {
                    const data = item.payload.doc.data() as ITodo;
                    const id = item.payload.doc.id;

                    return { ...data, id } as ITodo;
                })
            )
        );
    }

    getFromList(listId: string): Observable<ITodo[]> {
        if (!this.collection || this.listId !== listId) {
            this.setCollection(listId);
        }
        return this.ref.pipe(
            map(actions =>
                actions.map(item => {
                    const data = item.payload.doc.data() as ITodo;
                    const id = item.payload.doc.id;

                    return { ...data, id } as ITodo;
                })
            )
        );
    }

    add(listId: string, todo: ITodo): Promise<any> {
        if (!this.collection || this.listId != listId) {
            this.setCollection(listId);
        }
        const createdAt = firebase.firestore.FieldValue.serverTimestamp();
        todo.createdAt = createdAt;
        return this.collection.add(todo);
    }
}
