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


export interface UpdateEventDto { 
    datetime?: string;
    multiplicatorValue?: number;
    comment?: string;
    context?: UpdateEventDto.ContextEnum;
    gameId?: string;
    roundId?: string;
    playerId?: string;
    eventTypeId?: string;
}
export namespace UpdateEventDto {
    export type ContextEnum = 'GAME' | 'ROUND';
    export const ContextEnum = {
        Game: 'GAME' as ContextEnum,
        Round: 'ROUND' as ContextEnum
    };
}

