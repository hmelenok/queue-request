import {queueRequest} from './index';

describe('#queueRequest', () => {
  it('we should call multiple Promise functions from 1 variable', async () => {
    const apiMock = jest.fn();
    const APIRequest = async (params: number) =>
      new Promise<any>(resolve => {
        {
          setTimeout(() => {
            resolve(apiMock(params));
          }, 100);
        }
      });
    await Promise.all(
      [
        {call: APIRequest, params: 1},
        {call: APIRequest, params: 2},
        {call: APIRequest, params: 3},
        {call: APIRequest, params: 4},
      ].map(({call, params}) => call(params))
    );

    expect(apiMock).toHaveBeenCalledTimes(4);
  });

  it('should call call API Promise only once', async () => {
    const apiMock = jest.fn();
    const APIRequest = async (params: number) =>
      new Promise<any>(resolve => {
        {
          setTimeout(() => {
            resolve(apiMock(params));
          }, 100);
        }
      });
    await Promise.all([
      queueRequest({request: APIRequest, params: 1}),
      queueRequest({request: APIRequest, params: 2}),
      queueRequest({request: APIRequest, params: 3}),
      queueRequest({request: APIRequest, params: 4}),
    ]);

    expect(apiMock).toHaveBeenCalledTimes(1);
  });

  it('should call call API Promise twice as timer ended', async () => {
    const apiMock = jest.fn();
    const APIRequest = async (params: number) =>
      new Promise<any>(resolve => {
        {
          setTimeout(() => {
            resolve(apiMock(params));
          }, 0);
        }
      });
    await Promise.all([
      queueRequest({request: APIRequest, params: 1, processDelay: 90}),
      queueRequest({request: APIRequest, params: 2}),
      queueRequest({request: APIRequest, params: 3}),
      queueRequest({request: APIRequest, params: 4}),
    ]);

    await new Promise<any>(resolve => {
      {
        setTimeout(() => {
          resolve(queueRequest({request: APIRequest, params: 5}));
        }, 100);
      }
    });

    await new Promise<any>(resolve => {
      {
        setTimeout(() => {
          //@ts-ignore
          const stack = new Promise.all([
            queueRequest({request: APIRequest, params: 6}),
            queueRequest({request: APIRequest, params: 7}),
          ]);
          resolve(stack);
        }, 100);
      }
    });

    expect(apiMock).toHaveBeenCalledTimes(3);
  });
});
