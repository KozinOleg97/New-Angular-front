import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class HeaderService {
providedIn: 'root';
  public title = new BehaviorSubject('Title');

  constructor() { }

  setTitle(title) {
    this.title.next(title);
  }
}
