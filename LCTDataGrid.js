/// <reference path="node_modules/@types/jquery/index.d.ts" />
var LCTDataGrid = /** @class */ (function () {
    function LCTDataGrid(element) {
        var _this = this;
        this.Drawing = false;
        this.HorizontalScrollBarVisible = false;
        this.VerticleScrollBarVisible = false;
        this.lastx = -1;
        this.lasty = -1;
        this.linecolor = "#000000";
        this.backcolor = "#C0C0C0";
        // Title Stuff
        this.Title = "Grid Title Here";
        this.TitleHeight = 15;
        this.TitleBackColor = "#3030C0";
        this.TitleForeColor = "#FFFFFF";
        this.TitleVisible = true;
        this.TitleFont = "18pt Courier";
        // actual contents stuff
        this.GridHeaderVisible = true;
        this.GridHeaderBackColor = "#FFFF00";
        this.GridHeaderForeColor = "#000000";
        this.GridHeaderOutlineColor = "#808080";
        this.GridHeaderFont = "14pt Courier";
        this.GridHeader = [];
        this.GridRows = [];
        this.GridCols = [];
        this.CellBackColor = "#FFFFFF";
        this.CellForeColor = "#000000";
        this.CellOutlineColor = "#808080";
        this.CellFont = "14pt Courier";
        this.CellWidths = [];
        this.CellHeights = [];
        this.HorizontalOffset = 0;
        this.VerticleOffset = 0;
        this.ScrollButtonDown = false;
        this.LastMouseX = 0;
        this.LastMouseY = 0;
        this.colwidths = [];
        this.resizeCanvas = function (ev) {
            _this.resize;
            _this.FillCanvas();
        };
        // Event Handlers
        this.HandleTouchStart = function (ev) {
            //this.Drawing = true;
            //this.lastx = ev.touches[0].clientX;
            //this.lasty = ev.touches[0].clientY;
            ev.preventDefault(); // Eat the touch if its on the canvas
        };
        this.HandleTouchEnd = function (ev) {
            //this.Drawing = false;
            //this.lastx = -1;
            //this.lasty = -1;
            ev.preventDefault(); // Eat the touch if its on the canvas
        };
        this.HandleTouchMove = function (ev) {
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
        this.HandleMouseMove = function (ev) {
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
            if (_this.ScrollButtonDown) {
                // we are scrolling
                if (_this.LastMouseX < ev.offsetX) {
                    // moving left to right
                    _this.HorizontalOffset += ev.offsetX - _this.LastMouseX;
                    //if (this.HorizontalOffset>0)
                    //{
                    //this.HorizontalOffset = 0;
                    //}
                    _this.LastMouseX = ev.offsetX;
                    _this.FillCanvas();
                }
                else {
                    if (_this.LastMouseX > ev.offsetX) {
                        // scrolling right to left
                        _this.HorizontalOffset -= _this.LastMouseX - ev.offsetX;
                        if (_this.HorizontalOffset < 0) {
                            _this.HorizontalOffset = 0;
                        }
                        _this.LastMouseX = ev.offsetX;
                        _this.FillCanvas();
                    }
                }
                //this.HorizontalOffset += this.LastMouseX +
            }
        };
        this.HandleMouseDown = function (ev) {
            //this.Drawing = true;
            //this.lastx = ev.offsetX;
            //this.lasty = ev.offsetY;
            if (!_this.ScrollButtonDown) {
                // we should validate where we are mousedowned
                _this.LastMouseX = ev.offsetX;
                _this.LastMouseY = ev.offsetY;
                _this.ScrollButtonDown = true;
            }
        };
        this.HandleMouseUp = function (ev) {
            //this.Drawing = false;
            //this.lastx = -1;
            //this.lasty = -1;
            _this.LastMouseX = 0;
            _this.LastMouseY = 0;
            _this.ScrollButtonDown = false;
        };
        this.HandleMouseOut = function (ev) {
            _this.LastMouseX = 0;
            _this.LastMouseY = 0;
            _this.ScrollButtonDown = false;
        };
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
    LCTDataGrid.prototype.ApplyCustomCSSAttributes = function () {
        // Extract From Any custom CSS here
        var TheCSS = window.getComputedStyle(document.getElementsByClassName(this.TheCanvas.className)[0]);
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
    };
    LCTDataGrid.prototype.resize = function () {
        // Lookup the size the browser is displaying the canvas.
        // Make it visually fill the positioned parent
        this.TheCanvas.style.width = "100%";
        // canvas.style.height = '100%';
        // ...then set the internal size to match
        this.TheCanvas.width = this.TheCanvas.offsetWidth;
        this.TheCanvas.height = this.TheCanvas.offsetHeight;
    };
    LCTDataGrid.prototype.SetTitleBackColor = function (col) {
        this.TitleBackColor = col;
        this.FillCanvas();
    };
    LCTDataGrid.prototype.SetTitleForeColor = function (col) {
        this.TitleForeColor = col;
        this.FillCanvas();
    };
    LCTDataGrid.prototype.SetTitleFont = function (fnt) {
        this.TitleFont = fnt;
        this.FillCanvas();
    };
    LCTDataGrid.prototype.SetHeaderBackgroundColor = function (col) {
        this.GridHeaderBackColor = col;
        this.FillCanvas();
    };
    LCTDataGrid.prototype.SetHeaderForeGroundColor = function (col) {
        this.GridHeaderForeColor = col;
        this.FillCanvas();
    };
    LCTDataGrid.prototype.SetHeaderOutlineColor = function (col) {
        this.GridHeaderOutlineColor = col;
        this.FillCanvas();
    };
    LCTDataGrid.prototype.SetBackgrAoundColor = function (col) {
        this.backcolor = col;
        this.FillCanvas();
    };
    LCTDataGrid.prototype.SetHeaderFont = function (fnt) {
        this.GridHeaderFont = fnt;
        this.FillCanvas();
    };
    LCTDataGrid.prototype.SetDrawColor = function (col) {
        this.linecolor = col;
        this.FillCanvas();
    };
    LCTDataGrid.prototype.FillCanvas = function () {
        this.resize();
        this.ClearCanvas();
        this.RedrawCanvas();
    };
    LCTDataGrid.prototype.fillTextMultiLine = function (ctx, text, x, y) {
        var lineHeight = ctx.measureText("M").width * 1.2;
        var lines = text.split("/\r\n|\r|\n/");
        for (var i = 0; i < lines.length; ++i) {
            ctx.fillText(lines[i], x, y);
            y += lineHeight;
        }
    };
    LCTDataGrid.prototype.CalculateColumnWidths = function () {
        this.CellWidths = [];
        this.CellHeights = [];
        var ctx = this.TheCanvas.getContext("2d");
        ctx.font = this.GridHeaderFont;
        for (var _i = 0; _i < this.GridHeader.length; _i++) {
            // Start by figuring out how wide each column would be with just header
            var it = this.GridHeader[_i];
            var wid = ctx.measureText(it).width;
            this.CellWidths.push(wid + 6);
        }
        ctx.font = this.CellFont;
        var hei = 0;
        for (var _currow = 0; _currow < this.GridRows.length; _currow++) {
            // iterrate over each row
            var Cellheight = 0;
            var numlines = 1;
            for (var _curcol = 0; _curcol < this.GridRows[_currow].length; _curcol++) {
                it = this.GridRows[_currow][_curcol];
                wid = ctx.measureText(it).width + 6;
                hei = ctx.measureText("M").width * 1.2;
                // figure out how many lines of output are in this text element
                var celllines = it.split(/\r\n|\r|\n/).length;
                if (celllines > numlines) {
                    numlines = celllines;
                }
                if (hei > Cellheight) {
                    Cellheight = hei;
                }
                if (this.CellWidths[_curcol]) {
                    if (this.CellWidths[_curcol] < wid) {
                        this.CellWidths[_curcol] = wid;
                    }
                }
                else {
                    if (this.CellWidths.length < _curcol) {
                        this.CellWidths.push(wid);
                    }
                }
            }
            this.CellHeights.push((Cellheight + 6) * numlines);
        }
    };
    LCTDataGrid.prototype.RedrawCanvas = function () {
        var ctx = this.TheCanvas.getContext("2d");
        var cy = 0;
        this.CalculateColumnWidths();
        // Draw Title
        if (this.TitleVisible) {
            ctx.font = this.TitleFont;
            var wid = ctx.measureText(this.Title).width;
            var hei = ctx.measureText("M").width * 1.3;
            this.TitleHeight = hei;
            // draw the title bar
            ctx.fillStyle = this.TitleBackColor;
            ctx.fillRect(0, 0, this.TheCanvas.width, this.TitleHeight);
            //ctx.translate(0.5, 0.5);
            ctx.fillStyle = this.TitleForeColor;
            ctx.fillText(this.Title, 2, this.TitleHeight - 6);
            cy = this.TitleHeight;
        }
        // Draw Header
        if (this.GridHeaderVisible) {
            ctx.font = this.GridHeaderFont;
            var lx = 0;
            var ly = this.TitleHeight;
            hei = ctx.measureText("M").width * 1.3;
            cy += hei; // Cells will start rendering this distance from the top
            //this.CellWidths = [];
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
                ctx.fillRect(lx - this.HorizontalOffset, ly, wid, hei);
                ctx.strokeStyle = this.GridHeaderOutlineColor;
                ctx.strokeRect(lx - this.HorizontalOffset, ly, wid, hei);
                ctx.fillStyle = this.GridHeaderForeColor;
                ctx.fillText(it, lx + 3 - this.HorizontalOffset, ly + hei - 5);
                lx = lx + wid;
            }
        }
        ctx.font = this.CellFont;
        ctx.fillStyle = this.CellBackColor;
        ctx.strokeStyle = this.CellOutlineColor;
        hei = ctx.measureText("M").width * 1.2;
        for (var _currow = 0; _currow < this.GridRows.length; _currow++) {
            // iterrate over each row
            lx = 0;
            ly = cy;
            for (var _curcol = 0; _curcol < this.GridRows[_currow].length; _curcol++) {
                // iterate over each column in the current row
                hei = this.CellHeights[_currow];
                ctx.fillStyle = this.CellBackColor;
                ctx.fillRect(lx - this.HorizontalOffset, ly, this.CellWidths[_curcol], hei);
                ctx.strokeStyle = this.CellOutlineColor;
                ctx.strokeRect(lx - this.HorizontalOffset, ly, this.CellWidths[_curcol], hei);
                ctx.fillStyle = this.CellForeColor;
                this.fillTextMultiLine(ctx, this.GridRows[_currow][_curcol], lx + 3 - this.HorizontalOffset, ly + hei - 3);
                //ctx.fillText(this.GridRows[_currow][_curcol], lx + 3, ly + hei-3);
                lx = lx + this.CellWidths[_curcol];
            }
            cy = cy + hei;
        }
    };
    LCTDataGrid.prototype.ClearCanvas = function () {
        var ctx = this.TheCanvas.getContext("2d");
        ctx.fillStyle = this.backcolor;
        ctx.fillRect(0, 0, this.TheCanvas.width, this.TheCanvas.height);
        this.Drawing = false;
        this.lastx = -1;
        this.lasty = -1;
    };
    LCTDataGrid.prototype.SetGridHeader = function (Headers) {
        this.GridHeader = Headers;
        this.CalculateColumnWidths();
        this.FillCanvas();
    };
    LCTDataGrid.prototype.GetImage = function () {
        return '<img src="' + this.TheCanvas.toDataURL("image/png") + '"/>';
    };
    return LCTDataGrid;
}());
//# sourceMappingURL=LCTDataGrid.js.map