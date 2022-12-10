# HW6 Milestone C

## Instructions

Clone Coding Method University's framework code from [this repository](https://github.com/CMU-17-214/hw6-coding-method-university-public), and follow the instructions below to add my plugins.

### Codecademy Data Plugin

My data plugin retrieves course information from the [Codecademy website](https://www.codecademy.com/) using web scraping. To install it, do the following:

1. Add the `CodecademyPlugin.java` file from this folder to the `backend/src/main/java/edu/cmu/cs/cs214/analyzer/plugin` directory.

2. In the `backend/src/main/resources/META-INF/services/edu.cmu.cs.cs214.analyzer.framework.core.DataPlugin` file, add a new line with the text "edu.cmu.cs.cs214.analyzer.plugin.CodecademyPlugin".

3. In the `backend/pom.xml` file, add the following so that it's nested under `<dependencies>`:
```xml
<dependency>
    <groupId>org.jsoup</groupId>
    <artifactId>jsoup</artifactId>
    <version>1.15.3</version>
</dependency>
```

The data plugin should now show up when starting the program! Be aware that it might take a minute or so for the plugin to load. Because of this, loading progress is logged to the terminal where the backend is running.

### Table Visualization Plugin

My new visualization plugin displays course information in a sortable and filterable table. To install it, do the following:

1. Add the `TableVisualizer.tsx` and `tabulator.css` files from this folder into the `frontend/src/plugin/` directory.

2. In `frontend/src/plugins.txt`, add a new line with the text "TableVisualizer".

3. In `frontend/package.json`, add the following line under `"dependencies"`:
```javascript
"react-tabulator": "^0.18.1",
```

4. Make sure to run `npm install` before starting the frontend server.

The visualization plugin should now show up when starting the program!