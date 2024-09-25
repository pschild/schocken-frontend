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


export interface EventTypeDetailDto { 
    id: string;
    description: string;
    trigger?: EventTypeDetailDto.TriggerEnum;
    multiplicatorUnit?: string;
}
export namespace EventTypeDetailDto {
    export type TriggerEnum = 'START_NEW_ROUND' | 'SCHOCK_AUS' | 'SCHOCK_AUS_PENALTY';
    export const TriggerEnum = {
        StartNewRound: 'START_NEW_ROUND' as TriggerEnum,
        SchockAus: 'SCHOCK_AUS' as TriggerEnum,
        SchockAusPenalty: 'SCHOCK_AUS_PENALTY' as TriggerEnum
    };
}

