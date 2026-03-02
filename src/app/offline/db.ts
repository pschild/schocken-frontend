import Dexie, { Table, Transaction } from 'dexie';
import './Dexie.UUIDPrimaryKey.js';
import { GameDetailDto } from '../api/openapi';

export interface TodoItem {
  uuid?: string;
  title: string;
  done?: boolean;
}

export interface OfflineGame extends GameDetailDto {}

export interface CacheItem {
  key: string;
  createdAt?: Date;
  updatedAt?: Date;
  payload: object;
}

export class AppDB extends Dexie {
  todoItems!: Table<TodoItem, string>;
  cacheItems!: Table<CacheItem, string>;
  games!: Table<OfflineGame, string>;

  constructor() {
    super('hoptimisten');
    this.version(1).stores({
      todoItems: '$$uuid',
      cacheItems: '&key',
      games: '$$id',
    });
    // this.on('populate', () => this.populate());
  }

  // async populate() {
  //   await db.todoItems.bulkAdd([
  //     {
  //       title: 'Feed the birds',
  //     },
  //     {
  //       title: 'Watch a movie',
  //     },
  //     {
  //       title: 'Have some sleep',
  //     },
  //   ]);
  // }
}

export const db = new AppDB();

db.cacheItems.hook('creating', (primKey: string, obj: CacheItem, transaction: Transaction) => {
  obj.createdAt = new Date();
  obj.updatedAt = new Date();
});

db.cacheItems.hook('updating', (modifications: Object, primKey: string, obj: CacheItem, transaction: Transaction) => {
  return { ...modifications, updatedAt: new Date() };
});
