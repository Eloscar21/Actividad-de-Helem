import { Component, OnInit, Input, HostListener } from "@angular/core";
import { ITodo } from "../../structures/todos";

@Component({
    selector: 'todo-card',
    templateUrl: 'todo.card.component.html'
})
export class TodoCardComponent implements OnInit {
    @Input() todo!: ITodo;

    public isDragging: boolean = false;
    public startX: number = 0;
    public offsetX: number = 0;

    constructor() { }

    ngOnInit(): void {
    }

    onDragStart(clientX: number): void {
        this.isDragging = true;
        this.startX = clientX;
        this.offsetX = 0;
    }

    onDragMove(clientX: number): void {
        if (!this.isDragging) {
            return;
        }
        this.offsetX = clientX - this.startX;
    }

    onDragEnd(): void {
        if (!this.isDragging) {
            return;
        }
        if (Math.abs(this.offsetX) > 15) {
            const direccion = this.offsetX > 0 ? 'derecha' : 'izquierda';
            console.log(`Deslizado hacia la ${direccion}:`, this.todo);
        }
        this.isDragging = false;
        this.offsetX = 0;
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.isDragging) {
            this.onDragMove(event.clientX);
        }
    }

    @HostListener('document:mouseup')
    onMouseUp(): void {
        if (this.isDragging) {
            this.onDragEnd();
        }
    }
}

