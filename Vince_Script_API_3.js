//Developed by
//Christian Heggen
//TODO Script
//Bruk api til å alltid hente inn de forhåndutfyllte feltene....
//Nå er det sårbart da scriptet vil anta at innholdeti feltet er "det man kan se", men det kommer også ann på bredden på kolonnen
var Vince_Script_API_3 = /** @class */ (function () {
    //private lastClickedSpan: HTMLElement | null = null;
    function Vince_Script_API_3(args) {
        this.version = "1.0";
        this.scriptName = "Vince_Script_API_3";
        this.argsErrorMsg = "Script args should be: <API_NAME>,<API_TRANSACTION>,<FIELD1_NAME>,<FIELD2_NAME>, ...(as many fields as necessary.)";
        this.htmlStringSettings = "";
        this.apiProgInputID = "apiProgram";
        this.apiTransInputID = "apiTrans";
        this.apiProgLabel = "API program: ";
        this.apiTransLabel = "API transaction: ";
        this.apiSelectedProgram = "";
        this.apiSelectedTransaction = "";
        this._labelTexts = [];
        //CUGEX USAGE
        this.FILE_USAGE = "V_USAGE";
        //CUGEX Add records
        this.FILE = "V_SCRIPT";
        this.PK01 = "API_3";
        this.f0 = "";
        this.f1 = "";
        this.f2 = "";
        this.f3 = "";
        this.f4 = "";
        this.f5 = "";
        this.f6 = "";
        this.f7 = "";
        this.f8 = "";
        this.f9 = "";
        //all fields coming from api
        this._fieldNames = [];
        //private _fieldValues = [];
        this.fieldsInn = [];
        this.fieldMap = [];
        this.fieldTypes = [];
        this.fieldLengths = [];
        this.allAPIfieldNames = [];
        this.allAPIfieldTypes = [];
        this.allAPIfieldLengths = [];
        this.fieldInput = [];
        //selected fields from API
        this.selectedFields = [];
        this.selectedInput = [];
        this.selectedLabels = [];
        this.selectedTypes = [];
        this.selectedLengths = [];
        this._constructedFields = [];
        this.totalAPIfields = 0;
        this.inputArrays = [];
        this.multiple = "*MULTIPLE*";
        //#endregion
        this.d1_width = 600;
        this.d1_height = 400;
        this.controller = args.controller;
        this.log = args.log;
        this.args = args.args;
        this.mainWindow_width = 340;
        this.fieldsInn = [];
        this.fieldMap = []; //used to prefill values from alternative columns
        this.fieldNames = []; //used to display a differen name than the field ID
        this._labelTexts = [];
        //this.gridID = "chGrid_" + this.randomNumber();
        this.textboxIDs = [];
        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
            this.angular = true;
        }
        else {
            this.miService = MIService.Current;
            this.angular = false;
        }
        //Set script Key
        if (this.args != undefined) {
            this.scriptKey = this.args;
        }
        else {
            this.scriptKey = "1";
        }
        this.programName = this.controller.GetProgramName();
        this.panelName = this.controller.GetPanelName();
        this.pgmPanel = this.panelName;
        this.firstUse = true;
        this.tot_apis = 1;
        this.api_counter = 0;
        this.PK01 = this.scriptName;
        //////////////777
        //document.addEventListener("click", (e: MouseEvent) => {
        //    const target = e.target as HTMLElement;
        //    if (target && target.tagName === "SPAN") {
        //        this.lastClickedSpan = target;
        //    }
        //});
        //////////////////
        //load script for custom modals
        var _this = this;
        ScriptUtil.LoadScript("scripts/Vince_Modal.js", function (data) { _this.script_loaded(); });
    }
    Vince_Script_API_3.prototype.run = function () {
        var controller = this.controller;
        //if (this.lastClickedSpan) {
        //    const text = this.lastClickedSpan.textContent?.trim() || "[empty]";
        //    alert(`Most recently clicked <span> content: "${text}"`);
        //} else {
        //    alert("No <span> element has been clicked yet.");
        //}
        /////////////////////////
        this.log.Info("Running " + this.scriptName + " version " + this.version);
    };
    Vince_Script_API_3.prototype.script_loaded = function () {
        this.log.Info("Script loaded");
        this.Update_Usage_information();
        //this.setScriptKey();
        this.vince_modal = new Vince_Modal("Modal_For_API_Script", this.panelName, this.scriptKey);
        this.run_main_window_process();
    };
    Vince_Script_API_3.prototype.run_main_window_process = function () {
        //Reset variables
        this.fieldsInn = [];
        this.fieldMap = []; //used to prefill values from alternative columns
        this.fieldNames = []; //used to display a differen name than the field ID
        var scriptKey = this.scriptKey + ":1";
        this.selectedFields = [];
        this.selectedInput = [];
        this.selectedLabels = [];
        this.run_CUSEXTMI_GetFieldValue(scriptKey, 1);
    };
    Vince_Script_API_3.prototype.run_continue = function () {
        this.log.Info("run_continue");
        this.initiate_window(); //defines new textbox IDs > stores them in this.textboxIDs
        this.open_main_window();
        //setTimeout(() => {
        //   alert('Ill print third after a second');
        //}, 1000);
        this.prefill_values();
    };
    Vince_Script_API_3.prototype.initiate_window = function () {
        this.log.Info("initiate_window");
        this.htmlString = "";
        //debugger;
        for (var i = 0; i < this.fieldsInn.length; i++) {
            //var labelText = this.fieldsInn[i];
            var labelText;
            if (this.selectedLabels[i]) {
                labelText = this.selectedLabels[i];
            }
            else {
                labelText = this.fieldsInn[i];
            }
            //if (this.fieldNames[i] != "") {
            //    labelText = this.fieldNames[i];
            //}
            //if (this._labelTexts[i] != "") {
            //    labelText = this._labelTexts[i];
            //}
            var textBoxID = "ROW_" + i + "_" + this.randomNumber();
            //debugger;
            this.textboxIDs[i] = textBoxID;
            this.htmlString += "<div style=\"display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px;\"><label style=\"width:30%; text-align:left; float:left;\" for=\"".concat(this.textboxIDs[i], "\">").concat(labelText, "</label><input name=\"Student\" id=\"").concat(this.textboxIDs[i], "\" style=\"width:65%; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3\"/></div>");
        }
        //this.htmlString += `<div style="text-align:center; margin-top:15px; font-size:12px;"><a href="https://vincesoftware.com/services" target="_blank" style="text-decoration:none; color:#333;">Powered by Vince</a></div>`;
    };
    Vince_Script_API_3.prototype.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    Vince_Script_API_3.prototype.prefill_values = function () {
        this.log.Info("prefill_values");
        for (var i = 0; i < this.fieldsInn.length; i++) {
            var tmp;
            var finalValue = "";
            var inValue = this.fieldMap[i];
            var fieldName;
            //debugger;
            if (inValue.charAt(0) == "<") {
                //we have a field
                fieldName = inValue.substring(1, inValue.length - 1);
                if (fieldName.length == 4) {
                    //from a list
                    var tempVal = ListControl.ListView.GetValueByColumnName(fieldName);
                    //this.log.Info(tempVal.toString());
                    if (tempVal != undefined) {
                        if (tempVal.length > 1) {
                            finalValue = this.multiple;
                            this.inputArrays[i] = tempVal;
                        }
                        else {
                            finalValue = tempVal[0];
                        }
                    }
                }
                else {
                    //fieldname should be 6 long
                    var tempVal = ScriptUtil.GetFieldValue(fieldName, this.controller);
                    //this.log.Info(tempVal);
                    if (tempVal != undefined) {
                        finalValue = tempVal;
                    }
                }
            }
            else {
                finalValue = inValue;
            }
            this.log.Info("Final value: " + finalValue);
            /*debugger*/ ;
            if (finalValue != "") {
                //debugger;
                this.log.Info("Trying to put valueinto field: " + this.textboxIDs[i]);
                $("#".concat(this.textboxIDs[i])).val(finalValue);
            }
        }
    };
    Vince_Script_API_3.prototype.open_main_window = function () {
        var _this = this;
        this.log.Info("open main window");
        this.log.Info(this.api_name + " / " + this.api_tran);
        var run_clicked = function () {
            _this.log.Info("Trying to run API!");
            if (_this.inputArrays.length > 0) {
                _this.rund_API_multiple();
            }
            else {
                _this.Run_API();
            }
        };
        var settings_clicked = function () {
            //settings button clicked
            if (_this.firstUse) {
                _this.open_set_API_window();
            }
            else {
                _this.prepare_open_settings_window();
            }
        };
        this.log.Info("calling open_window!");
        var button1array = ["Run", run_clicked];
        var button2array = ["Settings", settings_clicked];
        //let button3array = ["Cancel", () => { }];
        var buttons = [];
        buttons[0] = button1array;
        buttons[1] = button2array;
        //buttons[3] = button3array;
        this.log.Info("Vince modal show will be called shortly!");
        this.vince_modal.show(this.api_name + " / " + this.api_tran, 400, 400, this.htmlString, buttons);
        // Append footer after modal is rendered
        // Inject footer link after modal is rendered
        //setTimeout(() => {
        //    $('.vince-modal').append(`
        //    <div style="text-align:center; padding:10px 0; font-size:12px;">
        //    <a href="https://vincesoftware.com/services" target="_blank" style="text-decoration:none; color:#666;">Powered by Vince</a>
        //    </div>
        //    `);
        //}, 100);
        //this.open_window(this.api_name + " / " + this.api_tran, 600, 400, this.htmlString, "Run", "Settings", "Cancel", run_clicked, settings_clicked, () => { });
    };
    Vince_Script_API_3.prototype.prepare_open_settings_window = function () {
        this.htmlStringSettings = "";
        this.run_MRS001MI_LstFields();
    };
    Vince_Script_API_3.prototype.open_settings_window = function () {
        //this window will show all posible input fields for the api, and show you the sleections you have made
        var _this_1 = this;
        this.log.Info("open_settings_window");
        var _this = this;
        var save_clicked = function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
            _this.log.Info("Store new information in CUGEX");
            _this._constructedFields = [];
            //keep the html updated in case the user selects to many field and need to change that before it gets saved to cugex
            //_this.htmlStringSettings = `<div style="display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px;"><label style="width:100%;">${this.api_name}/${this.api_tran}</label></div>`;
            _this.htmlStringSettings = "";
            debugger;
            var counter = 1;
            for (var i = 0; i < _this.totalAPIfields; i++) {
                var fieldID = "" + i + "_FIELDNAME";
                var checkboxID = "" + i + "_CHECKBOX";
                var labelFieldID = "" + i + "_LABELFIELD";
                if ($('#' + checkboxID).is(":checked")) {
                    var fieldName = _this._fieldNames[i];
                    var fieldLength = _this.fieldLengths[i];
                    var fieldType = _this.fieldTypes[i];
                    var inValue;
                    debugger;
                    //TODO denne failer helt når labelTexts er tom
                    //if (_this._labelTexts[i] != undefined && _this._labelTexts[i].length > 0) {
                    //    inValue = $('#' + fieldID).val() + ":" + _this._labelTexts[i];
                    //} else {
                    //    inValue = $('#' + fieldID).val();
                    //}
                    var inValue = $('#' + fieldID).val();
                    var labelText = $('#' + labelFieldID).val();
                    var valueString = fieldName + ":" + inValue + ":" + fieldLength + ":" + fieldType + ":" + labelText;
                    _this._constructedFields[counter] = valueString;
                    counter++;
                    _this.htmlStringSettings += "<div style=\"display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px; margin-bottom:5px;\"><input style=\"-webkit-appearance:auto; width:auto;\" type=\"checkbox\" id=\"".concat(checkboxID, "\" checked><label style=\"width:20%;\">").concat(fieldName, "</label><input id=\"").concat(fieldID, "\" style=\"width: 30%; margin:2px; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3\" value=\"").concat(inValue, "\"/><input id=\"").concat(labelFieldID, "\" style=\"width: 30%; margin:2px; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3\" value=\"").concat(labelText, "\"/></div>");
                }
                else {
                    //for the imidiate rollback
                    //_this.htmlStringSettings += `<div style="display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px; margin-bottom:5px;"><input style="-webkit-appearance:auto; width:auto;" type="checkbox" id=\"${checkboxID}\"><label style="width:40%;">${fieldName}</label><input id=\"${fieldID}\" style="width: 40%; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3"/></div>`;
                    _this.htmlStringSettings += "<div style=\"display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px; margin-bottom:5px;\"><input style=\"-webkit-appearance:auto; width:auto;\" type=\"checkbox\" id=\"".concat(checkboxID, "\"><label style=\"width:20%;\">").concat(fieldName, "</label><input id=\"").concat(fieldID, "\" style=\"width: 30%; margin:2px; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3\"/><input id=\"").concat(labelFieldID, "\" style=\"width: 30%; margin:2px; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3\"/></div>");
                }
            }
            ///BBB
            _this_1.f1 = (_a = _this_1._constructedFields[1]) !== null && _a !== void 0 ? _a : "-";
            _this_1.f2 = (_b = _this_1._constructedFields[2]) !== null && _b !== void 0 ? _b : "-";
            _this_1.f3 = (_c = _this_1._constructedFields[3]) !== null && _c !== void 0 ? _c : "-";
            _this_1.f4 = (_d = _this_1._constructedFields[4]) !== null && _d !== void 0 ? _d : "-";
            _this_1.f5 = (_e = _this_1._constructedFields[5]) !== null && _e !== void 0 ? _e : "-";
            _this_1.f6 = (_f = _this_1._constructedFields[6]) !== null && _f !== void 0 ? _f : "-";
            _this_1.f7 = (_g = _this_1._constructedFields[7]) !== null && _g !== void 0 ? _g : "-";
            _this_1.f8 = (_h = _this_1._constructedFields[8]) !== null && _h !== void 0 ? _h : "-";
            _this_1.f9 = (_j = _this_1._constructedFields[9]) !== null && _j !== void 0 ? _j : "-";
            _this_1.cugexCounter = 0;
            if (counter <= 10) {
                _this.cugexAddCounter = 1;
                var transaction = "";
                if (_this.firstUse) {
                    transaction = "AddFieldValue";
                }
                else {
                    transaction = "ChgFieldValue";
                }
                _this.run_CUSEXTMI(transaction, "1", "1", _this_1.f1, _this_1.f2, _this_1.f3, _this_1.f4, _this_1.f5, _this_1.f6, _this_1.f7, _this_1.f8, _this_1.f9);
                //Check if we need to delete old record
                if (_this_1.numberOfRecords == 2) {
                    //delete old record
                    _this.run_CUSEXTMI("DelFieldValue", "", "2", "", "", "", "", "", "", "", "", "");
                }
            }
            else if (counter <= 19) {
                _this.cugexAddCounter = 2;
                //utfordring... Det kan være "ikke first use" men likevell være nødvendigå kjøreen add på en (eller flere ) nyelinjer
                //hvis det ved utlesning var færre linjer enn det er nå (number of records),
                //må vikjøre add på linje 2
                var f10 = (_k = _this_1._constructedFields[10]) !== null && _k !== void 0 ? _k : "-";
                var f11 = (_l = _this_1._constructedFields[11]) !== null && _l !== void 0 ? _l : "-";
                var f12 = (_m = _this_1._constructedFields[12]) !== null && _m !== void 0 ? _m : "-";
                var f13 = (_o = _this_1._constructedFields[13]) !== null && _o !== void 0 ? _o : "-";
                var f14 = (_p = _this_1._constructedFields[14]) !== null && _p !== void 0 ? _p : "-";
                var f15 = (_q = _this_1._constructedFields[15]) !== null && _q !== void 0 ? _q : "-";
                var f16 = (_r = _this_1._constructedFields[16]) !== null && _r !== void 0 ? _r : "-";
                var f17 = (_s = _this_1._constructedFields[17]) !== null && _s !== void 0 ? _s : "-";
                var f18 = (_t = _this_1._constructedFields[18]) !== null && _t !== void 0 ? _t : "-";
                //let f19 = this._constructedFields[19] ?? "-";
                var transaction1 = "";
                var transaction2 = "";
                if (_this.firstUse) {
                    transaction1 = "AddFieldValue";
                    transaction2 = "AddFieldValue";
                }
                else {
                    transaction1 = "ChgFieldValue";
                    if (_this_1.numberOfRecords == 2) {
                        transaction2 = "ChgFieldValue";
                    }
                    else {
                        transaction2 = "AddFieldValue";
                    }
                }
                _this.run_CUSEXTMI(transaction1, "2", "1", _this_1.f1, _this_1.f2, _this_1.f3, _this_1.f4, _this_1.f5, _this_1.f6, _this_1.f7, _this_1.f8, _this_1.f9);
                _this.run_CUSEXTMI(transaction2, "2", "2", f10, f11, f12, f13, f14, f15, f16, f17, f18);
            }
            else {
                _this.open_window_message("OBS!", "The 1.0 version of this script does not support more than 18 api fields!", "OK", _this.open_settings_window);
            }
        };
        var settings_clicked = function () {
            _this.log.Info("Change API Clicked!");
            //_this.open_set_API_window();
            _this.prepare_open_setAPI_window();
        };
        var buttons = [];
        var button1array = [];
        button1array[0] = "Save";
        button1array[1] = save_clicked;
        var button2array = [];
        button2array[0] = "Change API";
        button2array[1] = settings_clicked;
        buttons[0] = button1array;
        buttons[1] = button2array;
        //debugger;
        this.vince_modal.show("Settings: ".concat(this.api_name, "/").concat(this.api_tran, " "), this.d1_width, this.d1_height, this.htmlStringSettings, buttons);
        //this.open_window("Settings", 400, 200, this.htmlStringSettings, "Save", "Change API", "", save_clicked, settings_clicked, () => { });
        this.addCheckboxEvents();
    };
    Vince_Script_API_3.prototype.addCheckboxEvents = function () {
        //Add checkbox events
        var _this = this;
        debugger;
        var _loop_1 = function (i) {
            var fieldID = "" + i + "_FIELDNAME";
            var checkboxID = "" + i + "_CHECKBOX";
            //debugger;
            $("#" + checkboxID).change(function () {
                if ($("#" + checkboxID).is(":checked")) {
                    //prefill auto value
                    var temp = "<" + _this._fieldNames[i] + ">";
                    $('#' + fieldID).val(temp);
                }
                else {
                    $('#' + fieldID).val("");
                }
            });
        };
        for (var i = 0; i < this._fieldNames.length; i++) {
            _loop_1(i);
        }
    };
    Vince_Script_API_3.prototype.prepare_open_setAPI_window = function () {
        //this.htmlStringSettings = "";
        this.run_MRS001MI_LstPrograms();
    };
    Vince_Script_API_3.prototype.open_set_API_window = function () {
        this.log.Info("open set api window");
        //debugger;
        this.apiProgInputID = "API_Program_Input_" + this.randomNumber();
        this.apiTransInputID = "API_Trans_Input_" + this.randomNumber();
        var htmlContent = "";
        htmlContent += "<div style=\"display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px;\"><label style=\"width:40%;\" for=\"".concat(this.apiProgInputID, "\">").concat(this.apiProgLabel, "</label><input name=\"Student\" id=\"").concat(this.apiProgInputID, "\" style=\"width: 40%; background-color:#ECECEC; border-width:0px; border-radius:3px; border-color:#C4D2E3\"/></div>");
        htmlContent += "<div style=\"display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px;\"><label style=\"width:40%;\" for=\"".concat(this.apiTransInputID, "\">").concat(this.apiTransLabel, "</label><input name=\"Student\" id=\"").concat(this.apiTransInputID, "\" style=\"width: 40%; background-color:#ECECEC; border-width:0px; border-radius:3px; border-color:#C4D2E3\"/></div>");
        var _this = this;
        var find_clicked = function () {
            _this.log.Info("getting api fields!");
            _this.api_name = $("#" + _this.apiProgInputID).val();
            _this.api_tran = $("#" + _this.apiTransInputID).val();
            //debugger;
            _this.prepare_open_settings_window();
        };
        var back_clicked = function () {
            _this.prepare_open_settings_window();
        };
        var button1array = ["Find", find_clicked];
        var button2array = ["Back", back_clicked];
        var buttons = [];
        buttons[0] = button1array;
        buttons[1] = button2array;
        //this.open_window("Choose API", 400, 300, htmlContent, "Find", "Back", "", find_clicked, back_clicked, () => { });
        this.log.Info("open vince modal show next");
        //this.vince_modal.message("TEST");
        this.vince_modal.show("Choose API", 400, 300, htmlContent, buttons);
    };
    Vince_Script_API_3.prototype.verifyArgs = function () {
        this.log.Info("verify Arguments");
        var content = this.args.split(",");
        if (content.length < 4) {
            this.controller.ShowMessage(this.argsErrorMsg);
            return false;
        }
        this.api_name = content[0];
        this.api_tran = content[1];
        for (var i = 2; i < content.length; i++) {
            var k = i - 2;
            if (content[i].indexOf(":") != -1) {
                var subcontent = content[i].split(":");
                this.fieldsInn[k] = subcontent[0];
                this.fieldMap[k] = subcontent[1];
            }
            else {
                this.fieldsInn[k] = content[i];
                this.fieldMap[k] = "-";
            }
            //Checking for displayname
            if (this.fieldsInn[k].indexOf("(") != -1) {
                var subcontent2 = this.fieldsInn[k].split("(");
                this.fieldsInn[k] = subcontent2[0];
                this.fieldNames[k] = subcontent2[1].substring(0, subcontent2[1].length - 1);
            }
            else {
                this.fieldNames[k] = "-";
            }
        }
        return true;
    };
    Vince_Script_API_3.prototype.setScriptKey = function () {
        if (this.args != undefined) {
            this.scriptKey = this.args;
        }
        else {
            this.scriptKey = "1";
        }
    };
    Vince_Script_API_3.prototype.randomNumber = function () {
        return String(Math.floor(Math.random() * 1000) + 1);
    };
    //#region API
    Vince_Script_API_3.prototype.rund_API_multiple = function () {
        this.tot_apis = this.inputArrays[0].length;
        for (var i = 0; i < this.inputArrays[0].length; i++) {
            this.Run_API(i);
        }
    };
    Vince_Script_API_3.prototype.Run_API = function (interation) {
        var _this_1 = this;
        this.log.Info("Run " + this.api_name + "/" + this.api_tran + ", fields inn:");
        var obj = {};
        var fieldsAdded = 0;
        for (var i = 0; i < this.fieldsInn.length; i++) {
            this.log.Info("".concat(this.fieldsInn[i], " : ") + $("#".concat(this.textboxIDs[i])).val());
            var fieldValueScreen = String($("#".concat(this.textboxIDs[i])).val());
            //debugger;
            if (fieldValueScreen == this.multiple) {
                if (this.inputArrays[i][interation] != "") {
                    obj[this.fieldsInn[i]] = this.inputArrays[i][interation];
                    fieldsAdded += 1;
                }
            }
            else {
                if (fieldValueScreen != "") {
                    obj[this.fieldsInn[i]] = fieldValueScreen;
                    fieldsAdded += 1;
                }
            }
        }
        if (fieldsAdded == 0) {
            this.vince_modal.message("You can not run the API without input!");
        }
        else {
            var myRequest = new MIRequest();
            myRequest.program = this.api_name;
            myRequest.transaction = this.api_tran;
            myRequest.includeMetadata = true;
            myRequest.maxReturnedRecords = 1;
            myRequest.record = obj;
            myRequest.outputFields = [];
            try {
                this.miService.executeRequest(myRequest).then(function (response) {
                    _this_1.api_counter += 1;
                    if (response.items.length > 0) {
                        if (_this_1.tot_apis > 1) {
                            if (_this_1.tot_apis == _this_1.api_counter) {
                                _this_1.open_window_message_info("APIs ran successfully!");
                                _this_1.controller.PressKey("F5");
                            }
                        }
                        else {
                            _this_1.open_window_message_info("API ran successfully!");
                            _this_1.controller.PressKey("F5");
                        }
                    }
                    else {
                        _this_1.open_window_message_error(response.errorField);
                    }
                }).catch(function (response) {
                    _this_1.log.Info(response.errorMessage);
                    _this_1.open_window_message_error(response.errorMessage);
                });
            }
            catch (message) {
                this.log.Info("There was a problem executing the API (" + message + ")");
                this.vince_modal.message("There was a problem executing the API (" + message + ")");
            }
        }
    };
    Vince_Script_API_3.prototype.run_MRS001MI_LstFields = function () {
        var _this_1 = this;
        var local_api_name = "MRS001MI";
        var local_api_tran = "LstFields";
        this.log.Info("Run " + local_api_name + "/" + local_api_tran);
        var myRequest = new MIRequest();
        myRequest.program = local_api_name;
        myRequest.transaction = local_api_tran;
        myRequest.includeMetadata = true;
        myRequest.maxReturnedRecords = 200;
        var MINM = this.api_name;
        var TRNM = this.api_tran;
        var TRTP = "I";
        myRequest.record = { MINM: MINM, TRNM: TRNM, TRTP: TRTP };
        myRequest.outputFields = ["FLNM", "LENG", "TYPE", "MAND"];
        this.miService.executeRequest(myRequest).then(function (response) {
            var _a;
            if (response.items.length > 0) {
                //Loop through all lines
                var i = 0;
                var counter = 0;
                //clear variables
                _this_1._fieldNames = [];
                _this_1.fieldLengths = [];
                _this_1.fieldTypes = [];
                //////
                _this_1.htmlStringSettings += "\n  <div style=\"display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px; margin-bottom:5px;\">\n    <div style=\"width:10%; font-size:14px; color:#003366; text-align:left; padding-left:10px;\">Sel</div>\n    <div style=\"width:20%; font-size:14px; color:#003366; text-align:left; padding-left:10px;\">Fld</div>\n    <div style=\"width:30%; font-size:14px; color:#003366; text-align:left; padding-left:1px;\">Prefill</div>\n    <div style=\"width:30%; font-size:14px; color:#003366; text-align:left; padding-left:1px;\">Label</div>\n  </div>\n";
                //////
                for (var _i = 0, _b = response.items; _i < _b.length; _i++) {
                    var item = _b[_i];
                    var fieldName = String(item.FLNM).trim();
                    var fieldType = String(item.TYPE).trim();
                    var fieldLength = String(item.LENG).trim();
                    _this_1._fieldNames[i] = fieldName;
                    _this_1.fieldLengths[i] = fieldLength;
                    _this_1.fieldTypes[i] = fieldType;
                    _this_1.allAPIfieldNames[i] = fieldName;
                    _this_1.allAPIfieldLengths[i] = fieldLength;
                    _this_1.allAPIfieldTypes[i] = fieldType;
                    var fieldID = "" + i + "_FIELDNAME";
                    var checkboxID = "" + i + "_CHECKBOX";
                    var labelFieldID = "" + i + "_LABELFIELD";
                    //debugger;
                    //Reflect which choices were already made
                    if (_this_1.selectedFields[counter] == fieldName) {
                        //this field was selected last time::
                        //*set it as checked
                        //*fill in the value field
                        var labelTaxtValue = (_a = _this_1.selectedLabels[counter]) !== null && _a !== void 0 ? _a : "";
                        //this.htmlStringSettings += `<div style="display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px; margin-bottom:5px;"><input style="-webkit-appearance:auto; width:auto;" type="checkbox" id=\"${checkboxID}\" checked><label style="width:40%;">${fieldName}</label><input id=\"${fieldID}\" style="width: 40%; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3" value=\"${this.selectedInput[counter]}\"/></div>`;
                        _this_1.htmlStringSettings += "<div style=\"display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px; margin-bottom:5px;\"><input style=\"-webkit-appearance:auto; width:auto;\" type=\"checkbox\" id=\"".concat(checkboxID, "\" checked><label style=\"width:20%;\">").concat(fieldName, "</label><input id=\"").concat(fieldID, "\" style=\"width: 30%; margin:2px; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3\" value=\"").concat(_this_1.selectedInput[counter], "\"/><input id=\"").concat(labelFieldID, "\" style=\"width: 30%; margin:2px; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3\" value=\"").concat(labelTaxtValue, "\"/></div>");
                        counter++;
                    }
                    else {
                        /*this.htmlStringSettings += `<div style="display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px; margin-bottom:5px;"><input style="-webkit-appearance:auto; width:auto;" type="checkbox" id=\"${checkboxID}\"><label style="width:40%;">${fieldName}</label><input id=\"${fieldID}\" style="width: 40%; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3"/></div>`;*/
                        _this_1.htmlStringSettings += "<div style=\"display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px; margin-bottom:5px;\"><input style=\"-webkit-appearance:auto; width:auto;\" type=\"checkbox\" id=\"".concat(checkboxID, "\"><label style=\"width:20%;\">").concat(fieldName, "</label><input id=\"").concat(fieldID, "\" style=\"width: 30%; margin:2px; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3\"/><input id=\"").concat(labelFieldID, "\" style=\"width: 30%; margin:2px; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3\"/></div>");
                    }
                    i++;
                }
                _this_1.totalAPIfields = i;
                _this_1.open_settings_window();
            }
            else {
                // Swal.fire('Error', 'Could not execute API! Please check that your input does not exceeds the maximum field lengths!', 'error');
                //this.showConfirmMessage("Could not execute API! Please check that your input does not exceeds the maximum field lengths!")
                var _this = _this_1;
                var ok_clicked = function () {
                    _this.open_set_API_window();
                };
                _this_1.open_window_message("Error!", "Could not find API! Please check your spelling!", "Ok", ok_clicked);
            }
        }).catch(function (response) {
            _this_1.log.Info(response.errorMessage);
            _this_1.open_window_message_error(response.errorMessage);
        });
    };
    Vince_Script_API_3.prototype.run_MRS001MI_LstPrograms = function () {
        var _this_1 = this;
        var local_api_name = "MRS001MI";
        var local_api_tran = "LstPrograms";
        this.log.Info("Run " + local_api_name + "/" + local_api_tran);
        var myRequest = new MIRequest();
        myRequest.program = local_api_name;
        myRequest.transaction = local_api_tran;
        myRequest.includeMetadata = true;
        myRequest.maxReturnedRecords = 200;
        myRequest.record = {};
        myRequest.outputFields = ["MINM"];
        //debugger;
        this.miService.executeRequest(myRequest).then(function (response) {
            if (response.items.length > 0) {
                _this_1.open_set_API_window();
            }
            else {
                _this_1.vince_modal.message("ERROR: Could not find API MRS001MI / LstPrograms!");
            }
        }).catch(function (response) {
            _this_1.log.Info(response.errorMessage);
            _this_1.vince_modal.message(response.errorMessage);
        });
    };
    Vince_Script_API_3.prototype.run_CUSEXTMI_OLD = function (transaction) {
        var _this_1 = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        //debugger;
        var local_api_name = "CUSEXTMI";
        var local_api_tran = transaction;
        this.log.Info("Run " + local_api_name + "/" + local_api_tran);
        var myRequest = new MIRequest();
        myRequest.program = local_api_name;
        myRequest.transaction = local_api_tran;
        myRequest.includeMetadata = true;
        //this.f0 = this._constructedFields[0] ?? "";
        this.f1 = (_a = this._constructedFields[1]) !== null && _a !== void 0 ? _a : "-";
        this.f2 = (_b = this._constructedFields[2]) !== null && _b !== void 0 ? _b : "-";
        this.f3 = (_c = this._constructedFields[3]) !== null && _c !== void 0 ? _c : "-";
        this.f4 = (_d = this._constructedFields[4]) !== null && _d !== void 0 ? _d : "-";
        this.f5 = (_e = this._constructedFields[5]) !== null && _e !== void 0 ? _e : "-";
        this.f6 = (_f = this._constructedFields[6]) !== null && _f !== void 0 ? _f : "-";
        this.f7 = (_g = this._constructedFields[7]) !== null && _g !== void 0 ? _g : "-";
        this.f8 = (_h = this._constructedFields[8]) !== null && _h !== void 0 ? _h : "-";
        this.f9 = (_j = this._constructedFields[9]) !== null && _j !== void 0 ? _j : "-";
        var pgmTran = this.api_name + ":" + this.api_tran;
        myRequest.record = { FILE: this.FILE, PK01: this.PK01, PK02: this.pgmPanel, PK03: this.scriptKey, A030: pgmTran, A130: this.f1, A230: this.f2, A330: this.f3, A430: this.f4, A530: this.f5, A630: this.f6, A730: this.f7, A830: this.f8, A930: this.f9 };
        myRequest.outputFields = ["FILE"];
        this.miService.executeRequest(myRequest).then(function (response) {
            if (response.items.length > 0) {
                // this.initiate_window();      
                // this.open_main_window();
                _this_1.run_main_window_process();
                //this.run_CUSEXTMI_GetFieldValue();
            }
            else {
                _this_1.open_window_message_error("(AA) Could not execute API to update settings!");
            }
        }).catch(function (response) {
            _this_1.log.Info(response.errorMessage);
            _this_1.open_window_message_error("(AB) " + response.errorMessage);
        });
    };
    //CCC
    Vince_Script_API_3.prototype.run_CUSEXTMI = function (transaction, records, subKey, f1, f2, f3, f4, f5, f6, f7, f8, f9) {
        var _this_1 = this;
        //debugger;
        var local_api_name = "CUSEXTMI";
        var local_api_tran = transaction;
        this.log.Info("Run " + local_api_name + "/" + local_api_tran);
        var myRequest = new MIRequest();
        myRequest.program = local_api_name;
        myRequest.transaction = local_api_tran;
        myRequest.includeMetadata = true;
        var pgmTran = this.api_name + ":" + this.api_tran;
        var scriptKeyX = this.scriptKey + ":" + subKey;
        myRequest.record = { FILE: this.FILE, PK01: this.PK01, PK02: this.pgmPanel, PK03: scriptKeyX, A121: records, A030: pgmTran, A130: f1, A230: f2, A330: f3, A430: f4, A530: f5, A630: f6, A730: f7, A830: f8, A930: f9 };
        myRequest.outputFields = ["FILE"];
        this.miService.executeRequest(myRequest).then(function (response) {
            if (response.items.length > 0) {
                _this_1.cugexCounter++;
                _this_1.log.Info("Comaparing: " + _this_1.cugexCounter + " with " + _this_1.cugexAddCounter);
                if (_this_1.cugexCounter == _this_1.cugexAddCounter) {
                    _this_1.run_main_window_process();
                }
            }
            else {
                _this_1.open_window_message_error("(AA) Could not execute API to update settings!");
            }
        }).catch(function (response) {
            _this_1.log.Info(response.errorMessage);
            _this_1.open_window_message_error("(AB) " + response.errorMessage);
        });
    };
    Vince_Script_API_3.prototype.run_CUSEXTMI_KPI = function (transaction) {
        var _this_1 = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var local_api_name = "CUSEXTMI";
        var local_api_tran = transaction;
        this.log.Info("Run " + local_api_name + "/" + local_api_tran);
        var myRequest = new MIRequest();
        myRequest.program = local_api_name;
        myRequest.transaction = local_api_tran;
        myRequest.includeMetadata = true;
        this.f0 = (_a = this._constructedFields[10]) !== null && _a !== void 0 ? _a : "-";
        this.f1 = (_b = this._constructedFields[11]) !== null && _b !== void 0 ? _b : "-";
        this.f2 = (_c = this._constructedFields[12]) !== null && _c !== void 0 ? _c : "-";
        this.f3 = (_d = this._constructedFields[13]) !== null && _d !== void 0 ? _d : "-";
        this.f4 = (_e = this._constructedFields[14]) !== null && _e !== void 0 ? _e : "-";
        this.f5 = (_f = this._constructedFields[15]) !== null && _f !== void 0 ? _f : "-";
        this.f6 = (_g = this._constructedFields[16]) !== null && _g !== void 0 ? _g : "-";
        this.f7 = (_h = this._constructedFields[17]) !== null && _h !== void 0 ? _h : "-";
        this.f8 = (_j = this._constructedFields[18]) !== null && _j !== void 0 ? _j : "-";
        this.f9 = (_k = this._constructedFields[19]) !== null && _k !== void 0 ? _k : "-";
        var pgmTran = this.api_name + ":" + this.api_tran;
        myRequest.record = { KPID: this.FILE, PK01: this.PK01, PK02: this.pgmPanel, PK03: this.scriptKey, AL30: pgmTran, AL31: this.f1, AL32: this.f2, AL33: this.f3, AL34: this.f4, AL35: this.f5, AL36: this.f6, AL37: this.f7, AL38: this.f8, AL39: this.f9 };
        myRequest.outputFields = ["KPID"];
        this.miService.executeRequest(myRequest).then(function (response) {
            if (response.items.length > 0) {
                _this_1.run_main_window_process();
            }
            else {
                _this_1.open_window_message_error("(CC) Couldnot execute API to update settings!");
            }
        }).catch(function (response) {
            _this_1.log.Info(response.errorMessage);
            _this_1.open_window_message_error("(CD) " + response.errorMessage);
        });
    };
    //AAA
    Vince_Script_API_3.prototype.run_CUSEXTMI_GetFieldValue = function (scriptKey, start_count) {
        var _this_1 = this;
        //debugger;
        var local_api_name = "CUSEXTMI";
        var local_api_tran = "GetFieldValue";
        this.log.Info("Run " + local_api_name + "/" + local_api_tran + " | scriptKey: " + scriptKey + ", start_count: " + start_count);
        //debugger;
        var myRequest = new MIRequest();
        myRequest.program = local_api_name;
        myRequest.transaction = local_api_tran;
        myRequest.includeMetadata = true;
        myRequest.record = { FILE: this.FILE, PK01: this.PK01, PK02: this.pgmPanel, PK03: scriptKey };
        myRequest.outputFields = ["FILE", "PK01", "PK02", "PK03", "A121", "A030", "A130", "A230", "A330", "A430", "A530", "A630", "A730", "A830", "A930"];
        this.miService.executeRequest(myRequest).then(function (response) {
            //debugger;
            if (response.items.length > 0) {
                _this_1.firstUse = false;
                // Store the information found in cugex
                var numberOfRecordsString = response.item.A121;
                var numberOfRecords = +numberOfRecordsString;
                _this_1.numberOfRecords = numberOfRecords;
                var thisRecordArray = response.item.PK03.split(":");
                var thisRecordString = thisRecordArray[1];
                //let thisRecordString: string = response.item.PK03.substring(2);
                var thisRecord = +thisRecordString;
                var temp = response.item.A030;
                var temp2 = temp.split(":");
                _this_1.api_name = temp2[0];
                _this_1.api_tran = temp2[1];
                //this.selectedFields = [];
                //this.selectedInput = [];
                var stopCount = start_count + 9;
                var fieldIDcounter = 1;
                debugger;
                for (var i = start_count; i < stopCount; i++) {
                    var tmp = response.item["A" + fieldIDcounter + "30"];
                    fieldIDcounter++;
                    if (tmp == undefined) {
                        break;
                    }
                    else if (tmp == "-") {
                        break;
                    }
                    var k = i - 1;
                    ///////////////////////////////////////
                    var cont = tmp.split(":");
                    var apiInfield = cont[0];
                    var getValueFrom = cont[1];
                    var fieldLength = cont[2];
                    var fieldType = cont[3];
                    var labelText = cont[4];
                    //if (cont.length > 4) {
                    //    //we have a label specified
                    //    labelText = cont[2];
                    //    fieldLength = cont[3];
                    //    fieldType = cont[4];
                    //} else {
                    //    fieldLength = cont[2];
                    //    fieldType = cont[3];
                    //}
                    _this_1.fieldsInn[k] = apiInfield;
                    _this_1.fieldMap[k] = getValueFrom;
                    _this_1.fieldTypes[k] = fieldType;
                    _this_1.fieldLengths[k] = fieldLength;
                    _this_1.selectedFields[k] = apiInfield;
                    _this_1.selectedInput[k] = getValueFrom;
                    _this_1.selectedLabels[k] = labelText;
                    _this_1._labelTexts[k] = labelText; //TODO
                }
                var tempRes = numberOfRecords - thisRecord;
                if (tempRes > 0) {
                    debugger;
                    //get the rest of the records...
                    var nextRecord = thisRecord + 1;
                    var scriptKey_1 = _this_1.scriptKey + ":" + nextRecord;
                    var startValue = (9 * thisRecord) + 1;
                    _this_1.run_CUSEXTMI_GetFieldValue(scriptKey_1, startValue);
                }
                else {
                    //debugger;
                    _this_1.run_continue();
                }
            }
            else {
                //ingen eksisterende records i CUGEX
                //Swal.fire('Error BB', 'Could not find an existing record in cugex', 'error');
                //alert("Error on API " + local_api_name + " / " + local_api_tran);
                _this_1.log.Info("function run_CUSEXTMI_GetFieldValue did not return any records (" + local_api_name + "/" + local_api_tran + ")");
                _this_1.open_set_API_window();
            }
        }).catch(function (response) {
            //ingen eksisterende records i CUGEX
            _this_1.log.Info("an error happened in run_CUSEXTMI_GetFieldValue. Ended up in catch!");
            //this.open_set_API_window();
            _this_1.open_set_API_window();
        });
    };
    //#endregion
    //#region Windows
    Vince_Script_API_3.prototype.open_window = function (title, width, height, html, button1text, button2text, button3text, f1, f2, f3) {
        var _this = this;
        var buttons = [];
        var button1array = [];
        button1array[0] = button1text;
        button1array[1] = f1;
        var button2array = [];
        button2array[0] = button2text;
        button2array[1] = f2;
        var button3array = [];
        button3array[0] = button3text;
        button3array[1] = f3;
        buttons[0] = button1array;
        buttons[1] = button2array;
        buttons[2] = button3array;
        this.log.Info("Calling vince modal! title = " + title);
        //this.vince_modal.show(title, width, height, html, button1text, button2text, button3text, f1, f2, f3);
        this.vince_modal.show(title, width, height, html, buttons);
    };
    Vince_Script_API_3.prototype.open_window_message = function (header, message, button_text, f1) {
        //this.open_window(header, 200, 500, message, button_text, undefined, undefined, f1, () => { }, () => { });
        var width = 200;
        var height = 500;
        var buttons = [];
        var button1array = [];
        button1array[0] = button_text;
        button1array[1] = f1;
        buttons[0] = button1array;
        //this.vince_modal.show(header, width, height, message, buttons);
        this.vince_modal.message(header + ": " + message);
    };
    Vince_Script_API_3.prototype.open_window_message_info = function (message) {
        //this.open_window("Info!", 200, 500, message, "Ok", undefined, undefined, () => { }, () => { }, () => { });
        this.vince_modal.message(message);
    };
    Vince_Script_API_3.prototype.open_window_message_error = function (message) {
        //this.open_window("Info!", 200, 500, message, "Ok", undefined, undefined, () => { }, () => { }, () => { });
        this.vince_modal.message(message);
    };
    //#endregion
    Vince_Script_API_3.prototype.Update_Usage_information = function () {
        var _this_1 = this;
        this.log.Info("Store_Usage_information");
        var program = "CUSEXTMI";
        var transaction = "GetFieldValue";
        //const timeElapsed = Date.now();
        //const today = new Date(timeElapsed);
        var record = { FILE: this.FILE_USAGE, PK01: this.scriptName, PK02: this.controller.GetPanelName() };
        var outputFields = ["A130", "A230"];
        MIService.Current.execute(program, transaction, record, outputFields).then(function (response) {
            if (response.items.length > 0) {
                _this_1.log.Info("Entry exists");
                //entry excists
                var numberOfRuns = response.item["A130"].toString();
                //let lastRun = response.item["A230"].toString();
                var numberOfRunsAsInteger = +numberOfRuns;
                numberOfRunsAsInteger += 1;
                //update information
                _this_1.log.Info("Update existiang_Usage_information");
                //TODO
                var program_1 = "CUSEXTMI";
                var transaction_1 = "ChgFieldValue";
                var timeElapsed = Date.now();
                var today = new Date(timeElapsed);
                var record_1 = { FILE: _this_1.FILE_USAGE, PK01: _this_1.scriptName, PK02: _this_1.controller.GetPanelName(), A130: numberOfRunsAsInteger, A230: today.toUTCString(), A330: ScriptUtil.GetUserContext("USID") };
                var outputFields_1 = ["FILE"];
                MIService.Current.execute(program_1, transaction_1, record_1, outputFields_1).then(function (response) {
                    if (response.items.length > 0) {
                        _this_1.log.Info("Entry Updated");
                    }
                    else {
                        _this_1.log.Info("Error 1!");
                    }
                }).catch(function (response) {
                    _this_1.log.Info(response.errorMessage);
                });
            }
            else {
                _this_1.log.Info("No entry yet");
                //create new entry
                _this_1.log.Info("Store_new_Usage_information");
                var program_2 = "CUSEXTMI";
                var transaction_2 = "AddFieldValue";
                var timeElapsed = Date.now();
                var today = new Date(timeElapsed);
                var record_2 = { FILE: _this_1.FILE_USAGE, PK01: _this_1.scriptName, PK02: _this_1.controller.GetPanelName(), A030: today.toUTCString(), A130: "1", A230: today.toUTCString(), A330: ScriptUtil.GetUserContext("USID") };
                var outputFields_2 = ["FILE"];
                MIService.Current.execute(program_2, transaction_2, record_2, outputFields_2).then(function (response) {
                    if (response.items.length > 0) {
                        _this_1.log.Info("New Entry created");
                    }
                    else {
                        _this_1.log.Info("Error 2!");
                    }
                }).catch(function (response) {
                    _this_1.log.Info(response.errorMessage);
                });
            }
        }).catch(function (response) {
            _this_1.log.Info(response.errorMessage);
        });
    };
    Vince_Script_API_3.Init = function (args) {
        new Vince_Script_API_3(args).run();
    };
    return Vince_Script_API_3;
}());
//# sourceMappingURL=Vince_Script_API_3.js.map