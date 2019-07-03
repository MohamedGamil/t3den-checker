import { Injectable } from '@angular/core';
import { Api } from './api';
import { Item } from '../models/item';

@Injectable()
export class Items {

  constructor(public api: Api) {
  }

  query(params?: any) {
    return this.api.request('items', params);
  }

  add(item: Item) {
  }

  delete(item: Item) {
  }
}
