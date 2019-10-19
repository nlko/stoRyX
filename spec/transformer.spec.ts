import { Transformer } from '../src';
import { hot, cold, getTestScheduler } from 'jasmine-marbles';
import { subscribeOn } from 'rxjs/operators';

describe('Transformer Tests', () => {
  it('As a USER, I can create a Transformer', () => {
    expect(new Transformer<number, string>(null)).toEqual(jasmine.any(Transformer));
  });


  it('As a USER, I can subscribe to a transforer 1.', () => {

    const source1 = cold('-0-1|');
    const result =  hot( '^0-1', ['0',  '1', ]);

    // Create the Transformer under test
    const s = new Transformer<number, string>(a => a.toString());

    source1.subscribe(s);

    // No influence on another subscription
    expect(s).toBeObservable(result);

  });

  it('As a USER, I can subscribe to a transforer 2.', () => {

    const source1 = cold('-0-1|');
    const result =  hot( '^0-1', ['0',  '1', ]);

    // Create the Transformer under test
    const s = new Transformer<number, string>(a => a.toString());

    source1.subscribe(s);

    // No influence on another subscription
    expect(s.asObservable()).toBeObservable(result);

  });

  it('As a USER, I cannot close the input of the Transformer 1.', () => {

    const source1 = cold('-0-2|');
    const source2 = cold('--1--4|');
    const source3 = cold('----3#');
    const result =  hot( '^0123', ['0', '1', '2', '3', '4']); // <- source 2 not received because it will be unsubscribed.

    // Create the Transformer under test
    const s = new Transformer<number, string>(a => a.toString());

    source1.subscribe(s);
    const sub = source2.subscribe(s);
    source3.subscribe(s);

    // Unsubscribe earlier
    getTestScheduler().schedule(() => sub.unsubscribe(), 40);

    // No influence on another subscription
    expect(s).toBeObservable(result);

  });

  it('As a USER, I cannot close the output of the Transformer 2.', () => {

    const source1 = cold('-0-2|');
    const source2 = cold('--1|');
    const source3 = cold('----3#');
    const result = hot('^0123');

    // Create the transformer under test
    const s = new Transformer<number, string>(a => a.toString());

    source1.subscribe(s);
    source2.subscribe(s);
    source3.subscribe(s);

    const dummySub = s.subscribe();

    // Unsubscribe earlier
    getTestScheduler().schedule(() => dummySub.unsubscribe(), 20);

    // No influence on another subscription
    expect(s).toBeObservable(result);
  });


  it('As a USER, receive the latest values on subscribe.', () => {

    const source1 = cold('-0-2|');
    const source2 = cold('--1|');
    const source3 = cold('----3#');
    const result = hot('--------(23)');

    // Create the transformer under test
    const s = new Transformer<number, string>(a => a.toString(), 2);

    source1.subscribe(s);
    source2.subscribe(s);
    source3.subscribe(s);

    const delayedSubject = s.pipe(subscribeOn(getTestScheduler(), 80));

    expect(delayedSubject).toBeObservable(result);

  });
});
