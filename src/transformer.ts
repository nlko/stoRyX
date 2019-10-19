import { ReplaySubject } from 'rxjs';

/** A simple transformation pipe.
 *
 * The content value can be updated using regular ReplaySuject method.
 *
 * It is possible to subscribe to content change event like a regular ReplaySuject.
 * Upon subscription, by default, the last value is NOT returned.
 *
 * A S parameter allows to define the type of input data while a R parameter
 * allows to define the type of output data.
 *
 * It is mandatory to provide a function that transform type S to R. A transformer
 * can be viewed like a `map` operator.
 *
 * Since it's backed by a ReplaySuject, there can be several producer sending data on the input
 * and serveral client listening for new data on the output.
 *
 * @param T - The type of the transformation pipe input.
 * It can be an a literal, an object, an array,...
 * @param R - The type of the transformation pipe output.
 * It can be an a literal, an object, an array,...
 */
export class Transformer <T, R = T> extends ReplaySubject<R> {
  /**
   * Examples:
   *
   * ```
   *
   * // create the transformation pipe
   * const trans = new Transformer(x => {
   *   return  'value:' + x.toString();
   * });
   *
   * One client subscribe
   * trans.subscribe(console.dir);
   *
   * One producer register
   * range(0, 5).subscribe(trans);
   * ```
   *
   * The console will display
   * ```
   * 'value:0'
   * 'value:1'
   * 'value:2'
   * 'value:3'
   * 'value:4'
   *
   * ```
   *
   * @param op - the transformation function.
   * @param bufferSize - the size of the underlying ReplaySubject buffer (0 = do not replay the last upon subscription)
   *
   */
  constructor(private op: (a: T) => R, bufferSize = 0) {
    super(bufferSize);
  }

  /** Observer next handler
   * The transformation pipe apply the transformation function on the input.
   * @param value - Input value (must be of type T)
   */
  next(value?: T|R) {
    // Call the transformer function and
    // pass it to the original next value.
    // since it's not possible to change the next signature I had to
    // to access T and R while I only want a T type. And
    // I needed this ugly cast...
    super.next(this.op(value as unknown as T));
  }

  /** Observer error handler
   * The transformation pipe doesn't forward error events.
   */
  error(err: any) { }

  /** Observer complete handler
   * The transformation pipe doesn't forward complete events.
   */
  complete() { }
}
