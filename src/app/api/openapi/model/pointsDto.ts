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


export interface PointsDto { 
    rank: number;
    playerId: string;
    name: string;
    roundPoints: number;
    bonusPoints: number;
    penaltyPoints: number;
    gamePoints: number;
    points: number;
    attended?: boolean;
    tendency?: number;
}

