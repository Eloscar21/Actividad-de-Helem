import { Component, OnInit, OnChanges, SimpleChanges, Input, HostListener } from "@angular/core";
import { ITodo } from "../../structures/todos";
import { TodoService } from "../../services/todos.service";

@Component({
    selector: 'todo-card',
    templateUrl: 'todo.card.component.html'
})
export class TodoCardComponent implements OnInit, OnChanges {
    @Input() todo!: ITodo;
    @Input() listId!: string;

    public isPressing: boolean = false;
    public isRemoving: boolean = false;
    public isRemoved: boolean = false;
    public offsetX: number = 0;

    private startX: number = 0;
    private rawDeltaX: number = 0;
    private activePointerId: number | null = null;
    private previousStatus: any = undefined;

    constructor(private todoS: TodoService) { }

    ngOnInit(): void {
        this.syncVisibilityWithStatus();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['todo'] && this.todo) {
            this.syncVisibilityWithStatus();
        }
    }

    private syncVisibilityWithStatus(): void {
        if (!this.todo) {
            return;
        }
        const currentStatus = Number(this.todo.status);

        // Si en Firebase cambiaron el status de un valor != 0 a 0, ocultarlo
        if (this.previousStatus !== undefined && this.previousStatus !== 0 && currentStatus === 0) {
            this.todoS.markHiddenLocally(this.todo.id);
            this.isRemoved = true;
            this.previousStatus = currentStatus;
            return;
        }

        this.previousStatus = currentStatus;

        if (this.todoS.isHiddenOnPage(this.todo)) {
            this.isRemoved = true;
        } else {
            this.isRemoved = false;
            this.isRemoving = false;
            if (!this.isPressing) {
                this.offsetX = 0;
            }
        }
    }

    onPointerDown(event: PointerEvent): void {
        if (this.isRemoving || this.isRemoved) {
            return;
        }
        this.isPressing = true;
        this.activePointerId = event.pointerId;
        this.startX = event.clientX;
        this.rawDeltaX = 0;
        this.offsetX = 0;
    }

    @HostListener('document:pointermove', ['$event'])
    onPointerMove(event: PointerEvent): void {
        if (!this.isPressing || event.pointerId !== this.activePointerId) {
            return;
        }
        this.rawDeltaX = event.clientX - this.startX;
        // Solo permitir que se deslice hacia la izquierda (valores negativos o 0)
        this.offsetX = this.rawDeltaX < 0 ? this.rawDeltaX : 0;
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
        const delta = this.rawDeltaX;
        const currentOffset = this.offsetX;

        this.isPressing = false;
        this.activePointerId = null;
        this.rawDeltaX = 0;

        if (Math.abs(delta) <= 10) {
            console.log('Clic en el elemento de la lista:', this.todo);
            this.offsetX = 0;
            return;
        }

        if (delta > 10) {
            console.log('Se dio para la derecha:', this.todo);
            this.offsetX = 0;
            return;
        }

        console.log('Se dio para la izquierda:', this.todo);

        // Si se deslizó hacia la izquierda lo suficiente, al soltar se elimina de la página y en Firebase queda con status 0
        if (currentOffset < -50) {
            this.isRemoving = true;
            this.offsetX = -window.innerWidth;
            this.todoS.hideOnPageAndSetStatusZero(this.listId, this.todo).then(() => {
                console.log('Eliminado de la página y actualizado con status 0 en Firebase:', this.todo);
            }).catch(err => {
                console.error('Error al actualizar status 0 en Firebase:', err);
            });
            setTimeout(() => {
                this.isRemoved = true;
            }, 250);
        } else {
            this.offsetX = 0;
        }
    }
}

