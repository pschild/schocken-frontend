/**
 * schocken-backend API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { GameDto } from './gameDto';
import { PlayerDto } from './playerDto';
import { RoundDto } from './roundDto';
import { EventTypeDto } from './eventTypeDto';


export interface EventDto { 
    id: string;
    createDateTime: string;
    lastChangedDateTime: string;
    datetime: string;
    multiplicatorValue: number;
    penaltyValue?: number;
    penaltyUnit?: EventDto.PenaltyUnitEnum;
    comment: string;
    context: EventDto.ContextEnum;
    game?: GameDto;
    round?: RoundDto;
    player: PlayerDto;
    eventType: EventTypeDto;
}
export namespace EventDto {
    export type PenaltyUnitEnum = 'EURO' | 'BEER_CRATE';
    export const PenaltyUnitEnum = {
        Euro: 'EURO' as PenaltyUnitEnum,
        BeerCrate: 'BEER_CRATE' as PenaltyUnitEnum
    };
    export type ContextEnum = 'GAME' | 'ROUND';
    export const ContextEnum = {
        Game: 'GAME' as ContextEnum,
        Round: 'ROUND' as ContextEnum
    };
}


