import { Component, OnInit } from '@angular/core';
import { ListsService } from '../services/lists.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  public message = 'Angular Universal';

  constructor(public lists: ListsService) { }

  ngOnInit(): void {
  }
}

