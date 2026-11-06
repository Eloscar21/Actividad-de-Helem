import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { ListsService } from '../services/lists.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  animations: [
    trigger('enterState', [
      transition('* => *', [
        query(':enter', [
          style({ transform: 'translateX(-100%)', opacity: 0 }),
          stagger(80, [
            animate('350ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'translateX(0)', opacity: 1 }))
          ])
        ], { optional: true })
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

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}

