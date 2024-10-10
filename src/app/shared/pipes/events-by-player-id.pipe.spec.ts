import { EventsByPlayerIdPipe } from './events-by-player-id.pipe';

describe('EventsByPlayerIdPipe', () => {
  it('create an instance', () => {
    const pipe = new EventsByPlayerIdPipe();
    expect(pipe).toBeTruthy();
  });
});
