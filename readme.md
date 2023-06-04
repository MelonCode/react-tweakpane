# React Tweakpane 🛠️

![CI](https://github.com/cocopon/tweakpane/workflows/CI/badge.svg)
[![npm version](https://badge.fury.io/js/react-tweakpane.svg)](https://badge.fury.io/js/react-tweakpane)

<img width="960" alt="preview" src="https://github.com/MelonCode/react-tweakpane/assets/3682284/554b6c4f-61e0-4a22-b3bb-931f0267a632">

Enhance your React application experience with `react-tweakpane`!<br>
This library introduces a hook-based React wrapper for Tweakpane, a compact pane library for fine-tuning parameters and monitoring value changes. 📈

For detailed information, be sure to visit the [Tweakpane documentation](https://cocopon.github.io/tweakpane/quick-tour/).

## Features 🌟

- **Smart Types**: Intelligent interpretation of variable types.<br>
  <img width="360" alt="Smart Types Demo Gif" src="https://github.com/MelonCode/react-tweakpane/assets/3682284/22fcebac-89d8-43ef-b28b-f46567883cfb">
- **Prop Change Listener**: Observes changes of passed props.
- **Memoization**: Functions and objects passed into hooks do not cause re-renders or updates unless changed.
- **Re-rendering Control**: Grants you granular control over component re-rendering in response to value changes.

> **In Development** ⚙️: Please note, `react-tweakpane` is under active development. As such, some features might be currently missing. We appreciate your patience and encourage your feedback as we continue to improve and expand this library! 🚀

## Usage 🎯

### Basic Example

Here's a basic example of how you can integrate Tweakpane in your React app:

```ts
const pane = useTweakpane({ position: { x: 0, y: 0, z: 0 } })

// With state, change will trigger re-render
const [position, setPosition] = usePaneInput(pane, 'position')

// Without react-state, changes would not trigger re-render
usePaneInput(pane, 'position', (event) => {
  const { x, y, z } = event.value
  // Do what you need
})

// You still can access setValue to write manually
const [, setValue] = usePaneInput(pane, 'position', (event) => {
  const { x, y, z } = event.value
  // Do what you need
})
```

> onChange function is memoized, so you can rest easy! 😇

### Organizing with Folders

To organize your pane with folders, use same hooks as regular, but pass folder reference instead of pane as first argument

```ts
const folder = usePaneFolder(pane, {
  title: 'Box Settings',
})

const [pos] = usePaneInput(pane, 'position')
const [rotation] = usePaneInput(pane, 'rotation')
const [scale] = usePaneInput(pane, 'scale')
```

### Customizing with Options

Pass in Tweakpane options to customize your pane and inputs:

```ts
// Tweakpane options
const pane = useTweakpane(
  {
    position: { x: 0, y: 0, z: 0 },
  },
  // Default Tweakpane params
  {
    title: 'Scene Settings',
    expanded: false,
  }
)

// Input Options
const [value, setValue] = usePaneInput(folder, 'value', {
  label: 'Pos',
  value: {
    min: -10,
    max: 10,
  },
})
```

### Using Blades ⚔️

You can add controls as rows to the pane. Tweakpane calls each row a “blade”.
Utilize various blades to enhance your pane:

```ts
// Slider Blade
const [time] = useSliderBlade(pane, {
  label: 'Time',
  value: 0.6,
  min: 0,
  max: 1,
  step: 0.01,
  format: (value) => value.toFixed(2),
})

// List blade
const [fruit] = useListBlade(pane, {
  label: 'Fruit',
  options: [
    {
      text: 'Apple 🍎',
      value: 'apple',
    },
    {
      text: 'Orange 🍊',
      value: 'orange',
    },
    {
      text: 'Banana 🍌',
      value: 'banana',
    },
  ],
  value: 'box',
  view: 'list',
})

// Text blade with number input & rounding
const [value, setValue] = useTextBlade(pane, {
  label: 'Title',
  value: 0.35,
  parse: (value) => Number(value),
  format: (value) => value.toFixed(2),
})
```

### Working with the Tweakpane API Directly 🔧

While `react-tweakpane` provides a more React-oriented interface for many common Tweakpane use cases, you still have direct access to the underlying Tweakpane object for advanced use cases not yet supported by our library.

This means that you can use any Tweakpane feature directly, as shown in this example with monitors:

```ts
const pane = useTweakpane({
  /* ... */
})

useEffect(() => {
  const tweakpane = pane.current.instance!
  tweakpane.addMonitor(PARAMS, 'wave', {
    view: 'graph',
    min: -1,
    max: 1,
  })
}, [])
```

## Roadmap 🛣️

Take a peek at what we've already made so far and our future plans for `react-tweakpane`:

- [x] **Core Functionality**
- [x] **Inputs Hooks**
- [x] **Folders Support**
- [x] **Blades Support**
- [ ] **Monitor Support**: We're working on adding support for monitors to make real-time monitoring more seamless.
- [ ] **Separators**
- [ ] **Tabs**
- [ ] **Buttons**
- [ ] **JSX Syntax**: We have plans to implement JSX syntax for a more intuitive and React-friendly experience.

Please note that these are our current plans and might change based on feedback and development progress. We highly encourage your ideas and contributions in shaping the future of `react-tweakpane`.

Stay tuned for updates! 🚀

> _Have a suggestion or a feature request? Don't hesitate to open an issue or PR!_

## How Does `react-tweakpane` Differ from `useTweaks`? 🕵️‍♂️

Both `react-tweakpane` and `useTweaks` aim to provide React-friendly interfaces for Tweakpane. However, they have some differences, and `useTweaks` seems not to be actively maintained at present. Here are some key aspects where `react-tweakpane` stands out:

1. **Structure**: react-tweakpane syntax aims to mirror conventional React patterns and align closely with the original library's design.
2. **Feature Support**: `react-tweakpane` has a different feature set. It supports blades but is currently missing buttons and separators.
3. **Direct Tweakpane Object Access**: `react-tweakpane` gives you direct access to the underlying Tweakpane object, allowing for more advanced use cases.
4. **Control Over Re-rendering**: `react-tweakpane` gives you more control on when your component re-renders after values change, potentially enhancing performance.

## License 📄

This project is open source and available under the MIT License

---

We're working hard to integrate more Tweakpane features directly into `react-tweakpane`, so stay tuned for future updates! 🚀
