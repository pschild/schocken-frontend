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
import { EventDetailDto } from './eventDetailDto';
import { RoundDetailDto } from './roundDetailDto';
import { PlaceDto } from './placeDto';


export interface GameDetailFullDto { 
    id: string;
    datetime: string;
    completed: boolean;
    excludeFromStatistics: boolean;
    place: PlaceDto;
    rounds: Array<RoundDetailDto>;
    events: Array<EventDetailDto>;
}

