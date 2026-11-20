import { Component, OnInit, Input } from "@angular/core";
import { trigger, state, style, transition, animate } from "@angular/animations";
import { ITodo, TStatus } from "../../structures/todos";
import { TodoService } from "../../services/todos.service";

@Component({
    selector: 'todo-creator',
    templateUrl: './todos.creator.component.html',
    animations: [
        trigger('openClose', [
            state('collapsed, void', style({
                height: '0px',
                opacity: 0,
                overflow: 'hidden'
            })),
            state('expanded', style({
                height: '*',
                opacity: 1,
                overflow: 'hidden'
            })),
            transition('collapsed <=> expanded', [
                animate('300ms ease-out')
            ])
        ])
    ]
})
export class TodoCreatorComponent implements OnInit {

    @Input() id!: string;

    public formState: string = 'collapsed';
    public selectedDate: string = '';
    public selectedTime: string = '';
    public todo: ITodo = { content: '', status: TStatus.Created };

    constructor(private todoS: TodoService) { }

    ngOnInit(): void {
    }

    openCalendar(dateInput: HTMLInputElement): void {
        if (typeof (dateInput as any).showPicker === 'function') {
            (dateInput as any).showPicker();
        } else {
            dateInput.focus();
            dateInput.click();
        }
    }

    onDateChange(dateValue: string): void {
        this.selectedDate = dateValue;
        if (dateValue) {
            const parts = dateValue.split('-');
            const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateValue;
            const now = new Date();
            this.selectedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            this.todo.deadline = `${formattedDate} ${this.selectedTime}`;
        } else {
            this.selectedTime = '';
            this.todo.deadline = '';
        }
    }

    label(): string {
        return (this.formState === 'collapsed') ? 'Agrega pendiente' : 'Ocultar formulario';
    }

    icon(): string {
        return (this.formState === 'collapsed') ? 'fa-plus' : 'fa-chevron-up';
    }

    toggleForm(): void {
        this.formState = (this.formState === 'collapsed') ? 'expanded' : 'collapsed';
    }

    save() {
        if (!this.id || !this.todo.content) {
            return;
        }

        this.todoS.add(this.id, this.todo).then(() => {
            console.log('¡Todo guardado en Firestore!');
            this.todo = { content: '', status: TStatus.Created };
            this.selectedDate = '';
            this.selectedTime = '';
            this.formState = 'collapsed';
        }).catch(err => {
            console.error('Error al guardar:', err);
        });
    }
}
