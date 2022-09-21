<p align="center">
    <i>React implementation of the <a href="https://www.systeme-de-design.gouv.fr/">DSFR</a></i>
</p>

WIP

# Install

```bash
yarn add react_dsfr
```

`package.json`

```diff
 "scripts": {
+    "postinstall": "update_dsfr_static_resources"
 }
```

`.gitignore`

```diff
+ /public/dsfr
```

## Single page applications

If you are using [Create React App](https://create-react-app.dev/) or [Vite](https://vitejs.dev/) or a similar SPA framework.

`public/index.html` ( or `/index.html` depending of your Framework )

```diff
+  <!-- For preventing https://fonts.google.com/knowledge/glossary/fout -->
+  <link rel="preload" href="/dsfr/fonts/Marianne-Light.woff2" as="font" crossorigin="anonymous">
+  <link rel="preload" href="/dsfr/fonts/Marianne-Light_Italic.woff2" as="font" crossorigin="anonymous">
+  <link rel="preload" href="/dsfr/fonts/Marianne-Regular.woff2" as="font" crossorigin="anonymous">
+  <link rel="preload" href="/dsfr/fonts/Marianne-Regular_Italic.woff2" as="font" crossorigin="anonymous">
+  <link rel="preload" href="/dsfr/fonts/Marianne-Medium.woff2" as="font" crossorigin="anonymous">
+  <link rel="preload" href="/dsfr/fonts/Marianne-Medium_Italic.woff2" as="font" crossorigin="anonymous">
+  <link rel="preload" href="/dsfr/fonts/Marianne-Bold.woff2" as="font" crossorigin="anonymous">
+  <link rel="preload" href="/dsfr/fonts/Marianne-Bold_Italic.woff2" as="font" crossorigin="anonymous">
+  <link rel="preload" href="/dsfr/fonts/Spectral-Regular.woff2" as="font" crossorigin="anonymous">
+  <link rel="preload" href="/dsfr/fonts/Spectral-ExtraBold.woff2" as="font" crossorigin="anonymous">

+  <link rel="stylesheet" href="/dsfr/dsfr.min.css">
```

> NOTE: If you are using CRA you might want to use `%PUBLIC_URL%` [like so](https://github.com/codegouvfr/react_dsfr/blob/c13d1066b188a509d5808aa6c87722bedc35f21f/src/test/apps/cra/public/index.html#L10-L21) if you are hosting your app under a subpath.

`src/index.tsx`

```diff
+import { startReactDsfr } from "react_dsfr";
+startReactDsfr({ "defaultColorScheme": "system" });
```

## Next.js

# Use of assets

If you read [in the DSFR documentation](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/parametres-d-affichage) something like:

```html
<svg>
    <use xlink:href="../../../dist/artwork/dark.svg#artwork-minor" />
</svg>
```

You would do this in React:

```tsx
import artworkDarkSvgUrl from "react_dsfr/dsfr/artwork/dark.svg";

//...

<svg>
    <use xlinkHref={`${artworkDarkSvgUrl}#artwork-minor`} />
</svg>;
```

# Development

```bash
yarn
yarn build
npx tsc -w

# Open another Terminal

yarn start_cra  # For testing in in a Create React App setup
yarn start_next # For testing in a Next.js setup
```

## How to publish a new version on NPM, how to release a beta version

This repo was bootstrapped form [garronej/ts-ci](https://github.com/garronej/ts-ci) have a look at the
documentation of this starter for understanding the lifecycle of this repo.
