var Vince_Modal = /** @class */ (function () {
    function Vince_Modal(modalID, panelName, scriptKey) {
        this.version = "1.4";
        this.color_teal = "#43A5BE";
        //alert("new class");
        this.modalPrefix = modalID + "_" + panelName + "_" + scriptKey;
        this.modal_counter = Math.floor(Math.random() * 1000);
        this.modalID = this.modalPrefix + "_" + this.modal_counter.toString();
        this.append_css();
    }
    Vince_Modal.prototype.cleanUp = function () {
        //remove old elemnt and add new
        $("#" + this.modalID).remove();
        this.modal_counter += 1;
        //generate new ID
        this.modalID = this.modalPrefix + "_" + this.modal_counter.toString();
    };
    Vince_Modal.prototype.generateNewID = function () {
        this.modal_counter += 1;
        this.modalID = this.modalPrefix + "_" + this.modal_counter;
    };
    Vince_Modal.prototype.removeOldModal = function (modalID) {
        $("#" + modalID).remove();
    };
    Vince_Modal.prototype.show = function (title, width, height, htmlContent, buttons) {
        /*public show(title: string, width: string, height: string, htmlContent: string): void {*/
        //remove any old modals
        //$(`.${this.modalPrefix}`).remove();
        //this.cleanUp();
        this.generateNewID();
        var modalBodyHeight = height;
        var closeButtonID = this.modalID + "_close";
        //<span class="my-close" id="${closeButtonID}">&times;</span >
        var modalInnerHtml = "\n        <!-- Modal content -->\n        <div class=\"my-modal-content\" style=\"max-width:".concat(width, "px;max-height:").concat(height, "px; display: flex; flex-direction: column; justify-content: space-between;\">\n        \n        <!-- Modal Header -->\n        <div class=\"my-header\">\n            <h1>").concat(title, "</h1>\n            <span class=\"my-close\" id=\"").concat(closeButtonID, "\">&times;</span>\n        </div>\n\n        <!-- Modal body -->\n        <div class=\"myModalBody\" style=\"flex-grow: 1; overflow-y: auto; max-height:").concat(modalBodyHeight, "px;\">\n            ").concat(htmlContent, "\n        </div>\n\n        <!-- Buttons -->\n        <div class=\"my-modal-buttons\" style=\"margin-top: 10px; margin-bottom: 20px; text-align: center;\">\n");
        for (var i = 0; i < buttons.length; i++) {
            var buttonID = this.modalID + "_button".concat(i);
            modalInnerHtml += "<button class=\"my-button\" id=\"".concat(buttonID, "\">").concat(buttons[i][0], "</button>");
        }
        modalInnerHtml += "\n        </div>\n\n        <!-- Vince footer -->\n        <div style=\"text-align:center; margin:10px 0 0 0; font-size:12px;\">\n            <a href=\"https://vincesoftware.com/services\" target=\"_blank\" style=\"text-decoration:none; color:#FF7A18;\">Powered by Vince</a>\n        </div>\n    </div>\n";
        var modalHtml = "<div id=\"".concat(this.modalID, "\" class=\"my-modal ").concat(this.modalPrefix, "\">").concat(modalInnerHtml, "</div>");
        //'<label style="margin-right:5px;">powered by</label><img src="https://www.jobreg.no/images/logos/300822104412_71308_fd39cfe9016e4ee14be1a8010ea19bf1c2a1b8466f86c0e062ce5802bbe7d54f4e3202839a0021f18757c7ba3b9c38701b.jpg" alt="alternatetext" style="width:60px;height:20px;">'
        // Append modal HTML to the body
        $('body').append(modalHtml);
        var currentModalID = this.modalID;
        $("#".concat(closeButtonID)).on('click', function () {
            $("#".concat(currentModalID)).hide();
            $("#".concat(currentModalID)).remove();
        });
        $(window).on('click', function (event) {
            if (event.target === $("#".concat(currentModalID))[0]) {
                $("#".concat(currentModalID)).hide();
                $("#".concat(currentModalID)).remove();
            }
        });
        var _loop_1 = function (i) {
            var buttonID = currentModalID + "_button".concat(i);
            $("#".concat(buttonID)).on('click', function () {
                $("#".concat(currentModalID)).hide();
                buttons[i][1]();
                $("#".concat(currentModalID)).remove(); //If this is removed before the function is executed, you will not have access to whatever was on the screen
                //if it is removed after it will potentiallynot be removed if anything goes wrong in the execution, or MORE importantly, it is still there if you try to create a new modal...
                //best solution is to temporary store whats in the screen
                //Or present two button functions, one to store data, and one to be executed after the modal is removed...
                //perhaps not remove the modal everytime but hide them and create new IDs for the new ones???
                //then i need unique IDs and classed => this can be a running number that resets when??? when do you cleanup?
                //a separatefunction for cleanup?
                //OR
                //Can you simply double chack that any old modals are removed before you try to create a new one?
            });
        };
        for (var i = 0; i < buttons.length; i++) {
            _loop_1(i);
        }
        $(".my-close").attr('title', 'Vince Modal ' + this.version);
        //show the modal
        $("#".concat(currentModalID)).show();
    };
    Vince_Modal.prototype.append_css = function () {
        //var modalBodyHeight: number = modal_height - 130;
        // Add styles dynamically (or include them in a separate CSS file)
        $('head').append('<style>' +
            'body { font-family: Arial, sans-serif; }' +
            '.my-modal { display: none;  z-index: 10000; opacity:1; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.1); }' +
            ".my-modal-content { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 10px; border-radius: 5px; text-align: center; }" +
            ".myModalBody {overflow:auto; padding: 10px;margin-bottom:36px;}" +
            ".my-header {color:#3A3B3C; padding: 0px; display:flex; justify-content: space-between; align-items:center}" +
            '.my-close { color: #aaa; float: right; font-size: 40px; font-weight: bold; cursor: pointer;}' +
            '.my-close:hover, .my-close:focus { color: black; }' +
            ".my-button {margin-left:5px; margin-right:5px; padding:10px; background-color:".concat(this.color_teal, "; width:130px; color:#fff; border:none; border-radius:5px;cursor:pointer;}") +
            '.my-modal-buttons {display:flex; justify-content:center; position: absolute; bottom:0; left:0; right:0; padding:10px; flex-direction: row; align-items:center;}' +
            '</style>');
    };
    //Have added margin on buttons when working with BA
    //Havealso changed color of my header to grey (was white for some reason)
    Vince_Modal.prototype.message = function (message) {
        var ok_clicked = function () {
            //NOP
        };
        var button1array = ["Ok", ok_clicked];
        var buttons = [];
        buttons[0] = button1array;
        var html = "<h2>".concat(message, "</h2>");
        this.show("Info!", 350, 300, html, buttons);
    };
    return Vince_Modal;
}());
//# sourceMappingURL=Vince_Modal.js.map