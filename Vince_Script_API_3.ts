//Developed by
//Christian Heggen



//TODO Script
//Bruk api til å alltid hente inn de forhåndutfyllte feltene....
//Nå er det sårbart da scriptet vil anta at innholdeti feltet er "det man kan se", men det kommer også ann på bredden på kolonnen


class Vince_Script_API_3 {

    private version = "1.1";

    private scriptName = "Vince_Script_API_3";
    private controller: IInstanceController;
    private log: IScriptLog;

    private detachRequesting: Function;
    private detachRequested: Function;

    private angular: boolean;

    private args: string;
    private argsErrorMsg = "Script args should be: <API_NAME>,<API_TRANSACTION>,<FIELD1_NAME>,<FIELD2_NAME>, ...(as many fields as necessary.)";
    private api_name;
    private api_tran;

    private fieldNames;
    private miService;

    private mainWindow_width;
    private mainWindow_height;
    private gridID;
    private textboxIDs;

    private htmlString: string;
    private htmlStringSettings: string = "";

    private apiProgInputID = "apiProgram";
    private apiTransInputID = "apiTrans";
    private apiProgLabel = "API program: ";
    private apiTransLabel = "API transaction: ";

    private apiSelectedProgram = "";
    private apiSelectedTransaction = "";


    private cugexAddCounter;
    private cugexGetCounter;
    private cugexCounter;
    private numberOfRecords;

    private _labelTexts = [];

    //CUGEX USAGE
    private FILE_USAGE = "V_USAGE";

    //CUGEX Add records
    private FILE = "V_SCRIPT";
    private PK01 = "API_3";
    private programName; //ProgramName

    private pgmPanel;
    private f0 = "";
    private f1 = "";
    private f2 = "";
    private f3 = "";
    private f4 = "";
    private f5 = "";
    private f6 = "";
    private f7 = "";
    private f8 = "";
    private f9 = "";

    //all fields coming from api
    private _fieldNames = [];
    //private _fieldValues = [];


    private fieldsInn = [];
    private fieldMap = [];
    private fieldTypes = [];
    private fieldLengths = [];

    private allAPIfieldNames = [];
    private allAPIfieldTypes = [];
    private allAPIfieldLengths = [];


    private fieldInput = [];

    //selected fields from API
    private selectedFields = [];
    private selectedInput = [];
    private selectedLabels = [];
    private selectedTypes = [];
    private selectedLengths = [];


    private _constructedFields = [];

    private totalAPIfields = 0;

    private firstUse;

    private inputArrays = [];
    private multiple = "*MULTIPLE*";

    //#region variables Vince Modal
    private vince_modal: Vince_Modal;
    private scriptKey;
    private panelName;
    //#endregion

    private d1_width = 600;
    private d1_height = 400;

    private tot_apis;
    private api_counter;

    //private lastClickedSpan: HTMLElement | null = null;

    constructor(args: IScriptArgs) {
        this.controller = args.controller;
        this.log = args.log;
        this.args = args.args;

        this.mainWindow_width = 340;
        this.fieldsInn = [];
        this.fieldMap = [];//used to prefill values from alternative columns
        this.fieldNames = [];//used to display a differen name than the field ID

        this._labelTexts = [];

        //this.gridID = "chGrid_" + this.randomNumber();
        this.textboxIDs = [];

        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
            this.angular = true;
        } else {
            this.miService = MIService.Current
            this.angular = false;
        }

        //Set script Key
        if (this.args != undefined) {
            this.scriptKey = this.args;
        } else {
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

    public run(): void {
        const controller = this.controller;

        //if (this.lastClickedSpan) {
        //    const text = this.lastClickedSpan.textContent?.trim() || "[empty]";
        //    alert(`Most recently clicked <span> content: "${text}"`);
        //} else {
        //    alert("No <span> element has been clicked yet.");
        //}

        /////////////////////////


        this.log.Info("Running " + this.scriptName + " version " + this.version);


    }

    public script_loaded(): void {
        this.log.Info("Script loaded");

        this.Update_Usage_information();

        //this.setScriptKey();
        this.vince_modal = new Vince_Modal("Modal_For_API_Script", this.panelName, this.scriptKey);
        this.run_main_window_process();
    }

    public run_main_window_process(): void {
        //Reset variables
        this.fieldsInn = [];
        this.fieldMap = [];//used to prefill values from alternative columns
        this.fieldNames = [];//used to display a differen name than the field ID

        let scriptKey = this.scriptKey + ":1";
        this.selectedFields = [];
        this.selectedInput = [];
        this.selectedLabels = [];

        this.run_CUSEXTMI_GetFieldValue(scriptKey,1);
    }

    public run_continue(): void {
        this.log.Info("run_continue");

        this.initiate_window();//defines new textbox IDs > stores them in this.textboxIDs
        this.open_main_window();

        //setTimeout(() => {
        //   alert('Ill print third after a second');
        //}, 1000);

        this.prefill_values();
    }

    public initiate_window(): void {

        this.log.Info("initiate_window");

        this.htmlString = "";
        //debugger;
        for (var i = 0; i < this.fieldsInn.length; i++) {
            //var labelText = this.fieldsInn[i];
            var labelText
            if (this.selectedLabels[i]) {
                labelText = this.selectedLabels[i];
            } else {
                labelText = this.fieldsInn[i];
            }

            //if (this.fieldNames[i] != "") {
            //    labelText = this.fieldNames[i];
            //}

            //if (this._labelTexts[i] != "") {
            //    labelText = this._labelTexts[i];
            //}

            let textBoxID = "ROW_" + i + "_" + this.randomNumber();
            //debugger;
            this.textboxIDs[i] = textBoxID;

            this.htmlString += `<div style="display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px;"><label style="width:30%; text-align:left; float:left;" for=\"${this.textboxIDs[i]}\">${labelText}</label><input name="Student" id=\"${this.textboxIDs[i]}\" style="width:65%; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3"/></div>`;

        }

        //this.htmlString += `<div style="text-align:center; margin-top:15px; font-size:12px;"><a href="https://vincesoftware.com/services" target="_blank" style="text-decoration:none; color:#333;">Powered by Vince</a></div>`;
    }

    public delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public prefill_values(): void {

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
                    let tempVal = ListControl.ListView.GetValueByColumnName(fieldName);
                    //this.log.Info(tempVal.toString());
                    if (tempVal != undefined) {
                        if (tempVal.length > 1) {
                            finalValue = this.multiple;
                            this.inputArrays[i] = tempVal;

                        } else {
                            finalValue = tempVal[0];
                        }
                    }
                } else {
                    //fieldname should be 6 long
                    let tempVal = ScriptUtil.GetFieldValue(fieldName, this.controller);

                    //this.log.Info(tempVal);

                    if (tempVal != undefined) {
                        finalValue = tempVal;
                    }
                }

            } else {
                finalValue = inValue;
            }

            this.log.Info("Final value: " + finalValue);
            /*debugger*/;
            if (finalValue != "") {
                //debugger;
                this.log.Info("Trying to put valueinto field: " + this.textboxIDs[i]);
                $(`#${this.textboxIDs[i]}`).val(finalValue);
            }
        }

    }

    public open_main_window(): void {

        var _this = this;

        this.log.Info("open main window");
        this.log.Info(this.api_name + " / " + this.api_tran);

        let run_clicked = () => {
            _this.log.Info("Trying to run API!");

            if (_this.inputArrays.length > 0) {
                _this.rund_API_multiple();
            } else {
                _this.Run_API();
            }
        };

        let settings_clicked = () => {
            //settings button clicked
            if (_this.firstUse) {
                _this.open_set_API_window();
            } else {
                _this.prepare_open_settings_window();
            }
        };

        this.log.Info("calling open_window!");

        let button1array = ["Run", run_clicked];
        let button2array = ["Settings", settings_clicked];
        //let button3array = ["Cancel", () => { }];
        let buttons: any[][] = [];
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
    }

    public prepare_open_settings_window(): void {

        this.htmlStringSettings = "";

        this.run_MRS001MI_LstFields();
    }

    public open_settings_window(): void {
        //this window will show all posible input fields for the api, and show you the sleections you have made

        this.log.Info("open_settings_window");
        var _this = this;

        let save_clicked = () => {
            _this.log.Info("Store new information in CUGEX");

            _this._constructedFields = [];

            //keep the html updated in case the user selects to many field and need to change that before it gets saved to cugex
            //_this.htmlStringSettings = `<div style="display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px;"><label style="width:100%;">${this.api_name}/${this.api_tran}</label></div>`;
            _this.htmlStringSettings = "";
            debugger;
            var counter = 1;
            for (var i = 0; i < _this.totalAPIfields; i++) {
                let fieldID = "" + i + "_FIELDNAME";
                let checkboxID = "" + i + "_CHECKBOX";
                let labelFieldID = "" + i + "_LABELFIELD";

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

                    let valueString = fieldName + ":" + inValue + ":" + fieldLength + ":" + fieldType + ":" + labelText;

                    _this._constructedFields[counter] = valueString;
                    counter++;

                    _this.htmlStringSettings += `<div style="display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px; margin-bottom:5px;"><input style="-webkit-appearance:auto; width:auto;" type="checkbox" id=\"${checkboxID}\" checked><label style="width:20%;">${fieldName}</label><input id=\"${fieldID}\" style="width: 30%; margin:2px; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3" value=\"${inValue}\"/><input id=\"${labelFieldID}\" style="width: 30%; margin:2px; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3" value=\"${labelText}\"/></div>`;
                } else {
                    //for the imidiate rollback
                    //_this.htmlStringSettings += `<div style="display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px; margin-bottom:5px;"><input style="-webkit-appearance:auto; width:auto;" type="checkbox" id=\"${checkboxID}\"><label style="width:40%;">${fieldName}</label><input id=\"${fieldID}\" style="width: 40%; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3"/></div>`;

                    _this.htmlStringSettings += `<div style="display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px; margin-bottom:5px;"><input style="-webkit-appearance:auto; width:auto;" type="checkbox" id=\"${checkboxID}\"><label style="width:20%;">${fieldName}</label><input id=\"${fieldID}\" style="width: 30%; margin:2px; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3"/><input id=\"${labelFieldID}\" style="width: 30%; margin:2px; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3"/></div>`;
                }
            }
            ///BBB
            this.f1 = this._constructedFields[1] ?? "-";
            this.f2 = this._constructedFields[2] ?? "-";
            this.f3 = this._constructedFields[3] ?? "-";
            this.f4 = this._constructedFields[4] ?? "-";
            this.f5 = this._constructedFields[5] ?? "-";
            this.f6 = this._constructedFields[6] ?? "-";
            this.f7 = this._constructedFields[7] ?? "-";
            this.f8 = this._constructedFields[8] ?? "-";
            this.f9 = this._constructedFields[9] ?? "-";

            this.cugexCounter = 0;
            if (counter <= 10) {

                _this.cugexAddCounter = 1;

                var transaction = "";
                if (_this.firstUse) {
                    transaction = "AddFieldValue";
                } else {
                    transaction = "ChgFieldValue";
                }

                _this.run_CUSEXTMI(transaction, "1", "1", this.f1, this.f2, this.f3, this.f4, this.f5, this.f6, this.f7, this.f8, this.f9);

                //Check if we need to delete old record
                if (this.numberOfRecords == 2) {
                    //delete old record
                    _this.run_CUSEXTMI("DelFieldValue", "", "2", "", "", "", "", "", "", "", "", "");
                }

            } else if (counter <= 19) {

                _this.cugexAddCounter = 2;

                //utfordring... Det kan være "ikke first use" men likevell være nødvendigå kjøreen add på en (eller flere ) nyelinjer
                //hvis det ved utlesning var færre linjer enn det er nå (number of records),
                //må vikjøre add på linje 2

                let f10 = this._constructedFields[10] ?? "-";
                let f11 = this._constructedFields[11] ?? "-";
                let f12 = this._constructedFields[12] ?? "-";
                let f13 = this._constructedFields[13] ?? "-";
                let f14 = this._constructedFields[14] ?? "-";
                let f15 = this._constructedFields[15] ?? "-";
                let f16 = this._constructedFields[16] ?? "-";
                let f17 = this._constructedFields[17] ?? "-";
                let f18 = this._constructedFields[18] ?? "-";
                //let f19 = this._constructedFields[19] ?? "-";

                var transaction1 = "";
                var transaction2 = "";
                if (_this.firstUse) {
                    transaction1 = "AddFieldValue";
                    transaction2 = "AddFieldValue";
                } else {
                    transaction1 = "ChgFieldValue";
                    if (this.numberOfRecords == 2) {
                        transaction2 = "ChgFieldValue";
                    } else {
                        transaction2 = "AddFieldValue";
                    }
                }

                _this.run_CUSEXTMI(transaction1, "2", "1", this.f1, this.f2, this.f3, this.f4, this.f5, this.f6, this.f7, this.f8, this.f9);
                _this.run_CUSEXTMI(transaction2, "2", "2", f10, f11, f12, f13, f14, f15, f16, f17, f18);

            } else {
                _this.open_window_message("OBS!", "The 1.0 version of this script does not support more than 18 api fields!", "OK", _this.open_settings_window);
            }
        };

        let settings_clicked = () => {
            _this.log.Info("Change API Clicked!");
            //_this.open_set_API_window();
            _this.prepare_open_setAPI_window();
        };


        var buttons: any[][] = [];

        var button1array = [];
        button1array[0] = "Save";
        button1array[1] = save_clicked;

        var button2array = [];
        button2array[0] = "Change API";
        button2array[1] = settings_clicked;

        buttons[0] = button1array;
        buttons[1] = button2array;
        //debugger;
        this.vince_modal.show(`Settings: ${this.api_name}/${this.api_tran} `, this.d1_width, this.d1_height, this.htmlStringSettings, buttons);
        //this.open_window("Settings", 400, 200, this.htmlStringSettings, "Save", "Change API", "", save_clicked, settings_clicked, () => { });


        this.addCheckboxEvents();
    }

    private addCheckboxEvents(): void {
        //Add checkbox events
        var _this = this;
        debugger;
        for (let i = 0; i < this._fieldNames.length; i++) {

            let fieldID = "" + i + "_FIELDNAME";
            let checkboxID = "" + i + "_CHECKBOX";
            //debugger;
            $("#" + checkboxID).change(function () {

                if ($("#" + checkboxID).is(":checked")) {

                    //prefill auto value
                    let temp = "<" + _this._fieldNames[i] + ">";
                    $('#' + fieldID).val(temp);
                } else {
                    $('#' + fieldID).val("");
                }
            });
        }
    }

    public prepare_open_setAPI_window(): void {

        //this.htmlStringSettings = "";

        this.run_MRS001MI_LstPrograms();
    }

    public open_set_API_window(): void {
        this.log.Info("open set api window");
        //debugger;
        this.apiProgInputID = "API_Program_Input_" + this.randomNumber();
        this.apiTransInputID = "API_Trans_Input_" + this.randomNumber();

        var htmlContent = "";
        htmlContent += `<div style="display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px;"><label style="width:40%;" for=\"${this.apiProgInputID}\">${this.apiProgLabel}</label><input name="Student" id=\"${this.apiProgInputID}\" style="width: 40%; background-color:#ECECEC; border-width:0px; border-radius:3px; border-color:#C4D2E3"/></div>`;
        htmlContent += `<div style="display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px;"><label style="width:40%;" for=\"${this.apiTransInputID}\">${this.apiTransLabel}</label><input name="Student" id=\"${this.apiTransInputID}\" style="width: 40%; background-color:#ECECEC; border-width:0px; border-radius:3px; border-color:#C4D2E3"/></div>`;

        var _this = this;

        let find_clicked = () => {
            _this.log.Info("getting api fields!");
            _this.api_name = $("#" + _this.apiProgInputID).val();
            _this.api_tran = $("#" + _this.apiTransInputID).val();
            //debugger;
            _this.prepare_open_settings_window();
        };

        let back_clicked = () => {
            _this.prepare_open_settings_window();
        };

        var button1array = ["Find", find_clicked];
        var button2array = ["Back", back_clicked];

        var buttons: any[][] = [];
        buttons[0] = button1array;
        buttons[1] = button2array;



        //this.open_window("Choose API", 400, 300, htmlContent, "Find", "Back", "", find_clicked, back_clicked, () => { });
        this.log.Info("open vince modal show next");
        //this.vince_modal.message("TEST");
        this.vince_modal.show("Choose API", 400, 300, htmlContent, buttons);
    }

    public verifyArgs(): boolean {
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
            } else {
                this.fieldsInn[k] = content[i];
                this.fieldMap[k] = "-";
            }

            //Checking for displayname
            if (this.fieldsInn[k].indexOf("(") != -1) {
                var subcontent2 = this.fieldsInn[k].split("(");

                this.fieldsInn[k] = subcontent2[0];
                this.fieldNames[k] = subcontent2[1].substring(0, subcontent2[1].length - 1);
            } else {
                this.fieldNames[k] = "-";
            }
        }

        return true;
    }

    public setScriptKey(): void {
        if (this.args != undefined) {
            this.scriptKey = this.args;

        } else {
            this.scriptKey = "1";
        }
    }

    public randomNumber(): string {
        return String(Math.floor(Math.random() * 1000) + 1);
    }

    //#region API

    public rund_API_multiple(): void {
        this.tot_apis = this.inputArrays[0].length;

        for (var i = 0; i < this.inputArrays[0].length; i++) {
            this.Run_API(i);
        }

    }

    public Run_API(interation?: number): void {

        this.log.Info("Run " + this.api_name + "/" + this.api_tran + ", fields inn:");

        var obj: { [k: string]: any } = {};
        let fieldsAdded: number = 0;

        for (var i = 0; i < this.fieldsInn.length; i++) {
            this.log.Info(`${this.fieldsInn[i]} : ` + $(`#${this.textboxIDs[i]}`).val());

            var fieldValueScreen = String($(`#${this.textboxIDs[i]}`).val());
            //debugger;
            if (fieldValueScreen == this.multiple) {
                if (this.inputArrays[i][interation] != "") {
                    obj[this.fieldsInn[i]] = this.inputArrays[i][interation];
                    fieldsAdded += 1;
                }
            } else {
                if (fieldValueScreen != "") {
                    obj[this.fieldsInn[i]] = fieldValueScreen;
                    fieldsAdded += 1;
                }
            }
        }

        if (fieldsAdded == 0) {
            this.vince_modal.message("You can not run the API without input!");
        } else {

            const myRequest = new MIRequest();
            myRequest.program = this.api_name;
            myRequest.transaction = this.api_tran;

            myRequest.includeMetadata = true;
            myRequest.maxReturnedRecords = 1;

            myRequest.record = obj;
            myRequest.outputFields = [];

            try {
                this.miService.executeRequest(myRequest).then(
                    (response: IMIResponse) => {

                        this.api_counter += 1;

                        if (response.items.length > 0) {
                            if (this.tot_apis > 1) {
                                if (this.tot_apis == this.api_counter) {
                                    this.open_window_message_info("APIs ran successfully!");
                                    this.controller.PressKey("F5");
                                }
                            } else {
                                this.open_window_message_info("API ran successfully!");
                                this.controller.PressKey("F5");
                            }

                        } else {
                            this.open_window_message_error(response.errorField);
                        }



                    }).catch((response: IMIResponse) => {
                        this.log.Info(response.errorMessage);
                        this.open_window_message_error(response.errorMessage);
                    });
            } catch (message) {
                this.log.Info("There was a problem executing the API (" + message + ")");
                this.vince_modal.message("There was a problem executing the API (" + message + ")");
            }
        }
    }


    public run_MRS001MI_LstFields(): void {

        var local_api_name = "MRS001MI";
        var local_api_tran = "LstFields";

        this.log.Info("Run " + local_api_name + "/" + local_api_tran);

        const myRequest = new MIRequest();
        myRequest.program = local_api_name;
        myRequest.transaction = local_api_tran;

        myRequest.includeMetadata = true;
        myRequest.maxReturnedRecords = 200;

        var MINM = this.api_name;
        var TRNM = this.api_tran;
        var TRTP = "I";

        myRequest.record = { MINM: MINM, TRNM: TRNM, TRTP: TRTP };
        myRequest.outputFields = ["FLNM", "LENG", "TYPE", "MAND"];

        this.miService.executeRequest(myRequest).then(
            (response: IMIResponse) => {

                if (response.items.length > 0) {

                    //Loop through all lines
                    var i = 0;
                    var counter = 0;

                    //clear variables
                    this._fieldNames = [];
                    this.fieldLengths = [];
                    this.fieldTypes = [];

                    //////
                    this.htmlStringSettings += `
  <div style="display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px; margin-bottom:5px;">
    <div style="width:10%; font-size:14px; color:#003366; text-align:left; padding-left:10px;">Sel</div>
    <div style="width:20%; font-size:14px; color:#003366; text-align:left; padding-left:10px;">Fld</div>
    <div style="width:30%; font-size:14px; color:#003366; text-align:left; padding-left:1px;">Prefill</div>
    <div style="width:30%; font-size:14px; color:#003366; text-align:left; padding-left:1px;">Label</div>
  </div>
`;

                    //////

                    for (let item of response.items) {
                        var fieldName = String(item.FLNM).trim();
                        var fieldType = String(item.TYPE).trim();
                        var fieldLength = String(item.LENG).trim();

                        this._fieldNames[i] = fieldName;
                        this.fieldLengths[i] = fieldLength;
                        this.fieldTypes[i] = fieldType;

                        this.allAPIfieldNames[i] = fieldName;
                        this.allAPIfieldLengths[i] = fieldLength;
                        this.allAPIfieldTypes[i] = fieldType;



                        var fieldID = "" + i + "_FIELDNAME";
                        var checkboxID = "" + i + "_CHECKBOX";
                        var labelFieldID = "" + i + "_LABELFIELD";
                        //debugger;
                        //Reflect which choices were already made
                        if (this.selectedFields[counter] == fieldName) {
                            //this field was selected last time::
                            //*set it as checked
                            //*fill in the value field

                            let labelTaxtValue = this.selectedLabels[counter] ?? "";

                            //this.htmlStringSettings += `<div style="display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px; margin-bottom:5px;"><input style="-webkit-appearance:auto; width:auto;" type="checkbox" id=\"${checkboxID}\" checked><label style="width:40%;">${fieldName}</label><input id=\"${fieldID}\" style="width: 40%; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3" value=\"${this.selectedInput[counter]}\"/></div>`;
                            this.htmlStringSettings += `<div style="display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px; margin-bottom:5px;"><input style="-webkit-appearance:auto; width:auto;" type="checkbox" id=\"${checkboxID}\" checked><label style="width:20%;">${fieldName}</label><input id=\"${fieldID}\" style="width: 30%; margin:2px; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3" value=\"${this.selectedInput[counter]}\"/><input id=\"${labelFieldID}\" style="width: 30%; margin:2px; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3" value=\"${labelTaxtValue}\"/></div>`;

                            counter++;
                        } else {
                            /*this.htmlStringSettings += `<div style="display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px; margin-bottom:5px;"><input style="-webkit-appearance:auto; width:auto;" type="checkbox" id=\"${checkboxID}\"><label style="width:40%;">${fieldName}</label><input id=\"${fieldID}\" style="width: 40%; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3"/></div>`;*/
                            this.htmlStringSettings += `<div style="display:flex; flex-direction: row; justify-content: center; align-items: center; margin-top:5px; margin-bottom:5px;"><input style="-webkit-appearance:auto; width:auto;" type="checkbox" id=\"${checkboxID}\"><label style="width:20%;">${fieldName}</label><input id=\"${fieldID}\" style="width: 30%; margin:2px; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3"/><input id=\"${labelFieldID}\" style="width: 30%; margin:2px; background-color:#DAEBFF; border-width:0px; border-radius:3px; border-color:#C4D2E3"/></div>`;
                        }

                        i++;
                    }


                    this.totalAPIfields = i;
                    this.open_settings_window();

                } else {
                    // Swal.fire('Error', 'Could not execute API! Please check that your input does not exceeds the maximum field lengths!', 'error');
                    //this.showConfirmMessage("Could not execute API! Please check that your input does not exceeds the maximum field lengths!")

                    var _this = this;
                    let ok_clicked = () => {
                        _this.open_set_API_window();
                    };

                    this.open_window_message("Error!", "Could not find API! Please check your spelling!", "Ok", ok_clicked);

                }

            }).catch((response: IMIResponse) => {
                this.log.Info(response.errorMessage);
                this.open_window_message_error(response.errorMessage);
            });
    }


    public run_MRS001MI_LstPrograms(): void {

        var local_api_name = "MRS001MI";
        var local_api_tran = "LstPrograms";

        this.log.Info("Run " + local_api_name + "/" + local_api_tran);

        const myRequest = new MIRequest();
        myRequest.program = local_api_name;
        myRequest.transaction = local_api_tran;

        myRequest.includeMetadata = true;
        myRequest.maxReturnedRecords = 200;

        myRequest.record = {};
        myRequest.outputFields = ["MINM"];
        //debugger;
        this.miService.executeRequest(myRequest).then(
            (response: IMIResponse) => {

                if (response.items.length > 0) {


                    this.open_set_API_window();

                } else {
                    this.vince_modal.message("ERROR: Could not find API MRS001MI / LstPrograms!");
                }

            }).catch((response: IMIResponse) => {
                this.log.Info(response.errorMessage);
                this.vince_modal.message(response.errorMessage);
            });
    }

    public run_CUSEXTMI_OLD(transaction: string): void {
        //debugger;
        var local_api_name = "CUSEXTMI";
        var local_api_tran = transaction;

        this.log.Info("Run " + local_api_name + "/" + local_api_tran);

        const myRequest = new MIRequest();
        myRequest.program = local_api_name;
        myRequest.transaction = local_api_tran;

        myRequest.includeMetadata = true;

        //this.f0 = this._constructedFields[0] ?? "";
        this.f1 = this._constructedFields[1] ?? "-";
        this.f2 = this._constructedFields[2] ?? "-";
        this.f3 = this._constructedFields[3] ?? "-";
        this.f4 = this._constructedFields[4] ?? "-";
        this.f5 = this._constructedFields[5] ?? "-";
        this.f6 = this._constructedFields[6] ?? "-";
        this.f7 = this._constructedFields[7] ?? "-";
        this.f8 = this._constructedFields[8] ?? "-";
        this.f9 = this._constructedFields[9] ?? "-";

        var pgmTran = this.api_name + ":" + this.api_tran;

        myRequest.record = { FILE: this.FILE, PK01: this.PK01, PK02: this.pgmPanel, PK03: this.scriptKey, A030: pgmTran, A130: this.f1, A230: this.f2, A330: this.f3, A430: this.f4, A530: this.f5, A630: this.f6, A730: this.f7, A830: this.f8, A930: this.f9 };
        myRequest.outputFields = ["FILE"];

        this.miService.executeRequest(myRequest).then(
            (response: IMIResponse) => {

                if (response.items.length > 0) {

                    // this.initiate_window();      
                    // this.open_main_window();
                    this.run_main_window_process();
                    //this.run_CUSEXTMI_GetFieldValue();

                } else {
                    this.open_window_message_error("(AA) Could not execute API to update settings!");
                }

            }).catch((response: IMIResponse) => {
                this.log.Info(response.errorMessage);
                this.open_window_message_error("(AB) " + response.errorMessage);
            });
    }
    //CCC
    public run_CUSEXTMI(transaction: string, records: string, subKey: string, f1: string, f2: string, f3: string, f4: string, f5: string, f6: string, f7: string, f8: string, f9: string): void {
        //debugger;
        var local_api_name = "CUSEXTMI";
        var local_api_tran = transaction;

        this.log.Info("Run " + local_api_name + "/" + local_api_tran);

        const myRequest = new MIRequest();
        myRequest.program = local_api_name;
        myRequest.transaction = local_api_tran;

        myRequest.includeMetadata = true;

        var pgmTran = this.api_name + ":" + this.api_tran;
        var scriptKeyX = this.scriptKey + ":" + subKey;

        myRequest.record = { FILE: this.FILE, PK01: this.PK01, PK02: this.pgmPanel, PK03: scriptKeyX, A121: records, A030: pgmTran, A130: f1, A230: f2, A330: f3, A430: f4, A530: f5, A630: f6, A730: f7, A830: f8, A930: f9 };
        myRequest.outputFields = ["FILE"];

        this.miService.executeRequest(myRequest).then(
            (response: IMIResponse) => {


                if (response.items.length > 0) {

                    this.cugexCounter++;
                    this.log.Info("Comaparing: " + this.cugexCounter + " with " + this.cugexAddCounter);
                    if (this.cugexCounter == this.cugexAddCounter) {
                        this.run_main_window_process();
                    }

                } else {
                    this.open_window_message_error("(AA) Could not execute API to update settings!");
                }

            }).catch((response: IMIResponse) => {
                this.log.Info(response.errorMessage);
                this.open_window_message_error("(AB) " + response.errorMessage);
            });
    }

    public run_CUSEXTMI_KPI(transaction: string): void {

        var local_api_name = "CUSEXTMI";
        var local_api_tran = transaction;

        this.log.Info("Run " + local_api_name + "/" + local_api_tran);

        const myRequest = new MIRequest();
        myRequest.program = local_api_name;
        myRequest.transaction = local_api_tran;

        myRequest.includeMetadata = true;

        this.f0 = this._constructedFields[10] ?? "-";
        this.f1 = this._constructedFields[11] ?? "-";
        this.f2 = this._constructedFields[12] ?? "-";
        this.f3 = this._constructedFields[13] ?? "-";
        this.f4 = this._constructedFields[14] ?? "-";
        this.f5 = this._constructedFields[15] ?? "-";
        this.f6 = this._constructedFields[16] ?? "-";
        this.f7 = this._constructedFields[17] ?? "-";
        this.f8 = this._constructedFields[18] ?? "-";
        this.f9 = this._constructedFields[19] ?? "-";

        var pgmTran = this.api_name + ":" + this.api_tran;

        myRequest.record = { KPID: this.FILE, PK01: this.PK01, PK02: this.pgmPanel, PK03: this.scriptKey, AL30: pgmTran, AL31: this.f1, AL32: this.f2, AL33: this.f3, AL34: this.f4, AL35: this.f5, AL36: this.f6, AL37: this.f7, AL38: this.f8, AL39: this.f9 };
        myRequest.outputFields = ["KPID"];

        this.miService.executeRequest(myRequest).then(
            (response: IMIResponse) => {

                if (response.items.length > 0) {

                    this.run_main_window_process();

                } else {
                    this.open_window_message_error("(CC) Couldnot execute API to update settings!");
                }

            }).catch((response: IMIResponse) => {
                this.log.Info(response.errorMessage);
                this.open_window_message_error("(CD) " + response.errorMessage);
            });
    }

    //AAA
    public run_CUSEXTMI_GetFieldValue(scriptKey: string, start_count: number): void {
        //debugger;
        var local_api_name = "CUSEXTMI";
        var local_api_tran = "GetFieldValue";

        this.log.Info("Run " + local_api_name + "/" + local_api_tran + " | scriptKey: " + scriptKey + ", start_count: " + start_count);
        //debugger;
        const myRequest = new MIRequest();
        myRequest.program = local_api_name;
        myRequest.transaction = local_api_tran;

        myRequest.includeMetadata = true;

        myRequest.record = { FILE: this.FILE, PK01: this.PK01, PK02: this.pgmPanel, PK03: scriptKey };
        myRequest.outputFields = ["FILE", "PK01", "PK02", "PK03", "A121", "A030", "A130", "A230", "A330", "A430", "A530", "A630", "A730", "A830", "A930"];

        this.miService.executeRequest(myRequest).then(
            (response: IMIResponse) => {

                //debugger;
                if (response.items.length > 0) {
                    this.firstUse = false;
                    // Store the information found in cugex

                    let numberOfRecordsString = response.item.A121;
                    let numberOfRecords: number = +numberOfRecordsString;
                    this.numberOfRecords = numberOfRecords;
                    let thisRecordArray = response.item.PK03.split(":");
                    let thisRecordString: string = thisRecordArray[1];
                    //let thisRecordString: string = response.item.PK03.substring(2);
                    let thisRecord: number = +thisRecordString;

                    var temp = response.item.A030;
                    var temp2 = temp.split(":");
                    this.api_name = temp2[0];
                    this.api_tran = temp2[1];

                    //this.selectedFields = [];
                    //this.selectedInput = [];

                    let stopCount = start_count + 9;
                    let fieldIDcounter = 1;
                    debugger;
                    for (var i = start_count; i < stopCount; i++) {
                        var tmp = response.item["A" + fieldIDcounter + "30"];
                        fieldIDcounter++;
                        if (tmp == undefined) {
                            break;
                        } else if (tmp == "-") {
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

                        this.fieldsInn[k] = apiInfield;
                        this.fieldMap[k] = getValueFrom;
                        this.fieldTypes[k] = fieldType;
                        this.fieldLengths[k] = fieldLength;

                        this.selectedFields[k] = apiInfield;
                        this.selectedInput[k] = getValueFrom;
                        this.selectedLabels[k] = labelText;
                        this._labelTexts[k] = labelText;//TODO
                    }

                    let tempRes = numberOfRecords - thisRecord;
                    if (tempRes > 0) {
                        debugger;
                        //get the rest of the records...
                        let nextRecord: number = thisRecord + 1;
                        let scriptKey = this.scriptKey + ":" + nextRecord;
                        let startValue = (9 * thisRecord) + 1;
                        this.run_CUSEXTMI_GetFieldValue(scriptKey, startValue);
                    } else {
                        //debugger;
                        this.run_continue();
                    }

                } else {
                    //ingen eksisterende records i CUGEX
                    //Swal.fire('Error BB', 'Could not find an existing record in cugex', 'error');

                    //alert("Error on API " + local_api_name + " / " + local_api_tran);
                    this.log.Info("function run_CUSEXTMI_GetFieldValue did not return any records (" + local_api_name + "/" + local_api_tran + ")");

                    this.open_set_API_window();
                }

            }).catch((response: IMIResponse) => {

                //ingen eksisterende records i CUGEX
                this.log.Info("an error happened in run_CUSEXTMI_GetFieldValue. Ended up in catch!");
                //this.open_set_API_window();

                this.open_set_API_window();
            });
    }


    //#endregion

    //#region Windows

  
    private open_window(title: string, width: number, height: number, html: string, button1text: string, button2text: string, button3text: string, f1: () => any, f2: () => any, f3: () => any): void {

        let _this = this;

        var buttons: any[][] = [];

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

    }


    private open_window_message(header: string, message: string, button_text: string, f1: () => any): void {
        //this.open_window(header, 200, 500, message, button_text, undefined, undefined, f1, () => { }, () => { });

        let width: number = 200;
        let height: number = 500;
        var buttons: any[][] = [];

        var button1array = [];
        button1array[0] = button_text;
        button1array[1] = f1;

        buttons[0] = button1array;

        //this.vince_modal.show(header, width, height, message, buttons);
        this.vince_modal.message(header + ": " + message);
    }

    private open_window_message_info(message: string): void {
        //this.open_window("Info!", 200, 500, message, "Ok", undefined, undefined, () => { }, () => { }, () => { });
        this.vince_modal.message(message);
    }

    private open_window_message_error(message: string): void {
        //this.open_window("Info!", 200, 500, message, "Ok", undefined, undefined, () => { }, () => { }, () => { });
        this.vince_modal.message(message);
    }

    //#endregion



    private Update_Usage_information(): void {
        this.log.Info("Store_Usage_information");

        const program = "CUSEXTMI";
        const transaction = "GetFieldValue";

        //const timeElapsed = Date.now();
        //const today = new Date(timeElapsed);

        const record = { FILE: this.FILE_USAGE, PK01: this.scriptName, PK02: this.controller.GetPanelName() };
        const outputFields = ["A130", "A230"];

        MIService.Current.execute(program, transaction, record, outputFields).then(
            (response: IMIResponse) => {

                if (response.items.length > 0) {
                    this.log.Info("Entry exists");
                    //entry excists
                    let numberOfRuns = response.item["A130"].toString();
                    //let lastRun = response.item["A230"].toString();

                    let numberOfRunsAsInteger = +numberOfRuns;
                    numberOfRunsAsInteger += 1;

                    //update information
                    this.log.Info("Update existiang_Usage_information");
                    //TODO
                    const program = "CUSEXTMI";
                    const transaction = "ChgFieldValue";

                    const timeElapsed = Date.now();
                    const today = new Date(timeElapsed);

                    const record = { FILE: this.FILE_USAGE, PK01: this.scriptName, PK02: this.controller.GetPanelName(), A130: numberOfRunsAsInteger, A230: today.toUTCString(), A330: ScriptUtil.GetUserContext("USID") };
                    const outputFields = ["FILE"];

                    MIService.Current.execute(program, transaction, record, outputFields).then(
                        (response: IMIResponse) => {

                            if (response.items.length > 0) {
                                this.log.Info("Entry Updated");
                            } else {
                                this.log.Info("Error 1!");
                            }
                        }).catch((response: IMIResponse) => {
                            this.log.Info(response.errorMessage);
                        });


                } else {


                    this.log.Info("No entry yet");

                    //create new entry
                    this.log.Info("Store_new_Usage_information");

                    const program = "CUSEXTMI";
                    const transaction = "AddFieldValue";

                    const timeElapsed = Date.now();
                    const today = new Date(timeElapsed);

                    const record = { FILE: this.FILE_USAGE, PK01: this.scriptName, PK02: this.controller.GetPanelName(), A030: today.toUTCString(), A130: "1", A230: today.toUTCString(), A330: ScriptUtil.GetUserContext("USID") };
                    const outputFields = ["FILE"];

                    MIService.Current.execute(program, transaction, record, outputFields).then(
                        (response: IMIResponse) => {

                            if (response.items.length > 0) {
                                this.log.Info("New Entry created");
                            } else {
                                this.log.Info("Error 2!");
                            }
                        }).catch((response: IMIResponse) => {
                            this.log.Info(response.errorMessage);
                        });

                }
            }).catch((response: IMIResponse) => {
                this.log.Info(response.errorMessage);
            });
    }


    public static Init(args: IScriptArgs): void {
        new Vince_Script_API_3(args).run();
    }
}
