/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { PenaltyDto } from '../models/penalty-dto';
import { PlaceDto } from '../models/place-dto';
export interface GameOverviewDto {
  completed: boolean;
  datetime: string;
  excludeFromStatistics: boolean;
  id: string;
  penalties: Array<PenaltyDto>;
  place: PlaceDto;
  roundCount: number;
}
