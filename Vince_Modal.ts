class Vince_Modal {

    private version: string = "1.5";

    private modalPrefix: string;
    private modalID: string;
    private color_teal = "#43A5BE";
    private modal_counter;

    constructor(modalID: string, panelName: string, scriptKey: string) {
        //alert("new class");
        this.modalPrefix = modalID + "_" + panelName + "_" + scriptKey;
        this.modal_counter = Math.floor(Math.random() * 1000);
        this.modalID = this.modalPrefix + "_" + this.modal_counter.toString();
        this.append_css();        
    }

    private cleanUp(): void {
        //remove old elemnt and add new

        $("#" + this.modalID).remove();
        this.modal_counter += 1;
        //generate new ID
        this.modalID = this.modalPrefix + "_" + this.modal_counter.toString();
    }

    private generateNewID() {
        this.modal_counter += 1;
        this.modalID = this.modalPrefix + "_" + this.modal_counter;
    }

    private removeOldModal(modalID: string) {
        $("#" + modalID).remove();
    }

    public show(title: string, width: number, height: number, htmlContent: string, buttons: any[][]): void {
        /*public show(title: string, width: string, height: string, htmlContent: string): void {*/

        //remove any old modals
        //$(`.${this.modalPrefix}`).remove();

        //this.cleanUp();
        this.generateNewID();

        var modalBodyHeight:number = height;
        var closeButtonID = this.modalID + "_close";
        //<span class="my-close" id="${closeButtonID}">&times;</span >
        var modalInnerHtml = `
        <!-- Modal content -->
        <div class="my-modal-content" style="max-width:${width}px;max-height:${height}px; display: flex; flex-direction: column; justify-content: space-between;">
        
        <!-- Modal Header -->
        <div class="my-header">
            <h1>${title}</h1>
            <span class="my-close" id="${closeButtonID}">&times;</span>
        </div>

        <!-- Modal body -->
        <div class="myModalBody" style="flex-grow: 1; overflow-y: auto; max-height:${modalBodyHeight}px;">
            ${htmlContent}
        </div>

        <!-- Buttons -->
        <div class="my-modal-buttons" style="margin-top: 10px; margin-bottom: 20px; text-align: center;">
`;

        for (let i = 0; i < buttons.length; i++) {
            let buttonID = this.modalID + `_button${i}`;
            modalInnerHtml += `<button class="my-button" id="${buttonID}">${buttons[i][0]}</button>`;
        }

        modalInnerHtml += `
        </div>

        <!-- Vince footer -->
        <div style="text-align:center; margin:10px 0 0 0; font-size:12px;">
            <a href="https://vincesoftware.com/services" target="_blank" style="text-decoration:none; color:#FF7A18;">Powered by Vince</a>
        </div>
    </div>
`;

        let modalHtml = `<div id="${this.modalID}" class="my-modal ${this.modalPrefix}">${modalInnerHtml}</div>`;

        //'<label style="margin-right:5px;">powered by</label><img src="https://www.jobreg.no/images/logos/300822104412_71308_fd39cfe9016e4ee14be1a8010ea19bf1c2a1b8466f86c0e062ce5802bbe7d54f4e3202839a0021f18757c7ba3b9c38701b.jpg" alt="alternatetext" style="width:60px;height:20px;">'

        // Append modal HTML to the body
        $('body').append(modalHtml);

        let currentModalID = this.modalID;

        $(`#${closeButtonID}`).on('click', () => {
            $(`#${currentModalID}`).hide();
            $(`#${currentModalID}`).remove();
        });

        $(window).on('click', (event) => {
            if (event.target === $(`#${currentModalID}`)[0]) {
                $(`#${currentModalID}`).hide();
                $(`#${currentModalID}`).remove();
            }
        });

        for (let i = 0; i < buttons.length; i++) {
            let buttonID = currentModalID + `_button${i}`;
            $(`#${buttonID}`).on('click', () => {
                $(`#${currentModalID}`).hide();
                buttons[i][1]();
                $(`#${currentModalID}`).remove();//If this is removed before the function is executed, you will not have access to whatever was on the screen
                //if it is removed after it will potentiallynot be removed if anything goes wrong in the execution, or MORE importantly, it is still there if you try to create a new modal...
                //best solution is to temporary store whats in the screen
                //Or present two button functions, one to store data, and one to be executed after the modal is removed...
                //perhaps not remove the modal everytime but hide them and create new IDs for the new ones???
                //then i need unique IDs and classed => this can be a running number that resets when??? when do you cleanup?
                //a separatefunction for cleanup?
                //OR
                //Can you simply double chack that any old modals are removed before you try to create a new one?
            });
        }

        $(".my-close").attr('title', 'Vince Modal ' + this.version);

        //show the modal
        $(`#${currentModalID}`).show();

    }

    private append_css(): void {

        //var modalBodyHeight: number = modal_height - 130;
        // Add styles dynamically (or include them in a separate CSS file)
        $('head').append('<style>' +
            'body { font-family: Arial, sans-serif; }' +
            '.my-modal { display: none;  z-index: 10000; opacity:1; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.1); }' +
            `.my-modal-content { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 10px; border-radius: 5px; text-align: center; }` +
            `.myModalBody {overflow:auto; padding: 10px;margin-bottom:36px;}` +
            `.my-header {color:#3A3B3C; padding: 0px; display:flex; justify-content: space-between; align-items:center}` +
            '.my-close { color: #aaa; float: right; font-size: 40px; font-weight: bold; cursor: pointer;}' +
            '.my-close:hover, .my-close:focus { color: black; }' +
            `.my-button {margin-left:5px; margin-right:5px; padding:10px; background-color:${this.color_teal}; width:130px; color:#fff; border:none; border-radius:5px;cursor:pointer;}` +
            '.my-modal-buttons {display:flex; justify-content:center; position: absolute; bottom:0; left:0; right:0; padding:10px; flex-direction: row; align-items:center;}' +
            '</style>');
    }

    //Have added margin on buttons when working with BA
    //Havealso changed color of my header to grey (was white for some reason)

    public message(message: string): void {

        let ok_clicked = () => {
            //NOP
        };

        let button1array = ["Ok", ok_clicked];
        let buttons: any[][] = [];
        buttons[0] = button1array;

        let html = `<h2>${message}</h2>`;

        this.show("Info!",350, 300, html, buttons);

    }

    //public message_OLD(message:string): void {

    //    //var modalBodyHeight = height - 130;
    //    //this.cleanUp();
    //    this.generateNewID();

    //    var width: number = 250;
    //    var height: number = 150;
    //    var modalBodyHeigh: number = 200;

    //    var okButtonID = this.modalID + "_ok_button";
    //    var messageBoxID = this.modalID + "_message";
    //    //<span class="my-close" id="${closeButtonID}">&times;</span >
    //    var modalInnerHtml = `
    //        <!-- Modal content -->
    //        <div class="my-modal-content">
                               

    //            <!-- Modal body -->
    //            <div class="myModalBody"><h2>${message}</h2></div>

    //            <!-- Buttons -->
    //            <div class="my-modal-buttons">

    //            <button class="my-button" id="${okButtonID}">Ok</button>

    //            </div>
    //            </div>
    //            `;


    //    // Create modal elements dynamically
    //    let modalHtml = `<div id="${messageBoxID}" class="my-modal">${modalInnerHtml}</div>`;

    //    // Append modal HTML to the body
    //    $('body').append(modalHtml);

    //    $(`#${okButtonID}`).on('click', () => {
    //        $(`#${messageBoxID}`).hide();
    //        $(`#${messageBoxID}`).remove();
    //    });

    //    $(window).on('click', (event) => {
    //        if (event.target === $(`#${messageBoxID}`)[0]) {
    //            $(`#${messageBoxID}`).hide();
    //            $(`#${messageBoxID}`).remove();
    //        }
    //    });

    //    $(".my-close").attr('title', 'Vince Modal ' + this.version);

    //    $(`#${messageBoxID}`).show();
        
    //}



}