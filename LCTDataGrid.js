/// <reference path="node_modules/@types/jquery/index.d.ts" />
var LCTDataGrid = /** @class */ (function () {
    // #endregion
    function LCTDataGrid(element) {
        var _this = this;
        this.Drawing = false;
        this.HorizontalScrollBarVisible = false;
        this.VerticleScrollBarVisible = false;
        this.SliderBackColor = "#FFFFFF";
        this.SliderForeColor = "#3f3f3f";
        this.SliderThickness = 10;
        this.CalculatedGridHeightTotal = 0;
        this.CalculatedGridWidthTotal = 0;
        this.lastx = -1;
        this.lasty = -1;
        this.linecolor = "#000000";
        this.backcolor = "#C0C0C0";
        // Outline Stuff
        this.OutlineOn = true;
        this.OutlineColor = "#808080";
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
        this.GridHeaderHeight = 0;
        this.CellBackColor = "#FFFFFF";
        this.CellHighlightBackColor = "#AAAAAA";
        this.RowSelectedBackColor = "#BBBBBB";
        this.AlternateCellBackColor = "#30F030";
        this.AlternateRowColoring = false;
        this.CellForeColor = "#000000";
        this.CellOutlineColor = "#808080";
        this.CellFont = "14pt Courier";
        this.CellWidths = [];
        this.CellHeights = [];
        this.HoverHighlight = true;
        this.RowHoveredOver = -1;
        this.CELLCLICKEDINFO = null;
        this.SelectedRow = -1;
        this.HorizontalOffset = 0;
        this.VerticleOffset = 0;
        this.MaximumHorizontalOffset = 0;
        this.MaximumVerticleOffset = 0;
        this.ScrollButtonDown = false;
        this.LastMouseX = 0;
        this.LastMouseY = 0;
        this.CalculatedHorizontalScale = 0;
        this.CalculatedVerticleScale = 0;
        // turn on or off console logging
        this.DoConsoleLogging = true; // on by default
        this.colwidths = [];
        // Event declarations for the grid
        this.CellClickedEvent = document.createEvent("Event");
        this.CellHoveredEvent = document.createEvent("Event");
        this.CellDoubleClickedEvent = document.createEvent("Event");
        this.GridMousedOverEvent = document.createEvent("Event");
        this.GridMouseOutEvent = document.createEvent("Event");
        this.resizeCanvas = function (ev) {
            _this.resize;
            _this.FillCanvas();
        };
        this.HandleDoubleClick = function (ev) {
            if (_this.CELLCLICKEDINFO.ROWCLICKED != -1) {
                if (_this.SelectedRow != _this.CELLCLICKEDINFO.ROWCLICKED)
                    _this.SelectedRow = _this.CELLCLICKEDINFO.ROWCLICKED;
                _this.TheCanvas.dispatchEvent(_this.CellDoubleClickedEvent);
                ev.preventDefault();
            }
            else {
                _this.SelectedRow = -1;
            }
            //ev.preventDefault();
        };
        this.HandleTouchStart = function (ev) {
            //this.Drawing = true;
            //this.lastx = ev.touches[0].clientX;
            //this.lasty = ev.touches[0].clientY;
            if (!_this.ScrollButtonDown) {
                // we should validate where we are mousedowned
                _this.LastMouseX = ev.touches[0].clientX;
                _this.LastMouseY = ev.touches[0].clientY;
                _this.ScrollButtonDown = true;
            }
            _this.TheCanvas.dispatchEvent(_this.GridMousedOverEvent);
            ev.preventDefault(); // Eat the touch if its on the canvas
        };
        this.HandleTouchEnd = function (ev) {
            //this.Drawing = false;
            //this.lastx = -1;
            //this.lasty = -1;
            _this.LastMouseX = 0;
            _this.LastMouseY = 0;
            _this.ScrollButtonDown = false;
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
            if (_this.ScrollButtonDown) {
                // we are scrolling
                if (_this.LastMouseX < ev.touches[0].clientX) {
                    // moving left to right
                    _this.HorizontalOffset += ev.touches[0].clientX - _this.LastMouseX;
                    //if (this.HorizontalOffset>0)
                    //{
                    //this.HorizontalOffset = 0;
                    //}
                    _this.LastMouseX = ev.touches[0].clientX;
                    //this.FillCanvas();
                    if (_this.HorizontalOffset > _this.MaximumHorizontalOffset) {
                        _this.HorizontalOffset = _this.MaximumHorizontalOffset;
                    }
                }
                else {
                    if (_this.LastMouseX > ev.touches[0].clientX) {
                        // scrolling right to left
                        _this.HorizontalOffset -= _this.LastMouseX - ev.touches[0].clientX;
                        if (_this.HorizontalOffset < 0) {
                            _this.HorizontalOffset = 0;
                        }
                        if (_this.HorizontalOffset > _this.MaximumHorizontalOffset) {
                            _this.HorizontalOffset = _this.MaximumHorizontalOffset;
                        }
                        _this.LastMouseX = ev.touches[0].clientX;
                        //this.FillCanvas();
                    }
                }
                if (_this.LastMouseY < ev.touches[0].clientY) {
                    // moving left to right
                    _this.VerticleOffset += ev.touches[0].clientY - _this.LastMouseY;
                    //if (this.HorizontalOffset>0)
                    //{
                    //this.HorizontalOffset = 0;
                    //}
                    if (_this.VerticleOffset > _this.MaximumVerticleOffset) {
                        _this.VerticleOffset = _this.MaximumVerticleOffset;
                    }
                    _this.LastMouseY = ev.touches[0].clientY;
                    //this.FillCanvas();
                }
                else {
                    if (_this.LastMouseY > ev.touches[0].clientY) {
                        // scrolling right to left
                        _this.VerticleOffset -= _this.LastMouseY - ev.touches[0].clientY;
                        if (_this.VerticleOffset < 0) {
                            _this.VerticleOffset = 0;
                        }
                        if (_this.VerticleOffset > _this.MaximumVerticleOffset) {
                            _this.VerticleOffset = _this.MaximumVerticleOffset;
                        }
                        _this.LastMouseY = ev.touches[0].clientY;
                        //this.FillCanvas();
                    }
                }
                _this.FillCanvas();
                //this.HorizontalOffset += this.LastMouseX +
            }
            ev.preventDefault(); // Eat the touch if its on the canvas
        };
        this.HandleMouseWheel = function (ev) {
            ev.preventDefault();
            _this.DOCONSOLE(ev.deltaY);
            _this.DOCONSOLE(ev.deltaX);
            _this.DOCONSOLE(ev.deltaZ);
            if (_this.VerticleScrollBarVisible && !ev.ctrlKey) {
                _this.VerticleOffset += ev.deltaY / 2;
                if (_this.VerticleOffset < 0) {
                    _this.VerticleOffset = 0;
                }
                if (_this.VerticleOffset > _this.MaximumVerticleOffset) {
                    _this.VerticleOffset = _this.MaximumVerticleOffset;
                }
                _this.FillCanvas();
            }
            else {
                if (_this.HorizontalScrollBarVisible) {
                    _this.HorizontalOffset += ev.deltaY;
                    if (_this.HorizontalOffset < 0) {
                        _this.HorizontalOffset = 0;
                    }
                    if (_this.HorizontalOffset > _this.MaximumHorizontalOffset) {
                        _this.HorizontalOffset = _this.MaximumHorizontalOffset;
                    }
                }
                _this.FillCanvas();
            }
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
                    var delta = ev.offsetX - _this.LastMouseX;
                    //var scale = this.CalculatedGridWidthTotal / delta;
                    _this.DOCONSOLE("LastMouseX       :" + _this.LastMouseX);
                    _this.DOCONSOLE("Horizontal Offset:" + _this.HorizontalOffset);
                    _this.DOCONSOLE("Grid Width Total :" + _this.CalculatedGridWidthTotal);
                    _this.DOCONSOLE("Maximum Offset   :" + _this.MaximumHorizontalOffset);
                    _this.DOCONSOLE("Delta            :" + delta);
                    _this.DOCONSOLE("HorizontalScale  :" + _this.CalculatedHorizontalScale);
                    _this.DOCONSOLE("VerticleScale    :" + _this.CalculatedVerticleScale);
                    _this.HorizontalOffset += delta * _this.CalculatedHorizontalScale;
                    //this.HorizontalOffset += ev.offsetX - this.LastMouseX; //delta * scale; //ev.offsetX - this.LastMouseX;
                    //if (this.HorizontalOffset>0)
                    //{
                    //this.HorizontalOffset = 0;
                    //}
                    _this.LastMouseX = ev.offsetX;
                    if (_this.HorizontalOffset > _this.MaximumHorizontalOffset) {
                        _this.HorizontalOffset = _this.MaximumHorizontalOffset;
                    }
                    //this.FillCanvas();
                }
                else {
                    if (_this.LastMouseX > ev.offsetX) {
                        // scrolling right to left
                        var delta = _this.LastMouseX - ev.offsetX;
                        _this.DOCONSOLE("LastMouseX       :" + _this.LastMouseX);
                        _this.DOCONSOLE("Horizontal Offset:" + _this.HorizontalOffset);
                        _this.DOCONSOLE("Grid Width Total :" + _this.CalculatedGridWidthTotal);
                        _this.DOCONSOLE("Maximum Offset   :" + _this.MaximumHorizontalOffset);
                        _this.DOCONSOLE("Delta            :" + delta);
                        _this.DOCONSOLE("HorizontalScale  :" + _this.CalculatedHorizontalScale);
                        _this.DOCONSOLE("VerticleScale    :" + _this.CalculatedVerticleScale);
                        _this.HorizontalOffset -= delta * _this.CalculatedHorizontalScale;
                        //this.HorizontalOffset -= this.LastMouseX - ev.offsetX;
                        if (_this.HorizontalOffset < 0) {
                            _this.HorizontalOffset = 0;
                        }
                        if (_this.HorizontalOffset > _this.MaximumHorizontalOffset) {
                            _this.HorizontalOffset = _this.MaximumHorizontalOffset;
                        }
                        _this.LastMouseX = ev.offsetX;
                        //this.FillCanvas();
                    }
                }
                if (_this.LastMouseY < ev.offsetY) {
                    // moving Down
                    var delta = ev.offsetY - _this.LastMouseY;
                    _this.DOCONSOLE("LastMouseY       :" + _this.LastMouseY);
                    _this.DOCONSOLE("Verticle Offset  :" + _this.VerticleOffset);
                    _this.DOCONSOLE("Grid Width Total :" + _this.CalculatedGridWidthTotal);
                    _this.DOCONSOLE("Maximum Offset   :" + _this.MaximumVerticleOffset);
                    _this.DOCONSOLE("Delta            :" + delta);
                    _this.DOCONSOLE("HorizontalScale  :" + _this.CalculatedHorizontalScale);
                    _this.DOCONSOLE("VerticleScale    :" + _this.CalculatedVerticleScale);
                    _this.VerticleOffset += delta * _this.CalculatedVerticleScale; //ev.offsetY - this.LastMouseY;
                    //if (this.HorizontalOffset>0)
                    //{
                    //this.HorizontalOffset = 0;
                    //}
                    if (_this.VerticleOffset > _this.MaximumVerticleOffset) {
                        _this.VerticleOffset = _this.MaximumVerticleOffset;
                    }
                    _this.LastMouseY = ev.offsetY;
                    //this.FillCanvas();
                }
                else {
                    if (_this.LastMouseY > ev.offsetY) {
                        // scrolling UP
                        var delta = _this.LastMouseY - ev.offsetY;
                        _this.DOCONSOLE("LastMouseY       :" + _this.LastMouseY);
                        _this.DOCONSOLE("Verticle Offset  :" + _this.VerticleOffset);
                        _this.DOCONSOLE("Grid Width Total :" + _this.CalculatedGridWidthTotal);
                        _this.DOCONSOLE("Maximum Offset   :" + _this.MaximumVerticleOffset);
                        _this.DOCONSOLE("Delta            :" + delta);
                        _this.DOCONSOLE("HorizontalScale  :" + _this.CalculatedHorizontalScale);
                        _this.DOCONSOLE("VerticleScale    :" + _this.CalculatedVerticleScale);
                        _this.VerticleOffset -= delta * _this.CalculatedVerticleScale; //ev.offsetY - this.LastMouseY;
                        //this.VerticleOffset -= this.LastMouseY - ev.offsetY;
                        if (_this.VerticleOffset < 0) {
                            _this.VerticleOffset = 0;
                        }
                        if (_this.VerticleOffset > _this.MaximumVerticleOffset) {
                            _this.VerticleOffset = _this.MaximumVerticleOffset;
                        }
                        _this.LastMouseY = ev.offsetY;
                        //this.FillCanvas();
                    }
                }
                _this.FillCanvas();
                //this.HorizontalOffset += this.LastMouseX +
            }
            else {
                // we are not scrolling the grid so lets see if we are highlighting the current row
                if (true) //(this.HoverHighlight)
                 {
                    // We are highlighting the grids row being hovered over
                    var realx = ev.offsetX + _this.HorizontalOffset;
                    var realy = ev.offsetY + _this.VerticleOffset - _this.TitleHeight - _this.GridHeaderHeight;
                    var calcx = 0;
                    var calcy = 0;
                    var therow = -1;
                    var thecol = -1;
                    for (var _row = 0; _row < _this.CellHeights.length; _row++) {
                        calcy += _this.CellHeights[_row];
                        if (calcy >= realy) {
                            // we have our row
                            therow = _row;
                            break;
                        }
                    }
                    // special check to see if we are off the grid but on header opr title
                    if (_this.TitleVisible && ev.offsetY <= _this.TitleHeight) {
                        therow = -1;
                    }
                    else {
                        if (!_this.TitleVisible && _this.GridHeaderVisible && ev.offsetY <= _this.GridHeaderHeight) {
                            therow = -1;
                        }
                        else {
                            if (_this.TitleVisible && _this.GridHeaderVisible && ev.offsetY <= _this.TitleHeight + _this.GridHeaderHeight) {
                                therow = -1;
                            }
                        }
                    }
                    //if (this.TitleVisible && ev.offsetY <= this.TitleHeight)
                    //{
                    //  this.RowHoveredOver = -1;
                    //
                    //  this.FillCanvas();
                    //}
                    for (var _col = 0; _col < _this.CellWidths.length; _col++) {
                        calcx += _this.CellWidths[_col];
                        if (calcx >= realx) {
                            // we have our col
                            thecol = _col;
                            break;
                        }
                    }
                    if (therow != -1 && thecol != -1) {
                        // lets get the value 
                        _this.CELLCLICKEDINFO = new CELLCLICKEDMETADATA(_this.GridRows[therow][thecol], therow, thecol, _this.GridHeader[thecol]);
                        _this.TheCanvas.dispatchEvent(_this.CellHoveredEvent);
                        if (_this.HoverHighlight) {
                            _this.RowHoveredOver = therow;
                        }
                        else {
                            _this.RowHoveredOver = -1;
                        }
                        _this.FillCanvas();
                    }
                    else {
                        _this.RowHoveredOver = -1;
                        _this.FillCanvas();
                    }
                }
            }
            ev.preventDefault();
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
                var realx = _this.LastMouseX + _this.HorizontalOffset;
                var realy = _this.LastMouseY + _this.VerticleOffset - _this.TitleHeight - _this.GridHeaderHeight;
                var calcx = 0;
                var calcy = 0;
                var therow = -1;
                var thecol = -1;
                for (var _row = 0; _row < _this.CellHeights.length; _row++) {
                    calcy += _this.CellHeights[_row];
                    if (calcy >= realy) {
                        // we have our row
                        therow = _row;
                        break;
                    }
                }
                for (var _col = 0; _col < _this.CellWidths.length; _col++) {
                    calcx += _this.CellWidths[_col];
                    if (calcx >= realx) {
                        // we have our col
                        thecol = _col;
                        break;
                    }
                }
                // Are we over one of the Scroll Bars
                // 
                if (_this.HorizontalScrollBarVisible && (ev.offsetY > _this.TheCanvas.height - _this.SliderThickness)) {
                    therow = -1;
                }
                if (_this.VerticleScrollBarVisible && (ev.offsetX > _this.TheCanvas.width - _this.SliderThickness)) {
                    thecol = -1;
                }
                if (therow != -1 && thecol != -1) {
                    // lets get the value 
                    if (therow === _this.SelectedRow) {
                        _this.SelectedRow = -1;
                    }
                    else {
                        _this.SelectedRow = therow;
                        _this.CELLCLICKEDINFO = new CELLCLICKEDMETADATA(_this.GridRows[therow][thecol], therow, thecol, _this.GridHeader[thecol]);
                        _this.TheCanvas.dispatchEvent(_this.CellClickedEvent);
                    }
                }
                else {
                    _this.SelectedRow = -1;
                    _this.CELLCLICKEDINFO = new CELLCLICKEDMETADATA('', -1, -1, '');
                }
            }
            ev.preventDefault();
        };
        this.HandleMouseUp = function (ev) {
            // when the user lets go of the mouse button reset the scrollable 
            // stuff to initialized
            _this.LastMouseX = 0;
            _this.LastMouseY = 0;
            _this.ScrollButtonDown = false;
            ev.preventDefault();
        };
        this.HandleMouseOut = function (ev) {
            // when the mouse leaves the canvas reset the scrollable stuff to initialized 
            // state...
            //this.LastMouseX = 0;
            //this.LastMouseY = 0;
            //this.ScrollButtonDown = false;
            if (_this.HoverHighlight) {
                _this.RowHoveredOver = -1;
                _this.FillCanvas();
            }
            _this.TheCanvas.dispatchEvent(_this.GridMouseOutEvent);
            ev.preventDefault();
        };
        this.HandleMouseIn = function (ev) {
            // when the mouse enters the canvas reset the scrollable stuff to initialized 
            // state if the leftmousebutton is up
            //console.log(ev.buttons + "MOUSEBUTTON");
            if (ev.buttons !== 1) {
                _this.LastMouseX = 0;
                _this.LastMouseY = 0;
                _this.ScrollButtonDown = false;
            }
            _this.TheCanvas.dispatchEvent(_this.GridMousedOverEvent);
            ev.preventDefault();
            //this.LastMouseX = 0;
            //this.LastMouseY = 0;
            //this.ScrollButtonDown = false;
            //if (this.HoverHighlight)
            //{
            //  this.RowHoveredOver = -1;
            //  this.FillCanvas();
            //}
            //ev.preventDefault();
        };
        this.TheCanvas = element;
        //this.TheDiv = container;
        // Register an event listener to
        // call the resizeCanvas() function each time
        // the window is resized.
        window.addEventListener("resize", this.resizeCanvas, false);
        this.TheCanvas.addEventListener("mousemove", this.HandleMouseMove);
        this.TheCanvas.addEventListener("mouseleave", this.HandleMouseOut);
        this.TheCanvas.addEventListener("mouseenter", this.HandleMouseIn);
        this.TheCanvas.addEventListener("mousedown", this.HandleMouseDown);
        this.TheCanvas.addEventListener("mouseup", this.HandleMouseUp);
        this.TheCanvas.addEventListener("touchstart", this.HandleTouchStart);
        this.TheCanvas.addEventListener("touchend", this.HandleTouchEnd);
        this.TheCanvas.addEventListener("touchmove", this.HandleTouchMove);
        this.TheCanvas.addEventListener("contextmenu", this.HandleContextMenu);
        this.TheCanvas.addEventListener("dblclick", this.HandleDoubleClick);
        this.TheCanvas.addEventListener("wheel", this.HandleMouseWheel);
        this.TheCanvas.addEventListener("keydown", this.HandleKeyDown);
        this.TheCanvas.addEventListener("keyup", this.HandleKeyUp);
        this.CellClickedEvent = new CustomEvent("CELLCLICKED", { bubbles: true, cancelable: true });
        this.CellHoveredEvent = new CustomEvent("CELLHOVERED", { bubbles: true, cancelable: true });
        this.CellDoubleClickedEvent = new CustomEvent("CELLDOUBLECLICKED", { bubbles: true, cancelable: true });
        this.GridMousedOverEvent = new CustomEvent("MOUSEDOVER", { bubbles: true, cancelable: true });
        this.GridMouseOutEvent = new CustomEvent("MOUSEOUT", { bubbles: true, cancelable: true });
        //this.CellClickedEvent.initEvent('CELLCLICKED', true, true);
        //this.CellHoveredEvent.initEvent('CELLHOVERED', true, true);
        //this.CellDoubleClickedEvent.initEvent('CELLDOUBLECLICKED',true,true);
        this.ApplyCustomCSSAttributes();
        this.InitializeGridParameters();
    }
    LCTDataGrid.prototype.SetGridRows = function (ARR) {
        this.GridRows = ARR;
        this.RowHoveredOver = -1;
        this.SelectedRow = -1;
        this.HorizontalOffset = 0;
        this.VerticleOffset = 0;
        this.HorizontalScrollBarVisible = false;
        this.VerticleScrollBarVisible = false;
        this.FillCanvas();
    };
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
        theval = TheCSS.getPropertyValue("--TitleHeight");
        if (theval !== undefined && theval !== "") {
            this.TitleHeight = JSON.parse(theval);
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
            if (theval.toLowerCase().trim() === "true")
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
            if (theval.toLowerCase().trim() === "true")
                this.AlternateRowColoring = true;
            else
                this.AlternateRowColoring = false;
        }
        theval = TheCSS.getPropertyValue("--TitleVisible");
        if (theval !== undefined && theval !== "") {
            if (theval.toLowerCase().trim() === "true")
                this.TitleVisible = true;
            else
                this.TitleVisible = false;
        }
        theval = TheCSS.getPropertyValue("--GridHeaderVisible");
        if (theval !== undefined && theval !== "") {
            if (theval.toLowerCase().trim() === "true")
                this.GridHeaderVisible = true;
            else
                this.GridHeaderVisible = false;
        }
        theval = TheCSS.getPropertyValue("--HoverHighlight");
        if (theval !== undefined && theval !== "") {
            if (theval.toLowerCase().trim() === "true")
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
            this.SliderThickness = Number(theval);
        }
        this.GridColAlignments = [];
        for (var i = 0; i < this.GridHeader.length; i++) {
            this.GridColAlignments.push("");
        }
        //CellHighlightBackColor
    };
    LCTDataGrid.prototype.resize = function () {
        // Lookup the size the browser is displaying the canvas.
        // Make it visually fill the positioned parent
        this.TheCanvas.style.width = "100%";
        this.TheCanvas.style.height = "100%";
        // ...then set the internal size to match
        this.TheCanvas.width = this.TheCanvas.offsetWidth;
        this.TheCanvas.height = this.TheCanvas.offsetHeight;
    };
    LCTDataGrid.prototype.SetGridOutline = function (flag) {
        this.OutlineOn = flag;
        this.FillCanvas();
    };
    LCTDataGrid.prototype.SetGridOutlineColor = function (col) {
        this.OutlineColor = col;
        this.FillCanvas();
    };
    LCTDataGrid.prototype.SetCellBackColor = function (col) {
        this.CellBackColor = col;
        this.FillCanvas();
    };
    LCTDataGrid.prototype.SetCellForeColor = function (col) {
        this.CellForeColor = col;
        this.FillCanvas();
    };
    LCTDataGrid.prototype.SetAlternateCellBackColor = function (col) {
        this.AlternateCellBackColor = col;
        this.FillCanvas();
    };
    LCTDataGrid.prototype.SetHoverHighlight = function (trigger) {
        this.HoverHighlight = trigger;
        this.FillCanvas();
    };
    LCTDataGrid.prototype.SetAlternateRowColoring = function (trigger) {
        this.AlternateRowColoring = trigger;
        this.FillCanvas();
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
    LCTDataGrid.prototype.SetTitle = function (title) {
        this.Title = title;
        this.FillCanvas();
    };
    LCTDataGrid.prototype.SetTitleVisible = function (flag) {
        this.TitleVisible = flag;
        this.FillCanvas();
    };
    LCTDataGrid.prototype.SetHeaderVisible = function (flag) {
        this.GridHeaderVisible = flag;
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
    LCTDataGrid.prototype.SetBackgroundColor = function (col) {
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
    LCTDataGrid.prototype.SetSliderBackColor = function (col) {
        this.SliderBackColor = col;
        this.FillCanvas();
    };
    LCTDataGrid.prototype.SetSliderForeColor = function (col) {
        this.SliderForeColor = col;
        this.FillCanvas();
    };
    LCTDataGrid.prototype.SetSliderThickness = function (val) {
        this.SliderThickness = val;
        this.FillCanvas();
    };
    LCTDataGrid.prototype.SetGridRowsJSON = function (TheRows) {
        //this.ClearGridContents();
        this.GridRows = JSON.parse(TheRows);
        // Set the number of columns to match the handed in cols on the ThreRows
        var a = this.GridRows[0].length;
        this.GridHeader.length = a;
        this.InitializeGridParameters();
        this.FillCanvas();
    };
    LCTDataGrid.prototype.SetGridColAlignments = function (TheColAlignments) {
        this.GridColAlignments = TheColAlignments;
        this.FillCanvas();
    };
    LCTDataGrid.prototype.SetSelectedRow = function (TheRowToHighlight) {
        if (TheRowToHighlight < this.GridRows.length) {
            this.SelectedRow = TheRowToHighlight;
            this.FillCanvas();
        }
    };
    LCTDataGrid.prototype.ClearGridContents = function () {
        this.GridHeader = [];
        this.GridRows = [];
        this.InitializeGridParameters();
    };
    LCTDataGrid.prototype.InitializeGridParameters = function () {
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
        this.MaximumHorizontalOffset = 0;
        this.MaximumVerticleOffset = 0;
    };
    LCTDataGrid.prototype.FillCanvas = function () {
        //this.InitializeGridParameters();
        this.resize();
        this.ClearCanvas();
        this.RedrawCanvas();
    };
    LCTDataGrid.prototype.fillTextMultiLine = function (ctx, text, x, y) {
        var lineHeight = ctx.measureText("M").width * 1.2;
        text += "";
        var lines = text.split(/\r\n|\r|\n/);
        for (var i = lines.length - 1; i >= 0; --i) {
            ctx.fillText(lines[i], x, y);
            y -= lineHeight + 2;
        }
    };
    LCTDataGrid.prototype.CalculateColumnWidths = function () {
        this.CellWidths = [];
        this.CellHeights = [];
        this.CalculatedGridHeightTotal = 0;
        this.CalculatedGridWidthTotal = 0;
        var ctx = this.TheCanvas.getContext("2d");
        ctx.font = this.GridHeaderFont;
        if (this.GridHeader == undefined)
            this.GridHeader = [];
        for (var _i = 0; _i < this.GridHeader.length; _i++) {
            // Start by figuring out how wide each column would be with just header
            var it = this.GridHeader[_i];
            var wid = ctx.measureText(it).width;
            this.CellWidths.push(wid + 6);
            //this.CalculatedGridWidthTotal += wid+6;
        }
        ctx.font = this.CellFont;
        var hei = 0;
        for (var _currow = 0; _currow < this.GridRows.length; _currow++) {
            // iterrate over each row
            var Cellheight = 0;
            var numlines = 1;
            for (var _curcol = 0; _curcol < this.GridRows[_currow].length; _curcol++) {
                it = this.GridRows[_currow][_curcol] + "";
                wid = 0; //ctx.measureText(it).width + 6;
                hei = ctx.measureText("M").width * 1.2;
                // figure out how many lines of output are in this text element
                var thelines = [""];
                if (it !== null) {
                    var thelines = it.split(/\r\n|\r|\n/);
                }
                var celllines = thelines.length;
                for (var cl = 0; cl < thelines.length; cl++) {
                    var thewid = ctx.measureText(thelines[cl]).width + 6;
                    if (thewid > wid)
                        wid = thewid;
                }
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
            this.CalculatedGridHeightTotal += ((Cellheight + 6) * numlines);
        }
        for (var ii = 0; ii < this.CellWidths.length; ii++) {
            this.CalculatedGridWidthTotal += this.CellWidths[ii];
        }
        this.MaximumHorizontalOffset = (this.CalculatedGridWidthTotal - this.TheCanvas.width);
        this.MaximumVerticleOffset = (this.CalculatedGridHeightTotal - this.TheCanvas.height);
        if (this.VerticleScrollBarVisible) {
            this.MaximumHorizontalOffset += this.SliderThickness;
        }
        if (this.MaximumHorizontalOffset < 0) {
            this.MaximumHorizontalOffset = 0;
        }
        if (this.HorizontalScrollBarVisible) {
            this.MaximumVerticleOffset += this.SliderThickness;
        }
        if (this.GridHeaderVisible) {
            this.MaximumVerticleOffset += this.GridHeaderHeight;
        }
        if (this.TitleVisible) {
            this.MaximumVerticleOffset += this.TitleHeight;
        }
        if (this.MaximumVerticleOffset < 0) {
            this.MaximumVerticleOffset = 0;
        }
        // now we want to set the Horizontal and verticle scale for scroll bar work
        this.CalculatedHorizontalScale = this.CalculatedGridWidthTotal / this.TheCanvas.width;
        this.CalculatedVerticleScale = this.CalculatedGridHeightTotal / this.TheCanvas.height;
    };
    LCTDataGrid.prototype.DOCONSOLE = function (LOGVAL) {
        if (this.DoConsoleLogging)
            console.log(LOGVAL);
    };
    LCTDataGrid.prototype.CalculateTitleHeightAndHeaderHeight = function () {
        var ctx = this.TheCanvas.getContext("2d");
        if (this.TitleVisible) {
            ctx.font = this.TitleFont;
            var tmpth = ctx.measureText("M").width * 1.3;
            if (tmpth > this.TitleHeight) {
                this.TitleHeight = tmpth;
            }
        }
        else {
            this.TitleHeight = 0;
        }
        if (this.GridHeaderVisible) {
            ctx.font = this.GridHeaderFont;
            this.GridHeaderHeight = ctx.measureText("M").width * 1.3;
        }
        else {
            this.GridHeaderHeight = 0;
        }
    };
    LCTDataGrid.prototype.RedrawCanvas = function () {
        var ctx = this.TheCanvas.getContext("2d");
        var cy = 0;
        this.CalculateColumnWidths();
        this.CalculateTitleHeightAndHeaderHeight();
        cy = this.TitleHeight + this.GridHeaderHeight;
        var hei = 0;
        var lx = 0;
        var ly = 0;
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
                if (this.AlternateRowColoring) {
                    if (_currow % 2 == 0) {
                        // Its Even
                        if (_currow == this.RowHoveredOver) {
                            ctx.fillStyle = this.CellHighlightBackColor;
                        }
                        else {
                            ctx.fillStyle = this.CellBackColor;
                        }
                    }
                    else {
                        // its Odd
                        if (_currow == this.RowHoveredOver) {
                            ctx.fillStyle = this.CellHighlightBackColor;
                        }
                        else {
                            if (_currow == this.SelectedRow) {
                                // here we want to highlight the row that has been selected
                                ctx.fillStyle = this.RowSelectedBackColor;
                            }
                            else {
                                ctx.fillStyle = this.AlternateCellBackColor;
                            }
                        }
                    }
                }
                else {
                    if (_currow == this.RowHoveredOver) {
                        ctx.fillStyle = this.CellHighlightBackColor;
                    }
                    else {
                        if (_currow == this.SelectedRow) {
                            // here we want to highlight the row that has been selected
                            ctx.fillStyle = this.RowSelectedBackColor;
                        }
                        else {
                            ctx.fillStyle = this.CellBackColor;
                        }
                    }
                }
                ctx.fillRect(lx - this.HorizontalOffset, ly - this.VerticleOffset, this.CellWidths[_curcol], hei);
                ctx.strokeStyle = this.CellOutlineColor;
                ctx.strokeRect(lx - this.HorizontalOffset, ly - this.VerticleOffset, this.CellWidths[_curcol], hei);
                ctx.fillStyle = this.CellForeColor;
                this.fillTextMultiLine(ctx, this.GridRows[_currow][_curcol], lx + 3 - this.HorizontalOffset, ly + hei - 3 - this.VerticleOffset);
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
            ctx.fillRect(0, 0, this.TheCanvas.width, this.TitleHeight);
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
                ctx.fillRect(lx - this.HorizontalOffset, ly, wid, this.GridHeaderHeight);
                ctx.strokeStyle = this.GridHeaderOutlineColor;
                ctx.strokeRect(lx - this.HorizontalOffset, ly, wid, this.GridHeaderHeight);
                ctx.fillStyle = this.GridHeaderForeColor;
                ctx.fillText(it, lx + 3 - this.HorizontalOffset, ly + this.GridHeaderHeight - 5);
                lx = lx + wid;
            }
        }
        // Outline?
        if (this.OutlineOn) {
            ctx.strokeStyle = this.OutlineColor;
            ctx.strokeRect(0, 0, this.TheCanvas.width, this.TheCanvas.height);
        }
        // Here we want to see of the VIEW is smaller than the 
        // content and if so we need to show some scrollbars
        if (this.DoConsoleLogging) {
            this.DOCONSOLE("Canvas Width: " + this.TheCanvas.width);
            this.DOCONSOLE("Calculed Grid Width: " + this.CalculatedGridWidthTotal);
            this.DOCONSOLE("HorizontalOffset: " + this.HorizontalOffset);
        }
        // Calculate if ScrollBars are visible...
        if (this.TheCanvas.width < this.CalculatedGridWidthTotal) {
            // we are narrower
            this.DOCONSOLE("Narrower");
            // OK so lets Draw a slider along the bottom
            ctx.fillStyle = this.SliderBackColor;
            ctx.fillRect(0, this.TheCanvas.height - this.SliderThickness, this.TheCanvas.width, this.SliderThickness);
            ctx.strokeStyle = this.SliderForeColor;
            ctx.fillStyle = this.SliderForeColor;
            ctx.strokeRect(0, this.TheCanvas.height - this.SliderThickness, this.TheCanvas.width, this.SliderThickness);
            // calculate the position and dimension of the scroll bar button itself
            var hwidth = (this.TheCanvas.width * (this.TheCanvas.width / this.CalculatedGridWidthTotal));
            ctx.fillRect((0 + this.HorizontalOffset) / this.CalculatedHorizontalScale, this.TheCanvas.height - this.SliderThickness + 2, hwidth, this.SliderThickness - 4);
            this.HorizontalScrollBarVisible = true;
        }
        else {
            this.HorizontalScrollBarVisible = false;
        }
        var cheight = this.CalculatedGridHeightTotal;
        if (this.TitleVisible) {
            cheight += this.TitleHeight;
        }
        if (this.GridHeaderVisible) {
            cheight += this.GridHeaderHeight;
        }
        if (this.TheCanvas.height < cheight) // this.CalculatedGridHeightTotal)
         {
            // we are shorter
            this.DOCONSOLE("Shorter");
            ctx.fillStyle = this.SliderBackColor;
            ctx.fillRect(this.TheCanvas.width - this.SliderThickness, 0, this.SliderThickness, this.TheCanvas.height);
            ctx.strokeStyle = this.SliderForeColor;
            ctx.fillStyle = this.SliderForeColor;
            ctx.strokeRect(this.TheCanvas.width - this.SliderThickness, 0, this.SliderThickness, this.TheCanvas.height);
            // calculate the position and dimension of the scroll bar button itself
            //var hwidth = (<number>this.TheCanvas.width * (<number>this.TheCanvas.width / this.CalculatedGridWidthTotal));
            var wheight = (this.TheCanvas.height * (this.TheCanvas.height / this.CalculatedGridHeightTotal));
            ctx.fillRect(this.TheCanvas.width - this.SliderThickness + 2, (0 + this.VerticleOffset) / this.CalculatedVerticleScale, this.TheCanvas.width - 4, wheight);
            this.VerticleScrollBarVisible = true;
        }
        else {
            this.VerticleScrollBarVisible = false;
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
    // URL Populate Methods
    LCTDataGrid.prototype.PopulateFromJSONUrl = function (DukeOfURL) {
        var Self = this;
        $.get(DukeOfURL, function (data, status) {
            //console.log(data);
            Self.SetDataFromJSONCall(data);
        }, 'json');
    };
    LCTDataGrid.prototype.SetDataFromJSONCall = function (data) {
        var tuple = 0;
        for (var key in data) {
            if (key == "Header") {
                this.GridHeader = data.Header;
                tuple += 1;
            }
            if (key == "Data") {
                this.GridRows = data.Data;
                tuple += 1;
            }
        }
        if (tuple != 2) {
            // ok we may have a plain old array
            // lets see if we can decode that
            // we will start with the header
            this.GridHeader = [];
            this.GridRows = [];
            var it = data[0];
            for (var keys in it) {
                this.GridHeader.push(keys);
            }
            this.GridRows = [];
            var grs = new Array();
            for (var i = 0; i < data.length; i++) {
                var therow = [];
                var r = data[i];
                for (var keys in r) {
                    //this.GridRows[index].push
                    therow.push(r[keys]);
                }
                grs.push(therow);
            }
            this.GridRows = grs;
        }
        this.InitializeGridParameters();
        this.FillCanvas();
        //var it = data[0];
        //Object.keys(it).length
    };
    LCTDataGrid.prototype.SetGridHeader = function (Headers) {
        this.GridHeader = Headers;
        this.GridColAlignments = [];
        for (var i = 0; i < this.GridHeader.length; i++) {
            this.GridColAlignments.push("");
        }
        this.CalculateColumnWidths();
        this.FillCanvas();
    };
    // Event Handlers
    LCTDataGrid.prototype.HandleKeyDown = function (ev) {
        this.DOCONSOLE(ev.keyCode);
    };
    LCTDataGrid.prototype.HandleKeyUp = function (ev) {
        this.DOCONSOLE(ev.keyCode);
    };
    LCTDataGrid.prototype.HandleContextMenu = function (ev) {
        // right mousebutton context menu
        this.DOCONSOLE("Context Menu");
        this.DOCONSOLE(ev);
    };
    LCTDataGrid.prototype.GetImage = function () {
        return '<img src="' + this.TheCanvas.toDataURL("image/png") + '"/>';
    };
    return LCTDataGrid;
}());
var CELLCLICKEDMETADATA = /** @class */ (function () {
    function CELLCLICKEDMETADATA(CC, RowC, ColC, GH) {
        this.CELLCLICKED = CC;
        this.ROWCLICKED = RowC;
        this.COLCLICKED = ColC;
        this.COLNAME = GH;
    }
    return CELLCLICKEDMETADATA;
}());
//# sourceMappingURL=LCTDataGrid.js.map