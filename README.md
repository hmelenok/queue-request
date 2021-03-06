# queue-request

> queue-request - library to collect duplicated async task in 1 queve, make 1 operation and return same Promise to every request

## Problem and solution
### Problem
![Problem schema](https://raw.githubusercontent.com/hmelenok/queue-request/master/assets/Micro-queue-JS-Problem.drawio.png?raw=true)
### Possible solution
![Solution schema](https://raw.githubusercontent.com/hmelenok/queue-request/master/assets/Micro-queue-JS-Solution.drawio.png?raw=true)

## Install

```
$ yarn add queue-request

```

## Usage

```js
const queueRequest = require('queue-request');


//One place in code
queueRequest({request: APIRequest, params: 1, processDelay: 90});
//Another place in code
queueRequest({request: APIRequest, params: 2, processDelay: 90});
//Another place in code
queueRequest({request: APIRequest, params: 3, processDelay: 90});
//Another place in code
queueRequest({request: APIRequest, params: 4, processDelay: 90});

/**
 * If code was called in margin of processDelay
 * in callstack it will call API only once
 * And resolve to same code
 */

```

## Publish

```sh
$ git checkout master
$ yarn version
$ yarn publish
$ git push origin master --tags
```

## License

MIT ©
