import {Box} from './box';

export interface Deal {
  id: number;
  box: Box;
  status: boolean;
  name: string;

}
