/// <reference path="node_modules/@types/jquery/index.d.ts" />

class LCTDataGrid {
  TheCanvas: HTMLCanvasElement;
 
  Drawing: boolean = false;
  HorizontalScrollBarVisible: boolean = false;
  VerticleScrollBarVisible: boolean = false;
  OverScrollBars: boolean = false;
  SliderBackColor: string = "#FFFFFF";
  SliderForeColor: string = "#3f3f3f";
  SliderThickness: number = 10;
  CalculatedGridHeightTotal: number = 0;
  CalculatedGridWidthTotal: number = 0;

  lastx: number = -1;
  lasty: number = -1;

  linecolor: string = "#000000";
  backcolor: string = "#C0C0C0";

  // Outline Stuff
  OutlineOn: boolean = true;
  OutlineColor: string = "#808080";

  // Title Stuff
  Title: string = "Grid Title Here";
  TitleHeight: number = 15;
  TitleBackColor: string = "#3030C0";
  TitleForeColor: string = "#FFFFFF";
  TitleVisible: boolean = true;
  TitleFont: string = "18pt Courier";

  // actual contents stuff
  GridHeaderVisible: boolean = true;
  GridHeaderBackColor: string = "#FFFF00";
  GridHeaderForeColor: string = "#000000";
  GridHeaderOutlineColor: string = "#808080";
  GridHeaderFont: string = "14pt Courier";

  GridHeader: string[] = [];
  GridRows: string[] = [];
  GridCols: string[] = [];
  GridHeaderHeight: number = 0;

  CellBackColor: string = "#FFFFFF";
  CellHighlightBackColor: string = "#AAAAAA";
  AlternateCellBackColor: string = "#30F030";
  AlternateRowColoring: boolean = false;
  CellForeColor: string = "#000000";
  CellOutlineColor: string = "#808080";
  CellFont: string = "14pt Courier";
  CellWidths: number[] = [];
  CellHeights: number[] = [];

  HoverHighlight: boolean = true;
  RowHoveredOver: number = -1;

  CELLCLICKEDINFO: CELLCLICKEDMETADATA = null;

  HorizontalOffset: number = 0;
  VerticleOffset: number = 0;
  MaximumHorizontalOffset: number = 0;
  MaximumVerticleOffset: number = 0;
  ScrollButtonDown: boolean = false;
  LastMouseX: number = 0;
  LastMouseY: number = 0;

  private colwidths: number[] = [];

  // Event declarations for the grid
  CellClickedEvent = document.createEvent("Event");
  CellHoveredEvent = document.createEvent("Event");

  constructor(element: HTMLCanvasElement) {
    this.TheCanvas = element;
    //this.TheDiv = container;

    // Register an event listener to
    // call the resizeCanvas() function each time
    // the window is resized.
    window.addEventListener("resize", this.resizeCanvas, false);

    // for everybody else
    this.TheCanvas.addEventListener('mousewheel', this.mouseWheelEvent);

    // For Firefox
    this.TheCanvas.addEventListener('DOMMouseScroll', this.mouseWheelEvent);
    
    // other events

    this.TheCanvas.addEventListener("mousemove", this.HandleMouseMove);

    this.TheCanvas.addEventListener("mouseleave", this.HandleMouseOut);

    this.TheCanvas.addEventListener("mousedown", this.HandleMouseDown);

    this.TheCanvas.addEventListener("mouseup", this.HandleMouseUp);

    this.TheCanvas.addEventListener("touchstart", this.HandleTouchStart);

    this.TheCanvas.addEventListener("touchend", this.HandleTouchEnd);

    this.TheCanvas.addEventListener("touchmove", this.HandleTouchMove);

    this.TheCanvas.addEventListener("contextmenu", this.HandleContextMenu);

    this.TheCanvas.addEventListener("dblclick", this.HandleDoubleClick);

    this.CellClickedEvent.initEvent('CELLCLICKED', true, true);

    this.CellHoveredEvent.initEvent('CELLHOVERED', true, true);

    this.ApplyCustomCSSAttributes();

    this.InitializeGridParameters();
  }

  ApplyCustomCSSAttributes() {
    // Extract From Any custom CSS here

    var TheCSS = window.getComputedStyle(
      document.getElementsByClassName(this.TheCanvas.className)[0]
    );

    var theval = TheCSS.getPropertyValue("--GridHeaderBackColor");

    if (theval !== undefined && theval !== "") {
      this.GridHeaderBackColor = theval;
    }

    theval = TheCSS.getPropertyValue("--GridHeaderForeColor");

    if (theval !== undefined && theval !== "") {
      this.GridHeaderForeColor = theval;
    }

    theval = TheCSS.getPropertyValue("--GridHeaderOutlineColor");

    if (theval !== undefined && theval !== "") {
      this.GridHeaderOutlineColor = theval;
    }

    theval = TheCSS.getPropertyValue("--GridHeaderFont");

    if (theval !== undefined && theval !== "") {
      this.GridHeaderFont = theval;
    }

    theval = TheCSS.getPropertyValue("--GridHeader");

    if (theval !== undefined && theval !== "") {
      this.GridHeader = JSON.parse(theval);
    }

    theval = TheCSS.getPropertyValue("--TitleBackColor");

    if (theval !== undefined && theval !== "") {
      this.TitleBackColor = theval;
    }

    theval = TheCSS.getPropertyValue("--TitleForeColor");

    if (theval !== undefined && theval !== "") {
      this.TitleForeColor = theval;
    }

    theval = TheCSS.getPropertyValue("--TitleFont");

    if (theval !== undefined && theval !== "") {
      this.TitleFont = theval;
    }

    theval = TheCSS.getPropertyValue("--Title");

    if (theval !== undefined && theval !== "") {
      this.Title = theval;
    }

    theval = TheCSS.getPropertyValue("--GridRows");

    if (theval !== undefined && theval !== "") {
      this.GridRows = JSON.parse(theval); 
    }

    theval = TheCSS.getPropertyValue("--CellBackColor");

    if (theval !== undefined && theval !== "") {
      this.CellBackColor = theval; 
    }

    theval = TheCSS.getPropertyValue("--CellForeColor");

    if (theval !== undefined && theval !== "") {
      this.CellForeColor = theval; 
    }

    theval = TheCSS.getPropertyValue("--CellOutlineColor");

    if (theval !== undefined && theval !== "") {
      this.CellOutlineColor = theval; 
    }

    theval = TheCSS.getPropertyValue("--CellFont");

    if (theval !== undefined && theval !== "") {
      this.CellFont = theval; 
    }

    theval = TheCSS.getPropertyValue("--OutlineOn");

    if (theval !== undefined && theval !== "") {
      if (theval.toLowerCase().trim()==="true")
        this.OutlineOn = true;
      else
        this.OutlineOn = false;
    }

    theval = TheCSS.getPropertyValue("--OutlineColor");

    if (theval !== undefined && theval !== "") {
      this.OutlineColor = theval; 
    }

    theval = TheCSS.getPropertyValue("--AlternateCellBackColor");

    if (theval !== undefined && theval !== "") {
      this.AlternateCellBackColor = theval; 
    }

    theval = TheCSS.getPropertyValue("--AlternateRowColoring");

    if (theval !== undefined && theval !== "") {
      if (theval.toLowerCase().trim()==="true")
        this.AlternateRowColoring = true;
      else
        this.AlternateRowColoring = false;
    }

    theval = TheCSS.getPropertyValue("--TitleVisible");

    if (theval !== undefined && theval !== "") {
      if (theval.toLowerCase().trim()==="true")
        this.TitleVisible = true;
      else
        this.TitleVisible = false;
    }

    theval = TheCSS.getPropertyValue("--GridHeaderVisible");

    if (theval !== undefined && theval !== "") {
      if (theval.toLowerCase().trim()==="true")
        this.GridHeaderVisible = true;
      else
        this.GridHeaderVisible = false;
    }

    theval = TheCSS.getPropertyValue("--HoverHighlight");

    if (theval !== undefined && theval !== "") {
      if (theval.toLowerCase().trim()==="true")
        this.HoverHighlight = true;
      else
        this.HoverHighlight = false;
    }

    theval = TheCSS.getPropertyValue("--CellHighlightBackColor");

    if (theval !== undefined && theval !== "") {
      this.CellHighlightBackColor = theval; 
    }

    theval = TheCSS.getPropertyValue("--SliderBackColor");

    if (theval !== undefined && theval !== "") {
      this.SliderBackColor = theval; 
    }

    theval = TheCSS.getPropertyValue("--SliderForeColor");

    if (theval !== undefined && theval !== "") {
      this.SliderForeColor = theval; 
    }

    theval = TheCSS.getPropertyValue("--SliderThickness");

    if (theval !== undefined && theval !== "") {
      this.SliderThickness = Number(theval) ; 
    }


    //CellHighlightBackColor
  }

  resize() {
    // Lookup the size the browser is displaying the canvas.
    // Make it visually fill the positioned parent

    this.TheCanvas.style.width = "100%";
    this.TheCanvas.style.height = "100%";
    // ...then set the internal size to match
    this.TheCanvas.width = this.TheCanvas.clientWidth;
    this.TheCanvas.height = this.TheCanvas.clientHeight;

    this.ClearCanvas();
    this.RedrawCanvas();

    //this.HorizontalOffset = 0;
    //this.VerticleOffset = 0;
  }

  resizeCanvas = (ev: UIEvent) => {
    //this.resize();
    this.FillCanvas();
  };

  SetGridOutline(flag: boolean){
    this.OutlineOn = flag;
    this.FillCanvas();
  }

  SetGridOutlineColor(col: string) {
    this.OutlineColor = col;
    this.FillCanvas();
  }

  SetCellBackColor(col: string) {
    this.CellBackColor = col;
    this.FillCanvas();
  }

  SetCellForeColor(col: string) {
    this.CellForeColor = col;
    this.FillCanvas();
  }

  SetAlternateCellBackColor(col: string) {
    this.AlternateCellBackColor = col;
    this.FillCanvas();
  }

  SetHoverHighlight(trigger: boolean) {
    this.HoverHighlight = trigger;
    this.FillCanvas();
  }

  SetAlternateRowColoring(trigger: boolean) {
    this.AlternateRowColoring = trigger;
    this.FillCanvas();
  }

  SetTitleBackColor(col: string) {
    this.TitleBackColor = col;
    this.FillCanvas();
  }

  SetTitleForeColor(col: string) {
    this.TitleForeColor = col;
    this.FillCanvas();
  }

  SetTitleFont(fnt: string) {
    this.TitleFont = fnt;
    this.FillCanvas();
  }

  SetTitleVisible(flag: boolean) {
    this.TitleVisible = flag;
    this.FillCanvas();
  }

  SetHeaderVisible(flag: boolean) {
    this.GridHeaderVisible = flag;
    this.FillCanvas();
  }

  SetHeaderBackgroundColor(col: string) {
    this.GridHeaderBackColor = col;
    this.FillCanvas();
  }

  SetHeaderForeGroundColor(col: string) {
    this.GridHeaderForeColor = col;
    this.FillCanvas();
  }

  SetHeaderOutlineColor(col: string) {
    this.GridHeaderOutlineColor = col;
    this.FillCanvas();
  }

  SetBackgrAoundColor(col: string) {
    this.backcolor = col;
    this.FillCanvas();
  }

  SetHeaderFont(fnt: string) {
    this.GridHeaderFont = fnt;
    this.FillCanvas();
  }

  SetDrawColor(col: string) {
    this.linecolor = col;
    this.FillCanvas();
  }

  SetSliderBackColor(col: string) {
    this.SliderBackColor = col;
    this.FillCanvas();
  }

  SetSliderForeColor(col: string) {
    this.SliderForeColor = col;
    this.FillCanvas();
  }

  SetSliderThickness(val: number) {
    this.SliderThickness = val;
    this.FillCanvas();
  }

  SetGridRowsJSON(TheRows: string) {
    this.GridRows = JSON.parse(TheRows);
    
    this.InitializeGridParameters();

    this.FillCanvas();

  }

  private InitializeGridParameters() {
    this.ScrollButtonDown = false;
    this.LastMouseX = 0;
    this.LastMouseY = 0;
    this.lastx = 0;
    this.lasty = 0;
    this.HorizontalOffset = 0;
    this.VerticleOffset = 0;
    this.RowHoveredOver = -1;
    this.CalculatedGridHeightTotal = 0;
    this.CalculatedGridWidthTotal = 0;
    this.HorizontalScrollBarVisible = false;
    this.VerticleScrollBarVisible = false;
    this.OverScrollBars = false;
  }

  FillCanvas() {
    this.resize();
    this.ClearCanvas();
    this.RedrawCanvas();
  }

  private fillTextMultiLine(ctx, text, x, y) {
    var lineHeight = ctx.measureText("M").width * 1.2;
    var lines = text.split(/\r\n|\r|\n/);
    for (var i = lines.length-1; i >= 0; --i) {
      ctx.fillText(lines[i], x, y);
      y -= lineHeight + 2;
    }
  }

  private CalculateColumnWidths() {
    this.CellWidths = [];
    this.CellHeights = [];
    this.CalculatedGridHeightTotal = 0;
    this.CalculatedGridWidthTotal = 0;

    var ctx = this.TheCanvas.getContext("2d");
    ctx.font = this.GridHeaderFont;

    for (var _i = 0; _i < this.GridHeader.length; _i++) {
      // Start by figuring out how wide each column would be with just header

      var it = this.GridHeader[_i];

      var wid = ctx.measureText(it).width;

      this.CellWidths.push(wid+6);
      //this.CalculatedGridWidthTotal += wid+6;
    }

    ctx.font = this.CellFont;

    var hei = 0;

    for ( var _currow = 0;_currow <this.GridRows.length;_currow++)
    {
      // iterrate over each row
      var Cellheight = 0;
      var numlines = 1;

      for (var _curcol = 0;_curcol<this.GridRows[_currow].length;_curcol++)
      {
        it = this.GridRows[_currow][_curcol];
        wid = 0; //ctx.measureText(it).width + 6;
        hei = ctx.measureText("M").width *1.2;
        

        // figure out how many lines of output are in this text element
        var thelines = it.split(/\r\n|\r|\n/);
        var celllines = thelines.length

        for (var cl =0;cl<thelines.length;cl++)
        {
          var thewid = ctx.measureText(thelines[cl]).width + 6;
          if (thewid > wid)
            wid = thewid;
        }

        if (celllines > numlines){
          numlines = celllines;
        }

        if (hei > Cellheight)
        {
          Cellheight = hei;
        }


        if(this.CellWidths[_curcol])
        {
          if (this.CellWidths[_curcol] < wid)
          {
            this.CellWidths[_curcol] = wid;
          }

        }
        else
        {
          if (this.CellWidths.length < _curcol)
          {
            this.CellWidths.push(wid);
          }

        }
      }
      this.CellHeights.push((Cellheight+6) * numlines);
      this.CalculatedGridHeightTotal += ((Cellheight+6) * numlines);
    }

    for(var ii=0;ii<this.CellWidths.length;ii++)
    {
      this.CalculatedGridWidthTotal += this.CellWidths[ii];
    }

    this.MaximumHorizontalOffset = (this.CalculatedGridWidthTotal - <number>this.TheCanvas.width)
    this.MaximumVerticleOffset = (this.CalculatedGridHeightTotal - <number>this.TheCanvas.height)

    if (this.VerticleScrollBarVisible)
    {
      this.MaximumHorizontalOffset += this.SliderThickness;
    }

    if(this.MaximumHorizontalOffset < 0)
    {
      this.MaximumHorizontalOffset = 0;
    }

    if (this.HorizontalScrollBarVisible)
    {
      this.MaximumVerticleOffset += this.SliderThickness;
    }

    if (this.GridHeaderVisible)
    {
      this.MaximumVerticleOffset += this.GridHeaderHeight;
    }

    if (this.TitleVisible)
    {
      this.MaximumVerticleOffset+= this.TitleHeight;
    }

    if (this.MaximumVerticleOffset < 0)
    {
      this.MaximumVerticleOffset = 0;
    }

  }

  private CaclulateTitleHeightAndHeaderHeight() {
    var ctx = this.TheCanvas.getContext("2d");
    if (this.TitleVisible)
    {
      ctx.font = this.TitleFont;
      this.TitleHeight = ctx.measureText("M").width * 1.3;
    }
    else
    {
      this.TitleHeight = 0;
    }

    if (this.GridHeaderVisible) {
      ctx.font = this.GridHeaderFont;
      this.GridHeaderHeight = ctx.measureText("M").width * 1.3;
    }
    else
    {
      this.GridHeaderHeight = 0;
    }

  }

  RedrawCanvas() {
    var ctx = this.TheCanvas.getContext("2d");

    var cy = 0;

    this.CalculateColumnWidths();
    this.CaclulateTitleHeightAndHeaderHeight();

    cy = this.TitleHeight + this.GridHeaderHeight;

    var hei = 0;
    var lx = 0;
    var ly = 0;

    ctx.font = this.CellFont;
    ctx.fillStyle = this.CellBackColor;
    ctx.strokeStyle = this.CellOutlineColor;
    hei = ctx.measureText("M").width * 1.2;

    for( var _currow = 0;_currow <this.GridRows.length;_currow++)
    {
      // iterrate over each row

      lx = 0; ly = cy;

      for (var _curcol = 0;_curcol<this.GridRows[_currow].length;_curcol++)
      {
        // iterate over each column in the current row

        hei = this.CellHeights[_currow];

        if (this.AlternateRowColoring)
        {
          if (_currow % 2 == 0)
          {
            // Its Even
            if (_currow == this.RowHoveredOver)
            {
              ctx.fillStyle = this.CellHighlightBackColor;
            }
            else
            {
              ctx.fillStyle = this.CellBackColor;
            }
          }
          else
          {
            // its Odd
            if (_currow == this.RowHoveredOver)
            {
              ctx.fillStyle = this.CellHighlightBackColor;
            }
            else
            {
              ctx.fillStyle = this.AlternateCellBackColor;
            }
          }
        }
        else
        {
          if (_currow == this.RowHoveredOver)
          {
            ctx.fillStyle = this.CellHighlightBackColor;
          }
          else
          {
            ctx.fillStyle = this.CellBackColor;
          }
        }
        ctx.fillRect(lx-this.HorizontalOffset, ly-this.VerticleOffset, this.CellWidths[_curcol], hei);
        ctx.strokeStyle = this.CellOutlineColor;
        ctx.strokeRect(lx-this.HorizontalOffset, ly-this.VerticleOffset, this.CellWidths[_curcol], hei);
        
        ctx.fillStyle = this.CellForeColor;

        this.fillTextMultiLine(ctx,this.GridRows[_currow][_curcol],lx + 3 - this.HorizontalOffset, ly + hei-3 - this.VerticleOffset);

        //ctx.fillText(this.GridRows[_currow][_curcol], lx + 3, ly + hei-3);

        lx = lx + this.CellWidths[_curcol];
        
      }

      cy = cy + hei;
    }

    // Draw Title
    if (this.TitleVisible) {
      ctx.font = this.TitleFont;
      var wid = ctx.measureText(this.Title).width;
      
      // draw the title bar
      ctx.fillStyle = this.TitleBackColor;
      ctx.fillRect(0 , 0, this.TheCanvas.width, this.TitleHeight);

      //ctx.translate(0.5, 0.5);
      ctx.fillStyle = this.TitleForeColor;
      ctx.fillText(this.Title, 2, this.TitleHeight - 6);

    }

    // Draw Header
    if (this.GridHeaderVisible) {
      ctx.font = this.GridHeaderFont;
      
      ly = this.TitleHeight;
      lx = 0;

      for (var _i = 0; _i < this.GridHeader.length; _i++) {
        // we need the index of the item and the item itself
        // so I cant use just a for of

        var it = this.GridHeader[_i];

        // _i is the index
        // it is the item

        //wid = ctx.measureText(it).width;
        wid = this.CellWidths[_i];
        //this.CellWidths.push(wid+6);

        ctx.fillStyle = this.GridHeaderBackColor;
        ctx.fillRect(lx-this.HorizontalOffset, ly, wid, this.GridHeaderHeight);
        ctx.strokeStyle = this.GridHeaderOutlineColor;
        ctx.strokeRect(lx-this.HorizontalOffset, ly, wid, this.GridHeaderHeight);

        ctx.fillStyle = this.GridHeaderForeColor;
        ctx.fillText(it, lx + 3 - this.HorizontalOffset, ly + this.GridHeaderHeight-5);

        lx = lx + wid;
      }
    }

    // Outline?
    if (this.OutlineOn) {
      ctx.strokeStyle = this.OutlineColor;
      ctx.strokeRect(0,0,this.TheCanvas.width,this.TheCanvas.height);
    }

    // Here we want to see of the VIEW is smaller than the 
    // content and if so we need to show some scrollbars

    //console.log("Canvas Width: " + this.TheCanvas.width);
    //console.log("Calculed Grid Width: " + this.CalculatedGridWidthTotal);
    //console.log("HorizontalOffset: " + this.HorizontalOffset);


    if (<number>this.TheCanvas.width < this.CalculatedGridWidthTotal)
    {
      // we are narrower
      //console.log("Narrower");
      // OK so lets Draw a slider along the bottom

      ctx.fillStyle = this.SliderBackColor;
      ctx.fillRect(0,this.TheCanvas.height-this.SliderThickness,this.TheCanvas.width,this.SliderThickness);

      ctx.strokeStyle = this.SliderForeColor;
      ctx.fillStyle = this.SliderForeColor;
      ctx.strokeRect(0,this.TheCanvas.height-this.SliderThickness,this.TheCanvas.width,this.SliderThickness);

      // calculate the position and dimension of the scroll bar button itself

      var hwidth = (<number>this.TheCanvas.width * (<number>this.TheCanvas.width / this.CalculatedGridWidthTotal));

      ctx.fillRect(0 + this.HorizontalOffset,this.TheCanvas.height-this.SliderThickness + 2 ,hwidth,this.SliderThickness-4);

      this.HorizontalScrollBarVisible = true;
      
    }
    else
    {
      this.HorizontalScrollBarVisible = false;
      this.HorizontalOffset = 0;
    }

    if (<number>this.TheCanvas.height < this.CalculatedGridHeightTotal)
    {
      // we are shorter
      //console.log("Shorter");

      ctx.fillStyle = this.SliderBackColor;
      ctx.fillRect(this.TheCanvas.width - this.SliderThickness,0,this.SliderThickness,this.TheCanvas.height);

      ctx.strokeStyle = this.SliderForeColor;
      ctx.fillStyle = this.SliderForeColor;
      ctx.strokeRect(this.TheCanvas.width - this.SliderThickness,0,this.SliderThickness,this.TheCanvas.height);

      // calculate the position and dimension of the scroll bar button itself

      //var hwidth = (<number>this.TheCanvas.width * (<number>this.TheCanvas.width / this.CalculatedGridWidthTotal));
      var wheight = (<number>this.TheCanvas.height * (<number>this.TheCanvas.height / this.CalculatedGridHeightTotal));

      ctx.fillRect(this.TheCanvas.width - this.SliderThickness + 2,0+ this.VerticleOffset, this.TheCanvas.width-4,wheight);

      this.VerticleScrollBarVisible = true;
      
    }
    else
    {
      this.VerticleScrollBarVisible = false;
      this.VerticleOffset = 0;
    }


  }

  private ClearCanvas() {
    var ctx = this.TheCanvas.getContext("2d");
    ctx.fillStyle = this.backcolor;
    ctx.fillRect(0, 0, this.TheCanvas.width, this.TheCanvas.height);
    this.Drawing = false;
    this.lastx = -1;
    this.lasty = -1;
  }

  // URL Populate Methods

  PopulateFromJSONUrl(DukeOfURL: string) {

    var Self = this;

    $.get(DukeOfURL,function(data,status){
      Self.GridHeader = data.Header;
      Self.GridRows = data.Data;

      Self.InitializeGridParameters();
      Self.FillCanvas();
      
    },'json')
  }
  

  SetGridHeader(Headers: string[]) {
    this.GridHeader = Headers;
    this.CalculateColumnWidths();
    this.FillCanvas();
  }

  // Event Handlers

  HandleContextMenu(ev: Event) {
    // right mousebutton context menu

    console.log("Context Menu");
    console.log(ev);

    this.FillCanvas();
  }

  HandleDoubleClick(ev: Event) {
    console.log("Double Click");
    console.log(ev);

    this.FillCanvas();
  }


  HandleTouchStart = (ev: TouchEvent) => {
    //this.Drawing = true;
    //this.lastx = ev.touches[0].clientX;
    //this.lasty = ev.touches[0].clientY;

    if (!this.ScrollButtonDown)
    {
      // we should validate where we are mousedowned

      this.LastMouseX = ev.touches[0].clientX;
      this.LastMouseY = ev.touches[0].clientY;
      this.ScrollButtonDown = true;

      this.HandleATouch_or_Mouse(ev.touches[0].clientX, ev.touches[0].clientY);

    }

    this.FillCanvas();

    ev.preventDefault(); // Eat the touch if its on the canvas
  };

  HandleTouchEnd = (ev: TouchEvent) => {
    //this.Drawing = false;
    //this.lastx = -1;
    //this.lasty = -1;

    this.LastMouseX = 0;
    this.LastMouseY = 0;
    this.ScrollButtonDown = false;

    this.FillCanvas();

    ev.preventDefault(); // Eat the touch if its on the canvas
  };

  HandleTouchMove = (ev: TouchEvent) => {
    //if (this.Drawing) {
    //  var ctx = this.TheCanvas.getContext("2d");

    //  ctx.strokeStyle = this.linecolor;

    //  ctx.moveTo(this.lastx, this.lasty);
    //  ctx.lineTo(ev.touches[0].clientX, ev.touches[0].clientY);
    //  ctx.stroke();

    //  this.lastx = ev.touches[0].clientX;
    //  this.lasty = ev.touches[0].clientY;
    //}

    if (this.ScrollButtonDown)
    {
      // we are scrolling
      if (this.LastMouseX < ev.touches[0].clientX)
      {
        // moving left to right
        this.HorizontalOffset += ev.touches[0].clientX - this.LastMouseX;
        
        //if (this.HorizontalOffset>0)
        //{
          //this.HorizontalOffset = 0;
        //}
        this.LastMouseX = ev.touches[0].clientX

        //this.FillCanvas();

        if (this.HorizontalOffset > this.MaximumHorizontalOffset)
        {
          this.HorizontalOffset = this.MaximumHorizontalOffset;
        }
        
      }
      else
      {
        if (this.LastMouseX > ev.touches[0].clientX)
        {
          // scrolling right to left
          this.HorizontalOffset -= this.LastMouseX - ev.touches[0].clientX;

          if (this.HorizontalOffset<0)
          {
            this.HorizontalOffset = 0;
          }

          if (this.HorizontalOffset > this.MaximumHorizontalOffset)
          {
            this.HorizontalOffset = this.MaximumHorizontalOffset;
          }

          this.LastMouseX = ev.touches[0].clientX

          //this.FillCanvas();
        }
      }

      if (this.LastMouseY < ev.touches[0].clientY)
      {
        // moving left to right
        this.VerticleOffset += ev.touches[0].clientY - this.LastMouseY;
        
        //if (this.HorizontalOffset>0)
        //{
          //this.HorizontalOffset = 0;
        //}

        if (this.VerticleOffset > this.MaximumVerticleOffset)
        {
          this.VerticleOffset = this.MaximumVerticleOffset;
        }

        this.LastMouseY = ev.touches[0].clientY

        //this.FillCanvas();
        
      }
      else
      {
        if (this.LastMouseY > ev.touches[0].clientY)
        {
          // scrolling right to left
          this.VerticleOffset -= this.LastMouseY - ev.touches[0].clientY;

          if (this.VerticleOffset<0)
          {
            this.VerticleOffset = 0;
          }

          if (this.VerticleOffset > this.MaximumVerticleOffset)
          {
            this.VerticleOffset = this.MaximumVerticleOffset;
          }

          this.LastMouseY = ev.touches[0].clientY

          //this.FillCanvas();
        }
      }

      this.FillCanvas();

      //this.HorizontalOffset += this.LastMouseX +

    }

    ev.preventDefault(); // Eat the touch if its on the canvas
  };

  HandleMouseMove = (ev: MouseEvent) => {
    //if (this.Drawing) {
    //var ctx = this.TheCanvas.getContext("2d");
    //ctx.strokeStyle = this.linecolor;
    //ctx.moveTo(this.lastx, this.lasty);
    //ctx.lineTo(ev.offsetX, ev.offsetY);
    //ctx.stroke();
    //this.lastx = ev.offsetX;
    //this.lasty = ev.offsetY;
    //}

    //console.log(ev.offsetX);

    if (this.ScrollButtonDown && this.OverScrollBars)
    {
      // we are scrolling
      if (this.LastMouseX < ev.offsetX)
      {
        // moving left to right
        this.HorizontalOffset += ev.offsetX - this.LastMouseX;
        
        //if (this.HorizontalOffset>0)
        //{
          //this.HorizontalOffset = 0;
        //}
        this.LastMouseX = ev.offsetX

        if (this.HorizontalOffset > this.MaximumHorizontalOffset)
        {
          this.HorizontalOffset = this.MaximumHorizontalOffset;
        }

        //this.FillCanvas();
        
      }
      else
      {
        if (this.LastMouseX > ev.offsetX)
        {
          // scrolling right to left
          this.HorizontalOffset -= this.LastMouseX - ev.offsetX;

          if (this.HorizontalOffset<0)
          {
            this.HorizontalOffset = 0;
          }

          if (this.HorizontalOffset > this.MaximumHorizontalOffset)
          {
            this.HorizontalOffset = this.MaximumHorizontalOffset;
          }

          this.LastMouseX = ev.offsetX

          //this.FillCanvas();
        }
      }

      if (this.LastMouseY < ev.offsetY)
      {
        // moving left to right
        this.VerticleOffset += ev.offsetY - this.LastMouseY;
        
        //if (this.HorizontalOffset>0)
        //{
          //this.HorizontalOffset = 0;
        //}

        if (this.VerticleOffset > this.MaximumVerticleOffset)
        {
          this.VerticleOffset = this.MaximumVerticleOffset;
        }

        this.LastMouseY = ev.offsetY

        //this.FillCanvas();
        
      }
      else
      {
        if (this.LastMouseY > ev.offsetY)
        {
          // scrolling right to left
          this.VerticleOffset -= this.LastMouseY - ev.offsetY;

          if (this.VerticleOffset<0)
          {
            this.VerticleOffset = 0;
          }

          if (this.VerticleOffset > this.MaximumVerticleOffset)
          {
            this.VerticleOffset = this.MaximumVerticleOffset;
          }

          this.LastMouseY = ev.offsetY

          //this.FillCanvas();
        }
      }

      this.FillCanvas();

      //this.HorizontalOffset += this.LastMouseX +

    }
    else
    {
      // we are not scrolling the grid so lets see if we are highlighting the current row
      if (true) //(this.HoverHighlight)
      {
        // We are highlighting the grids row being hovered over

        var realx = ev.offsetX + this.HorizontalOffset;
        var realy = ev.offsetY + this.VerticleOffset - this.TitleHeight - this.GridHeaderHeight;
        var calcx = 0;
        var calcy = 0;
        var therow =-1;
        var thecol =-1;

        for(var _row=0;_row < this.CellHeights.length;_row++)
        {
          calcy += this.CellHeights[_row];
          if (calcy >= realy)
          {
            // we have our row
            therow = _row;
            break;
          }
        }

        // special check to see if we are off the grid but on header opr title

        if (this.TitleVisible && ev.offsetY <= this.TitleHeight)
        {
          therow =-1;
        }
        else
        {
          if (!this.TitleVisible && this.GridHeaderVisible && ev.offsetY <= this.GridHeaderHeight)
          {
            therow = -1;
          }
          else
          {
            if(this.TitleVisible && this.GridHeaderVisible && ev.offsetY <= this.TitleHeight + this.GridHeaderHeight)
            {
              therow =-1;
            }
          }
        }

        //if (this.TitleVisible && ev.offsetY <= this.TitleHeight)
        //{
        //  this.RowHoveredOver = -1;
        //
        //  this.FillCanvas();
        //}
        

        for(var _col=0;_col < this.CellWidths.length;_col++)
        {
          calcx += this.CellWidths[_col];
          if(calcx >=realx)
          {
            // we have our col
            thecol = _col;
            break;
          }
        }

        if (therow !=-1 && thecol != -1)
        {
          // lets get the value 

          this.CELLCLICKEDINFO = new CELLCLICKEDMETADATA(this.GridRows[therow][thecol],therow,thecol);

          this.TheCanvas.dispatchEvent(this.CellHoveredEvent);

          if (this.HoverHighlight)
          {
            this.RowHoveredOver = therow;
          }
          else
          {
            this.RowHoveredOver = -1;
          }

        this.FillCanvas();
        
      }
      else
      {
        this.RowHoveredOver = -1;
        
        this.FillCanvas();
      }


      }
    }
  };

  HandleATouch_or_Mouse(offsetx: number, offsety: number) {
      var realx = this.LastMouseX + this.HorizontalOffset;
      var realy = this.LastMouseY + this.VerticleOffset - this.TitleHeight - this.GridHeaderHeight;
      var calcx = 0;
      var calcy = 0;
      var therow =-1;
      var thecol =-1;

      for(var _row=0;_row < this.CellHeights.length;_row++)
      {
        calcy += this.CellHeights[_row];
        if (calcy >= realy)
        {
          // we have our row
          therow = _row;
          break;
        }
      }

      for(var _col=0;_col < this.CellWidths.length;_col++)
      {
        calcx += this.CellWidths[_col];
        if(calcx >=realx)
        {
          // we have our col
          thecol = _col;
          break;
        }
      }

      // Are we over one of the Scroll Bars

      // 

      this.OverScrollBars = false;

      if (this.HorizontalScrollBarVisible && (offsety > this.TheCanvas.height-this.SliderThickness))
      {
        therow = -1;
        this.OverScrollBars = true;

      }

      if (this.VerticleScrollBarVisible && (offsetx > this.TheCanvas.width - this.SliderThickness))
      {
        thecol = -1;
        this.OverScrollBars = true;
      }

      if (therow !=-1 && thecol != -1)
      {
        // lets get the value 

        this.CELLCLICKEDINFO = new CELLCLICKEDMETADATA(this.GridRows[therow][thecol],therow,thecol);

        this.TheCanvas.dispatchEvent(this.CellClickedEvent);
        
      }
  }

  HandleMouseDown = (ev: MouseEvent) => {
    //this.Drawing = true;
    //this.lastx = ev.offsetX;
    //this.lasty = ev.offsetY;

    if (!this.ScrollButtonDown)
    {
      // we should validate where we are mousedowned

      this.LastMouseX = ev.offsetX;
      this.LastMouseY = ev.offsetY;
      this.ScrollButtonDown = true;

      this.HandleATouch_or_Mouse(ev.offsetX, ev.offsetY);

    }

    this.FillCanvas();
  };

  HandleMouseUp = (ev: MouseEvent) => {
    // when the user lets go of the mouse button reset the scrollable 
    // stuff to initialized

    this.LastMouseX = 0;
    this.LastMouseY = 0;
    this.ScrollButtonDown = false;
    this.OverScrollBars = false;

    this.FillCanvas();

  };

  HandleMouseOut = (ev: MouseEvent) => {
    // when the mouse leaves the canvas reset the scrollable stuff to initialized 
    // state...

    this.LastMouseX = 0;
    this.LastMouseY = 0;
    this.ScrollButtonDown = false;
    this.OverScrollBars = false;

    if (this.HoverHighlight)
    {
      this.RowHoveredOver = -1;
      this.FillCanvas();
    }
  }

  mouseWheelEvent = (e: MouseWheelEvent) => {
    var delta = e.wheelDelta ? e.wheelDelta : -e.detail;

    if (delta > 0)
        delta = 7;
    else
        delta = -7;

    if (this.HorizontalScrollBarVisible && (e.offsetY > (this.TheCanvas.height - (this.SliderThickness * 2)))) 
    {
      this.HorizontalOffset += delta;
      if (this.HorizontalOffset < 0){
        this.HorizontalOffset = 0;
      }

      if (this.HorizontalOffset > this.MaximumHorizontalOffset){
        this.HorizontalOffset = this.MaximumHorizontalOffset;
      }

    }

    if (this.VerticleScrollBarVisible && (e.offsetX > (this.TheCanvas.width - (this.SliderThickness * 2)))) 
    {
      this.VerticleOffset += delta;
      if (this.VerticleOffset < 0){
        this.VerticleOffset = 0;
      }

      if (this.VerticleOffset > this.MaximumVerticleOffset){
        this.VerticleOffset = this.MaximumVerticleOffset;
      }

    }

    this.FillCanvas();

    e.preventDefault();


    return false; // eat the mousewheel

}

  GetImage() {
    return '<img src="' + this.TheCanvas.toDataURL("image/png") + '"/>';
  }
}

class CELLCLICKEDMETADATA {
  CELLCLICKED: string;
  ROWCLICKED: number;
  COLCLICKED: number;
  
  constructor(CC: string, RowC: number, ColC: number) {
      this.CELLCLICKED = CC;
      this.ROWCLICKED = RowC;
      this.COLCLICKED = ColC;
  }
}
