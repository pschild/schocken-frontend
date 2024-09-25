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
import { EventTypeDto } from './eventTypeDto';


export interface EventTypeRevisionDto { 
    id: string;
    type: EventTypeRevisionDto.TypeEnum;
    createDateTime: string;
    lastChangedDateTime: string;
    description: string;
    context: EventTypeRevisionDto.ContextEnum;
    trigger?: EventTypeRevisionDto.TriggerEnum;
    penaltyValue?: number;
    penaltyUnit?: EventTypeRevisionDto.PenaltyUnitEnum;
    multiplicatorUnit?: string;
    hasComment: boolean;
    eventType: EventTypeDto;
}
export namespace EventTypeRevisionDto {
    export type TypeEnum = 'INSERT' | 'UPDATE' | 'REMOVE';
    export const TypeEnum = {
        Insert: 'INSERT' as TypeEnum,
        Update: 'UPDATE' as TypeEnum,
        Remove: 'REMOVE' as TypeEnum
    };
    export type ContextEnum = 'GAME' | 'ROUND';
    export const ContextEnum = {
        Game: 'GAME' as ContextEnum,
        Round: 'ROUND' as ContextEnum
    };
    export type TriggerEnum = 'START_NEW_ROUND' | 'SCHOCK_AUS' | 'SCHOCK_AUS_PENALTY';
    export const TriggerEnum = {
        StartNewRound: 'START_NEW_ROUND' as TriggerEnum,
        SchockAus: 'SCHOCK_AUS' as TriggerEnum,
        SchockAusPenalty: 'SCHOCK_AUS_PENALTY' as TriggerEnum
    };
    export type PenaltyUnitEnum = 'EURO' | 'BEER_CRATE';
    export const PenaltyUnitEnum = {
        Euro: 'EURO' as PenaltyUnitEnum,
        BeerCrate: 'BEER_CRATE' as PenaltyUnitEnum
    };
}

