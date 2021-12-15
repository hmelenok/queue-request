/**
 * Collector for params
 */
const paramsMap = new Map();
/**
 * Set of requests:
 * - Easy to identify function signature
 */
const requestSet = new Set();
/**
 * Map or promises:
 * - Unification of Promise to single point
 */
const promiseMap = new Map();

export const queueRequest = async <T>({
  request,
  params,
  processDelay,
}: {
  request: (params: T) => Promise<any>;
  params: any;
  processDelay?: number;
}) => {
  /**
   * Assign params to Map by request
   */
  paramsMap.set(request, [...(paramsMap.get(request) || []), params]);

  /**
   * Check requestSet to existing function signature
   */
  if (!requestSet.has(request)) {
    /**
     * Create Promise pointer
     */
    const ongoingRequest = new Promise((resolve, reject) => {
      /**
       * Add request signature to Set
       */
      requestSet.add(request);

      /**
       * Put invocation to end of stack
       */
      setTimeout(() => {
        try {
          /**
           * Invoke Promise request after timer expiration
           * with params from paramsMap
           */
          resolve(request(paramsMap.get(request)));
        } catch (ex) {
          reject(ex);
        }
        /**
         * Cleanup: batch of changes ended
         * - remove request, params, promise
         */
        requestSet.delete(request);
        paramsMap.delete(request);
        promiseMap.delete(request);
      }, processDelay); /* Can be 0 - end of stack or any time */
    });

    /**
     * Add Promise sync. in map for next invocation in stack
     */
    promiseMap.set(request, ongoingRequest);

    /**
     * return Promise pointer
     */
    return ongoingRequest;
  }

  /**
   * return prev Promise pointer if request signature detected
   */
  return promiseMap.get(request);
};

export default queueRequest;
