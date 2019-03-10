## Setup
### Babel
I'm using Typescript for type-checking only during development, and Babel for everything else including transpilation. See related [dev blog](https://devblogs.microsoft.com/typescript/typescript-and-babel-7/), [repo](https://github.com/Microsoft/TypeScript-Babel-Starter) and [post](https://iamturns.com/typescript-babel/).

__@babel/env__ 
 - `"useBuiltIns": "usage"` is still experimental but seems to work
 - `"modules": false` is [required](https://webpack.js.org/guides/tree-shaking/#conclusion) for tree shaking along with `sideEffects` in package.json

__import__
[babel-plugin-import](https://www.npmjs.com/package/babel-plugin-import) is required for shorter antd imports. `style: true` import source CSS that go through my Webpack optimizers. 

### Webpack
LESS loader for antd has to have `javascriptEnabled: true`.

Antd still doesn't support on-demand import of SVG icons. Temporary workaround: [manual re-export via an alias](https://github.com/ant-design/ant-design/issues/12011#issuecomment-423173228).

## Ideas
 - Multiple tag select input for skills