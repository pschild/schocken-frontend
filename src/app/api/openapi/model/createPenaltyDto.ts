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


export interface CreatePenaltyDto { 
    penaltyValue?: number;
    penaltyUnit?: CreatePenaltyDto.PenaltyUnitEnum;
}
export namespace CreatePenaltyDto {
    export type PenaltyUnitEnum = 'EURO' | 'BEER_CRATE';
    export const PenaltyUnitEnum = {
        Euro: 'EURO' as PenaltyUnitEnum,
        BeerCrate: 'BEER_CRATE' as PenaltyUnitEnum
    };
}


