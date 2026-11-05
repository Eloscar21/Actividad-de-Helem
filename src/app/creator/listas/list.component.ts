import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { TodoService } from "../../services/todos.service";
import { ITodo } from "../../structures/todos";

@Component({
    selector: 'list',
    templateUrl: 'list.component.html'
})
export class ListComponent implements OnInit {
    public listId!: string;
    public todos!: Observable<ITodo[]>;
    constructor(private route: ActivatedRoute, private todoS: TodoService) {

    }
    ngOnInit(): void {
        this.listId = this.route.snapshot.params.id;
        this.todos = this.todoS.getFromList(this.listId);
    }
}
