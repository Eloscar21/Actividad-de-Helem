import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { ListsService } from '../services/lists.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  animations: [
    trigger('enterState', [
      state('void', style({
        transform: 'translateX(-100%)',
        opacity: 0
      })),
      transition(':enter', [
        animate('300ms ease-out', style({
          transform: 'translateX(0)',
          opacity: 1
        }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  public message = 'Angular Universal';
  public showLists = true;
  private sub?: Subscription;

  constructor(public lists: ListsService) { }

  ngOnInit(): void {
    this.sub = this.lists.slideTrigger.subscribe(() => {
      this.showLists = false;
      setTimeout(() => {
        this.showLists = true;
      }, 20);
    });
  }

  onListClick(list: any): void {
    console.log('Clic en la lista:', list);
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}

