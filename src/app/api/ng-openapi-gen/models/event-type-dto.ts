/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { EventTypeRevisionDto } from '../models/event-type-revision-dto';
export interface EventTypeDto {
  context: 'GAME' | 'ROUND';
  createDateTime: string;
  description: string;
  hasComment: boolean;
  id: string;
  isDeleted: boolean;
  lastChangedDateTime: string;
  multiplicatorUnit?: string;
  penaltyUnit?: 'EURO' | 'BEER_CRATE';
  penaltyValue?: number;
  revisions?: Array<EventTypeRevisionDto>;
  trigger?: 'START_NEW_ROUND' | 'SCHOCK_AUS' | 'SCHOCK_AUS_PENALTY';
}
