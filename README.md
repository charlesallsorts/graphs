# Dict Graph Builder

A small web application for creating and visualising graphs from Python dictionaries.

## Features

- Build a graph from a simple form
- Live graph visualisation
- Automatic generation of the corresponding Python dictionaries
- Edit the generated dictionaries directly
- Load edited dictionaries back into the form
- Drag nodes to rearrange the graph
- Zoom and pan the graph
- **Re-layout** button to automatically arrange the graph

## Usage

1. Open the application in a web browser.
2. Fill in the graph information using the form.
3. The graph appears in the visualisation area.
4. The corresponding Python dictionaries appear in the **Python dicts** section.
5. Click **Copy** to copy the generated dictionaries.
6. Edit the dictionaries if needed, then click **Apply to form** to update the graph.
7. Drag nodes, zoom, or pan to explore the graph.

## Project Structure

```
.
├── index.html
├── style.css
└── main.js
```

| File         | Description                                                   |
| ------------ | ------------------------------------------------------------- |
| `index.html` | Application layout and interface                              |
| `style.css`  | Styling for the application                                   |
| `main.js`    | Graph creation, dictionary generation, and user interactions  |

## Running the Application

No server or build step is required. Simply open `index.html` directly in a modern web browser.

```bash
# Clone the repository
git clone https://github.com/<your-username>/dict-graph-builder.git
cd dict-graph-builder

# Then open index.html in your browser
```

## Contributing

Contributions are welcome! If you'd like to improve Dict Graph Builder, whether by adding a feature, fixing a bug, or making another improvement, please:

1. Fork the repository
2. Create a new branch for your changes
3. Commit your changes
4. Open a Pull Request (PR)

We'll review your PR and, if everything looks good, merge it.

Thanks for helping improve Dict Graph Builder!