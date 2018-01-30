/// <reference path="node_modules/@types/jquery/index.d.ts" />

class LCTDataGrid {
  TheCanvas: HTMLCanvasElement;

  Drawing: boolean = false;
  HorizontalScrollBarVisible: boolean = false;
  VerticleScrollBarVisible: boolean = false;

  lastx: number = -1;
  lasty: number = -1;

  linecolor: string = "#000000";
  backcolor: string = "#C0C0C0";

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
  CellForeColor: string = "#000000";
  CellOutlineColor: string = "#808080";
  CellFont: string = "14pt Courier";
  CellWidths: number[] = [];
  CellHeights: number[] = [];

  HorizontalOffset: number = 0;
  VerticleOffset: number = 0;
  ScrollButtonDown: boolean = false;
  LastMouseX: number = 0;
  LastMouseY: number = 0;

  private colwidths: number[] = [];

  constructor(element: HTMLCanvasElement) {
    this.TheCanvas = element;
    //this.TheDiv = container;

    // Register an event listener to
    // call the resizeCanvas() function each time
    // the window is resized.
    window.addEventListener("resize", this.resizeCanvas, false);

    this.TheCanvas.addEventListener("mousemove", this.HandleMouseMove);

    this.TheCanvas.addEventListener("mouseout", this.HandleMouseOut);

    this.TheCanvas.addEventListener("mousedown", this.HandleMouseDown);

    this.TheCanvas.addEventListener("mouseup", this.HandleMouseUp);

    this.TheCanvas.addEventListener("touchstart", this.HandleTouchStart);

    this.TheCanvas.addEventListener("touchend", this.HandleTouchEnd);

    this.TheCanvas.addEventListener("touchmove", this.HandleTouchMove);

    this.ApplyCustomCSSAttributes();
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

  }

  resize() {
    // Lookup the size the browser is displaying the canvas.
    // Make it visually fill the positioned parent

    this.TheCanvas.style.width = "100%";
    // canvas.style.height = '100%';
    // ...then set the internal size to match
    this.TheCanvas.width = this.TheCanvas.offsetWidth;
    this.TheCanvas.height = this.TheCanvas.offsetHeight;
  }

  resizeCanvas = (ev: UIEvent) => {
    this.resize;
    this.FillCanvas();
  };

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

  FillCanvas() {
    this.resize();
    this.ClearCanvas();
    this.RedrawCanvas();
  }

  private fillTextMultiLine(ctx, text, x, y) {
    var lineHeight = ctx.measureText("M").width * 1.2;
    var lines = text.split("/\r\n|\r|\n/");
    for (var i = 0; i < lines.length; ++i) {
      ctx.fillText(lines[i], x, y);
      y += lineHeight;
    }
  }

  CalculateColumnWidths()
  {
    this.CellWidths = [];
    this.CellHeights = [];

    var ctx = this.TheCanvas.getContext("2d");
    ctx.font = this.GridHeaderFont;

    for (var _i = 0; _i < this.GridHeader.length; _i++) {
      // Start by figuring out how wide each column would be with just header

      var it = this.GridHeader[_i];

      var wid = ctx.measureText(it).width;

      this.CellWidths.push(wid+6);
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
        wid = ctx.measureText(it).width + 6;
        hei = ctx.measureText("M").width *1.2;
        

        // figure out how many lines of output are in this text element
        var celllines = it.split(/\r\n|\r|\n/).length

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
    }
  }

  CaclulateTitleHeightAndHeaderHeight()
  {
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

        ctx.fillStyle = this.CellBackColor;
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
  }

  private ClearCanvas() {
    var ctx = this.TheCanvas.getContext("2d");
    ctx.fillStyle = this.backcolor;
    ctx.fillRect(0, 0, this.TheCanvas.width, this.TheCanvas.height);
    this.Drawing = false;
    this.lastx = -1;
    this.lasty = -1;
  }

  SetGridHeader(Headers: string[]) {
    this.GridHeader = Headers;
    this.CalculateColumnWidths();
    this.FillCanvas();
  }

  // Event Handlers

  HandleTouchStart = (ev: TouchEvent) => {
    //this.Drawing = true;
    //this.lastx = ev.touches[0].clientX;
    //this.lasty = ev.touches[0].clientY;

    ev.preventDefault(); // Eat the touch if its on the canvas
  };

  HandleTouchEnd = (ev: TouchEvent) => {
    //this.Drawing = false;
    //this.lastx = -1;
    //this.lasty = -1;

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

    if (this.ScrollButtonDown)
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

          this.LastMouseY = ev.offsetY

          //this.FillCanvas();
        }
      }

      this.FillCanvas();

      //this.HorizontalOffset += this.LastMouseX +

    }
  };

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
    }

  };

  HandleMouseUp = (ev: MouseEvent) => {
    // when the user lets go of the mouse button reset the scrollable 
    // stuff to initialized

    this.LastMouseX = 0;
    this.LastMouseY = 0;
    this.ScrollButtonDown = false;

  };

  HandleMouseOut = (ev: MouseEvent) => {
    // when the mouse leaves the canvas reset the scrollable stuff to initialized 
    // state...

    this.LastMouseX = 0;
    this.LastMouseY = 0;
    this.ScrollButtonDown = false;
  }

  GetImage() {
    return '<img src="' + this.TheCanvas.toDataURL("image/png") + '"/>';
  }
}