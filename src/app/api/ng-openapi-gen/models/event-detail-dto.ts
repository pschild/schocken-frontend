/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { EventTypeDetailDto } from '../models/event-type-detail-dto';
export interface EventDetailDto {
  comment: string;
  context: 'GAME' | 'ROUND';
  datetime: string;
  eventType: EventTypeDetailDto;
  id: string;
  multiplicatorValue: number;
  penaltyUnit?: 'EURO' | 'BEER_CRATE';
  penaltyValue?: number;
  playerId: string;
}
