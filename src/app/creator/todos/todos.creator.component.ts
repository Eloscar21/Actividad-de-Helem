import { Component, OnInit, Input } from "@angular/core";
import { ITodo, TStatus } from "../../structures/todos";
import { TodoService } from "../../services/todos.service";

@Component({
    selector: 'todo-creator',
    templateUrl: './todos.creator.component.html'
})
export class TodoCreatorComponent implements OnInit {

    @Input() id!: string;

    public todo: ITodo = { content: '', status: TStatus.Created };

    constructor(private todoS: TodoService) { }

    ngOnInit(): void {
    }

    save() {
        if (!this.id || !this.todo.content) {
            return;
        }

        this.todoS.add(this.id, this.todo).then(() => {
            console.log('¡Todo guardado en Firestore!');
            this.todo = { content: '', status: TStatus.Created };
        }).catch(err => {
            console.error('Error al guardar:', err);
        });
    }
}
