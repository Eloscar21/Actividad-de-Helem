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

    getDeadlineText(): string {
        if (!this.todo || !this.todo.deadline) {
            return '';
        }

        const raw = String(this.todo.deadline).trim();
        let targetDate: Date | null = null;

        // Formato DD/MM/YYYY ...
        const dmyMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        // Formato YYYY-MM-DD ...
        const ymdMatch = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);

        if (dmyMatch) {
            const day = parseInt(dmyMatch[1], 10);
            const month = parseInt(dmyMatch[2], 10) - 1;
            const year = parseInt(dmyMatch[3], 10);
            targetDate = new Date(year, month, day);
        } else if (ymdMatch) {
            const year = parseInt(ymdMatch[1], 10);
            const month = parseInt(ymdMatch[2], 10) - 1;
            const day = parseInt(ymdMatch[3], 10);
            targetDate = new Date(year, month, day);
        } else {
            const parsed = new Date(raw);
            if (!isNaN(parsed.getTime())) {
                targetDate = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
            }
        }

        if (!targetDate) {
            return raw;
        }

        const now = new Date();
        const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const targetMidnight = targetDate.getTime();
        const diffDays = Math.round((targetMidnight - todayMidnight) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            const diasAtras = Math.abs(diffDays);
            return `${diasAtras} ${diasAtras === 1 ? 'día después' : 'días después'}`;
        } else if (diffDays > 0) {
            return `${diffDays} ${diffDays === 1 ? 'día faltante' : 'días faltantes'}`;
        } else {
            return 'Hoy';
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

