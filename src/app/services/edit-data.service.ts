import { Injectable } from '@angular/core';
import { Employees } from '../javaclasses/classes';

@Injectable({
  providedIn: 'root'
})
export class EditDataService {

  public editData: any;
  public exist: boolean;

  constructor() { }
}
