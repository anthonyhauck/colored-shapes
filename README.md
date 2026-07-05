# Colored Shapes

Add colored status rings or squares to any character token in [Owlbear Rodeo](https://owlbear.rodeo/) to track conditions, initiative, targeting, or anything else your table needs.

Rings are drawn as open arcs with a gap at the bottom so token labels stay visible, and multiple shapes stack with automatic scaling so they never overlap.

## Installing

Install from the [Owlbear Rodeo store](https://extensions.owlbear.rodeo/), or add it manually with the manifest URL:

```
https://anthonyhauck.github.io/colored-shapes/manifest.json
```

## How to Use

1. Select one or more character tokens on the map
2. Right-click (or use the context menu) and click the **Colored Shapes** icon
3. Pick a color to add a ring or square — pick the same color again to remove it
4. Use the toggle at the top of the panel to switch between **ring** and **square** shapes

## How it Works

This is a simple TypeScript app built with [Vite](https://vitejs.dev/).

- `background.ts` communicates with Owlbear Rodeo to register a context menu item on character tokens. Clicking it opens a popup rendered from `main.ts`.
- `main.ts` renders the popover UI (shape toggle and color buttons) and adds or removes shapes on the selected tokens.
- `helpers.ts` builds the ring/square geometry and keeps stacked shapes scaled so they nest without gaps.

## Building

This project uses [Yarn](https://yarnpkg.com/) as its package manager.

Install dependencies:

```
yarn
```

Run in development mode:

```
yarn dev
```

Make a production build:

```
yarn build
```

## License

GNU GPLv3

## Contributing

This project is an enhanced example of using the Owlbear Rodeo SDK.

Copyright (C) 2026 Owlbear Rodeo & Anthony Hauck for derivative aspects.
