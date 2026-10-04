# Dict Graph Builder

 Dict Graph Builder is a small web application for creating and visualising graphs from Python dictionaries.

 ## What it does

 The application provides a simple form where you can enter graph information. It then:

 - Creates a visual graph from the entered data.
- Generates the corresponding Python dictionaries.
- Lets you edit the generated dictionaries directly.
- Allows the edited dictionaries to be loaded back into the form.
- Supports dragging nodes to rearrange the graph.
- Supports zooming and panning the graph.
- Provides a **Re-layout** button to automatically arrange the graph.

 ## How to use

 1. Open the application in a web browser.
2. Fill in the graph information using the form.
3. The graph will be displayed in the visualisation area.
4. The corresponding Python dictionaries will appear in the **Python dicts** section.
5. Use **Copy** to copy the generated dictionaries.
6. You can edit the dictionaries and select **Apply to form** to update the graph.
7. Drag nodes, zoom, or pan the graph to explore it.

 ## Files

```
.
├── index.html
├── style.css
└── main.js
```

 - `index.html` — Application layout and interface.
- `style.css` — Styling for the application.
- `main.js` — Graph creation, dictionary generation, and interactions.

 ## Running the application
 No server is required. Open `index.html` directly in a modern web browser.

