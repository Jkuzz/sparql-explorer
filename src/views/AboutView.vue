<template>
  <div class="bg-slate-800 text-gray-200 p-8 flex flex-col items-center space-y-10">
    <h1 class="text-4xl p-4 font-semibold">About TypeSPARQ</h1>
    <div
      class="p-4 bg-slate-700 rounded-md max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl space-y-4 text-justify"
    >
      <p>
        TypeSPARQ was created at the
        <a
          class="text-blue-400 font-semibold"
          href="https://www.mff.cuni.cz/en"
          >Faculty of Mathematics and Physics</a
        >
        at Charles University as a part of my Bachelor thesis. You can find the thesis
        <a
          class="text-blue-400 font-semibold"
          href=""
          >here once it's done :)</a
        >. In the thesis, you can find further developer, user and administrator documentation, as
        well as a more detailed analysis of the schema extraction process.
      </p>
      <p>
        This is an open source project and you can view the code, contribute or report any issues
        you find by visiting the project's
        <a
          class="text-blue-400 font-semibold"
          href=""
          >GitHub page</a
        >. This application has a live demo available on
        <a
          class="text-blue-400 font-semibold"
          href="https://jkuzz.github.io/sparql-explorer/"
          >GitHub Pages</a
        >.
      </p>
    </div>
    <h2 class="text-2xl font-semibold">How to use TypeSPARQ</h2>
    <div
      class="p-4 bg-slate-700 rounded-md max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl space-y-4 text-justify"
    >
      <p>
        To begin exploring an endpoint, press the
        <span class="text-orange-400 font-bold">Select endpoint</span>
        button and insert your endpoint's url. Make sure that the URL points to the SPARQL endpoint
        directly. Once an endpoint is selected, schema extraction queries will be issued. You can
        track their progress in the sidebar. As the queries resolve, their results will be
        immediately added to the visualisation. The visualised nodes can be rearranged by dragging,
        zooming is performed using the mouse wheel. The nodes can be placed in one of the available
        layouts by expanding the layout slider on the top right and selecting a layout.
      </p>
      <p>
        To see details about a class, click any of the class nodes to display a modal dialogue
        window. The modal dialogue shows information about the class. Here, the class' attributes
        and incoming and outgoing edges can be seen, alongside their types and occurrences. The node
        modal allows you to select the class, at which point it will show up in the sidebar and be
        included in the schema export. Similarly, attributes and edges can be selected as well.
      </p>
    </div>
    <img
      src="@/assets/typesparq-process.jpg"
      class="rounded-md"
    />
    <div
      class="p-4 bg-slate-700 rounded-md max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl space-y-4 text-justify"
    >
      <p>
        More classes beyond the initial 10 can be queried. To do this, click the
        <span class="text-orange-400 font-bold">More classes</span>
        button and select the number of classes. Be mindful of visualising a large number of
        classes, as the number of queries for edges between classes grows exponentially.
      </p>
      <p>
        To import a schema into the application, click the
        <span class="text-orange-400 font-bold">Import</span>
        button in the sidebar and select an import format in the displayed dialogue window. You can
        view the schema definition by clicking the
        <span class="text-orange-400 font-bold">Schema</span>
        button on the bottom left. The input text is validated against this schema once the
        <span class="text-orange-400 font-bold">Import</span>
        button in pressed. If valid, the schema will be immediately available in the visualisation.
        If the parser refuses the schema, an error will be displayed. Be mindful when importing a
        schema, since semantic errors will likely not be reported. Watch out for issues such as
        defining edges between non-existent node IRIs or duplicate class IRIs.
      </p>
      <p>
        To export the selected schema parts, click the
        <span class="text-orange-400 font-bold">Export</span>
        button in the sidebar. An export dialogue will open, presenting a selection of possible
        export formats. Selecting one will generate the corresponding output and present it. Here,
        the schema can be copied or downloaded as a file.
      </p>
    </div>
  </div>
</template>
