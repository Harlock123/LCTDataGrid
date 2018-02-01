# LCTDataGrid
Yet another DataGrid because I hate something about every other Javascript Data Grid out there 

I started implementing this in TypeScript mainly to acclimate myself with creation of a lightweight control for my DataGrid needs. Being unimpressed with the effort necesary to employ other "Grid" in my projects. Implemented as a rendering component onto an HTML Canvas as opposed to a highly stylized set of HTML table elements, I feel it should be responsive enough even on low power systems and mobile devices, where a DOM approach would create a very sluggish operation environment on a grid with a LOT of data. Care will be execised to keep the Canvas object as smll as possible by ony rendering the visible parts of the resulting Grid, even as there may be thousands of Cells that are effecfivly OFF-Screen...

