# AGENTS.md

Notes for anyone, human or AI agent, changing this code. `README.md` lists the grid's properties and methods and
shows how to put it on a page; this file covers how the repo fits together.

## What this is

LCTDataGrid, a lightweight data grid for the browser, written in TypeScript. It draws the whole grid onto an HTML
`<canvas>` instead of building table elements, drawing only the visible cells, so it stays quick with large data
sets. It runs in the browser only.

## Commands

```bash
npm install                                  # only the @types/jquery typings
npx -p typescript tsc                        # compile LCTDataGrid.ts to LCTDataGrid.js and .js.map (tsconfig.json)
python3 -m http.server 5500                  # serve the folder; then open http://localhost:5500/index.html
```

TypeScript itself is not in `package.json`, so `tsc` comes from `npx` or a global install. The demo page loads its
sample data from `http://localhost:5500/` (the port VS Code's Live Server uses), so serve on that port. There are
no tests; check changes by hand in `index.html`.

## Layout

- `LCTDataGrid.ts`: the whole grid, in one file.
  - `class LCTDataGrid` takes the canvas element. It reads styling from CSS custom properties, measures columns,
    draws the title, header, rows and scroll bars (`RedrawCanvas`), and handles the mouse, wheel, touch and keys.
  - `class CELLCLICKEDMETADATA` is the payload for cell events: the cell text, row, column and column name.
- `LCTDataGrid.js`, `LCTDataGrid.js.map`: compiler output, committed so the page runs without a build.
- `index.html`: the demo and test page. It styles the grid, wires up the events and has buttons that load the
  sample data.
- `CaseManagerQueue.json`, `TESTLARGEJSONDATA.json`: sample data in the `{ "Header": [...], "Data": [...] }` shape
  that `PopulateFromJSONUrl` and `SetDataFromJSONCall` read.
- `IMGs/`: README screenshots, plus `dir.png` and `file.png`, which the grid loads for image columns.
- `JS/`: a vendored jQuery 1.10.2, used by the demo page. `node_modules/` (the typings) is committed too.

## Rules that keep it working

- **Edit the TypeScript, then compile.** Never hand-edit `LCTDataGrid.js`; change `LCTDataGrid.ts`, run `tsc`, and
  commit the `.ts`, `.js` and `.js.map` together.
- **A global class, not a module.** The class is not exported, so the compiled file defines `LCTDataGrid` as a
  global for a plain `<script>` tag. Adding `export` would break pages that use it that way.
- **Events are DOM events on the canvas.** The grid dispatches `CELLCLICKED`, `CELLHOVERED`, `CELLDOUBLECLICKED`,
  `MOUSEDOVER` and `MOUSEOUT` as `CustomEvent`s; pages listen with `addEventListener`. Keep those names.
- **Styling through CSS variables.** `ApplyCustomCSSAttributes` reads custom properties such as
  `--GridHeaderBackColor` from the canvas's CSS class. New visual settings should follow the same pattern and get a
  `Set...` method.
- **Image paths are relative.** Image columns load `./IMGs/dir.png` and `./IMGs/file.png` relative to the page.
- **Redraw after changes.** Setters that change the layout call `FillCanvas()` or `RedrawCanvas()`; new setters
  must do the same.

## Making a change

- Change `LCTDataGrid.ts`, compile, and try the demo page with both sample data files, including scrolling.
- Update the property and method lists in `README.md` to match.
