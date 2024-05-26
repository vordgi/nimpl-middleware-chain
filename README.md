# @nimpl/middleware-chain

The package allows you to create a chain of native next.js middlewares without any modifications (*i.e., you can add any ready-made middleware to the chain*)

```ts
// middleware.ts
import { chain } from "@nimpl/middleware-chain";

export default chain([
    intlMiddleware,
    authMiddleware,
    customMiddleware,
]);
```

Visit https://nimpl.tech/middleware-chain to view the full documentation.

## Installation

**Using npm:**
n the format of its API.

```bash
npm i @nimpl/middleware-chain
```

**Using yarn:**

```bash
yarn add @nimpl/middleware-chain
```

## Examples

* [Base example](https://github.com/vordgi/nimpl-middleware-chain/tree/main/examples/base).
* [next-auth + next-intl example](https://github.com/vordgi/nimpl-middleware-chain/tree/main/examples/auth-intl).

## Additional

Please consider giving a star if you like it, it shows that the package is useful and helps continue work on this and other packages.

Create issues for identified issues, desired getters, or various improvements.

## License

[MIT](https://github.com/vordgi/nimpl-middleware-chain/blob/main/LICENSE)
