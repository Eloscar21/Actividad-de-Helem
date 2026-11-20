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
    private hiddenTodoIds = new Set<string>();

    private loadHiddenTodos() {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const saved = window.localStorage.getItem('hidden_todos_ids');
                if (saved) {
                    const arr: string[] = JSON.parse(saved);
                    arr.forEach(id => this.hiddenTodoIds.add(id));
                }
            }
        } catch (e) { }
    }

    private saveHiddenTodos() {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem('hidden_todos_ids', JSON.stringify(Array.from(this.hiddenTodoIds)));
            }
        } catch (e) { }
    }

    isHiddenOnPage(todo: ITodo): boolean {
        if (!todo || !todo.id) {
            return false;
        }
        this.loadHiddenTodos();
        // Si en Firebase el status se cambió a 1 (o cualquier valor distinto de 0), mostrarlo en la página
        if (todo.status !== undefined && todo.status !== null && Number(todo.status) !== 0) {
            if (this.hiddenTodoIds.has(todo.id)) {
                this.hiddenTodoIds.delete(todo.id);
                this.saveHiddenTodos();
            }
            return false;
        }
        return this.hiddenTodoIds.has(todo.id);
    }

    markHiddenLocally(todoId?: string) {
        if (!todoId) {
            return;
        }
        this.loadHiddenTodos();
        this.hiddenTodoIds.add(todoId);
        this.saveHiddenTodos();
    }

    hideOnPageAndSetStatusZero(listId: string, todo: ITodo): Promise<any> {
        this.loadHiddenTodos();
        if (todo.id) {
            this.hiddenTodoIds.add(todo.id);
            this.saveHiddenTodos();
        }
        todo.status = 0;

        if (!todo.id) {
            return Promise.resolve();
        }

        if (this.uid) {
            if (!this.collection || this.listId != listId) {
                this.setCollection(listId);
            }
            return this.collection.doc(todo.id).update({ status: 0 });
        }

        return new Promise((resolve, reject) => {
            this.auth.getUser().subscribe(user => {
                if (user && user.uid) {
                    this.uid = user.uid;
                    this.setCollection(listId);
                    this.collection.doc(todo.id!).update({ status: 0 }).then(resolve).catch(reject);
                } else {
                    reject(new Error('Usuario no autenticado'));
                }
            }, reject);
        });
    }

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
        const createdAt = firebase.firestore.FieldValue.serverTimestamp();
        todo.createdAt = createdAt;

        if (this.uid) {
            if (!this.collection || this.listId != listId) {
                this.setCollection(listId);
            }
            return this.collection.add(todo);
        }

        return new Promise((resolve, reject) => {
            this.auth.getUser().subscribe(user => {
                if (user && user.uid) {
                    this.uid = user.uid;
                    this.setCollection(listId);
                    this.collection.add(todo).then(resolve).catch(reject);
                } else {
                    reject(new Error('Usuario no autenticado'));
                }
            }, reject);
        });
    }
}
