import { EventTypeDto, EventTypeOverviewDto, GameDetailDto, PlayerDto, RoundDetailDto } from '../api/openapi';
import { InvalidArgumentError } from '../error/invalid-argument.error';
import TriggerEnum = EventTypeDto.TriggerEnum;
import ContextEnum = EventTypeDto.ContextEnum;

export function validateArguments(context: ContextEnum, gameId?: string, roundId?: string): void {
  if (context === ContextEnum.Game && !gameId) {
    throw new InvalidArgumentError(`gameId must not be undefined if context is "Game"`);
  }
  if (context === ContextEnum.Round && !roundId) {
    throw new InvalidArgumentError(`roundId must not be undefined if context is "Round"`);
  }
}

export function findEventTypeByTrigger(eventTypes: EventTypeOverviewDto[], trigger: TriggerEnum): EventTypeOverviewDto {
  const eventType = eventTypes.find(type => type.trigger === TriggerEnum.SchockAusStrafe);
  if (!eventType) {
    throw new InvalidArgumentError(`Could not find an event type with trigger ${trigger}`);
  }
  return eventType;
}

export function findRoundById(rounds: RoundDetailDto[], id: string): RoundDetailDto {
  const round = rounds.find(round => round.id === id);
  if (!round) {
    throw new InvalidArgumentError(`Could not find a round with id ${id}`);
  }
  return round;
}

export function findPlayerNameById(players: PlayerDto[], id: string): string {
  const player = players.find(player => player.id === id);
  if (!player) {
    throw new InvalidArgumentError(`Could not find a round with id ${id}`);
  }
  return player.name;
}

export function getActivePlayers(players: PlayerDto[]): PlayerDto[] {
  return players.filter(player => player.active && !player.isDeleted);
}

export function playersForGameEvents(game: GameDetailDto | null, players: PlayerDto[]): PlayerDto[] {
  if (!game) {
    return [];
  }
  const activePlayerIds = getActivePlayers(players).map(player => player.id);
  const playerIdsWithAtLeastOneGameEvent = game.events.map(event => event.playerId);
  const playerIdsForGameEvents = new Set<string>([...activePlayerIds, ...playerIdsWithAtLeastOneGameEvent]);
  return players.filter(player => playerIdsForGameEvents.has(player.id));
}

export function possiblePlayersForSchockAusStrafe(round: RoundDetailDto, players: PlayerDto[]): PlayerDto[] {
  return round.hasFinal
    ? players.filter(p => (round.finalists || []).includes(p.id))
    : players.filter(p => (round.attendees || []).includes(p.id));
}

export function selectedPlayerIdsForSchockAusStrafe(round: RoundDetailDto, playerIdWithSchockAus: string): string[] {
  return round.hasFinal
    ? (round.finalists || []).filter(id => id !== playerIdWithSchockAus)
    : (round.attendees || []).filter(id => id !== playerIdWithSchockAus);
}

export function playerIdsNotRemovableFromAttendees(round: RoundDetailDto): string[] {
  const playerIdsWithAtLeastOneRoundEvent = round.events.map(event => event.playerId);
  return Array.from(new Set([...round.finalists, ...playerIdsWithAtLeastOneRoundEvent]));
}

export function countWarnings(rounds: RoundDetailDto[]): number {
  return rounds.map(round => round.warnings).flat().length;
}
