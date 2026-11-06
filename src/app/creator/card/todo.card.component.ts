import { Component, OnInit, Input, HostListener } from "@angular/core";
import { ITodo } from "../../structures/todos";

@Component({
    selector: 'todo-card',
    templateUrl: 'todo.card.component.html'
})
export class TodoCardComponent implements OnInit {
    @Input() todo!: ITodo;

    private isPressing: boolean = false;
    private startX: number = 0;
    private deltaX: number = 0;
    private activePointerId: number | null = null;

    constructor() { }

    ngOnInit(): void {
    }

    onPointerDown(event: PointerEvent): void {
        this.isPressing = true;
        this.activePointerId = event.pointerId;
        this.startX = event.clientX;
        this.deltaX = 0;
    }

    @HostListener('document:pointermove', ['$event'])
    onPointerMove(event: PointerEvent): void {
        if (!this.isPressing || event.pointerId !== this.activePointerId) {
            return;
        }
        this.deltaX = event.clientX - this.startX;
    }

    @HostListener('document:pointerup', ['$event'])
    onPointerUp(event: PointerEvent): void {
        if (!this.isPressing || event.pointerId !== this.activePointerId) {
            return;
        }
        this.finishInteraction();
    }

    @HostListener('document:pointercancel', ['$event'])
    onPointerCancel(event: PointerEvent): void {
        if (!this.isPressing || event.pointerId !== this.activePointerId) {
            return;
        }
        this.finishInteraction();
    }

    private finishInteraction(): void {
        if (Math.abs(this.deltaX) <= 10) {
            console.log('Clic en el elemento de la lista:', this.todo);
        } else if (this.deltaX > 10) {
            console.log('Se dio para la derecha:', this.todo);
        } else {
            console.log('Se dio para la izquierda:', this.todo);
        }

        this.isPressing = false;
        this.activePointerId = null;
        this.deltaX = 0;
    }
}

