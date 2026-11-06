import { Component, OnInit, Input, HostListener } from "@angular/core";
import { trigger, state, style, transition, animate } from "@angular/animations";
import { ITodo } from "../../structures/todos";

@Component({
    selector: 'todo-card',
    templateUrl: 'todo.card.component.html',
    animations: [
        trigger('pressAnimation', [
            state('up', style({ transform: 'scale(1)' })),
            state('down', style({ transform: 'scale(0.97)' })),
            transition('up <=> down', animate('120ms ease-out'))
        ])
    ]
})
export class TodoCardComponent implements OnInit {
    @Input() todo!: ITodo;

    public isDragging: boolean = false;
    public pressState: string = 'up';
    public startX: number = 0;
    public offsetX: number = 0;
    private activePointerId: number | null = null;

    constructor() { }

    ngOnInit(): void {
    }

    onPointerDown(event: PointerEvent): void {
        this.isDragging = true;
        this.pressState = 'down';
        this.activePointerId = event.pointerId;
        this.startX = event.clientX;
        this.offsetX = 0;
    }

    @HostListener('document:pointermove', ['$event'])
    onPointerMove(event: PointerEvent): void {
        if (!this.isDragging || event.pointerId !== this.activePointerId) {
            return;
        }
        this.offsetX = event.clientX - this.startX;
        if (Math.abs(this.offsetX) > 10) {
            this.pressState = 'up';
        }
    }

    @HostListener('document:pointerup', ['$event'])
    onPointerUp(event: PointerEvent): void {
        if (!this.isDragging || event.pointerId !== this.activePointerId) {
            return;
        }
        this.finishInteraction();
    }

    @HostListener('document:pointercancel', ['$event'])
    onPointerCancel(event: PointerEvent): void {
        if (!this.isDragging || event.pointerId !== this.activePointerId) {
            return;
        }
        this.finishInteraction();
    }

    private finishInteraction(): void {
        if (Math.abs(this.offsetX) <= 10) {
            console.log('Clic en el elemento de la lista:', this.todo);
        } else if (this.offsetX > 10) {
            console.log('Se dio para la derecha:', this.todo);
        } else {
            console.log('Se dio para la izquierda:', this.todo);
        }

        this.isDragging = false;
        this.pressState = 'up';
        this.activePointerId = null;
        this.offsetX = 0;
    }
}

