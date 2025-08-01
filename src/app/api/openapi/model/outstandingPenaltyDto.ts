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


export interface OutstandingPenaltyDto { 
    name: string;
    outstandingValueSum: number;
    penaltyUnit: OutstandingPenaltyDto.PenaltyUnitEnum;
    count: number;
    datetime: string | null;
}
export namespace OutstandingPenaltyDto {
    export type PenaltyUnitEnum = 'EURO' | 'BEER_CRATE';
    export const PenaltyUnitEnum = {
        Euro: 'EURO' as PenaltyUnitEnum,
        BeerCrate: 'BEER_CRATE' as PenaltyUnitEnum
    };
}


