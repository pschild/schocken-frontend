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
import { PenaltyDto } from './penaltyDto';
import { EventDetailDto } from './eventDetailDto';


export interface RoundDetailDto { 
    id: string;
    datetime: string;
    attendees: Array<string>;
    finalists: Array<string>;
    events: Array<EventDetailDto>;
    penalties: Array<PenaltyDto>;
    schockAusCount: number;
    hasFinal: boolean;
    warnings?: Array<string>;
}

