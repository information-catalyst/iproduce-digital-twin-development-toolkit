
const Cursor = require("diagram-js/lib/util/Cursor");

const MARKER_OK = "connect-ok",
    MARKER_NOT_OK = "connect-not-ok";

const SPACE_TOOL_CURSOR = "crosshair";

GlobalDelete.$inject = ["eventBus", "rules", "canvas", "modeling", "toolManager"];
function GlobalDelete(eventBus, rules, canvas, modeling, toolManager) {
    const self = this;

    this._active = false;
    this._rules = rules;

    toolManager.registerTool("global-delete", {
        tool: "global-delete"
    });


    eventBus.on(["tool-manager.update"], function(event) {
        if (self._active && event.tool !== "global-delete") {
            self.toggle();
        }
    });

    eventBus.on(["element.mousedown"], 1500, function (event) {

        if (!self._active) {
            return;
        }

        const element = event.element;

        if (element === canvas.getRootElement() || !self.canDelete(element)) {
            self.toggle();
            return;
        }

        modeling.removeElements([element]);
        event.stopPropagation();
        event.preventDefault();

    });
}


/**
 * Initiates tool activity.
 */
GlobalDelete.prototype.start = function (event) {
    this._active = true;
    Cursor.set(SPACE_TOOL_CURSOR);
};


GlobalDelete.prototype.toggle = function () {
    if (this._active) {
        this._active = false;
        Cursor.unset();
    } else {
        this.start();
    }
};

GlobalDelete.prototype.isActive = function () {
    return this._active;
};


/**
 * Checks if given element can be used for starting connection.
 *
 * @param  {Element} source
 * @return {Boolean}
 */
GlobalDelete.prototype.canDelete = function(source) {
    return this._rules.allowed("elements.delete", { elements: [source] });
};


module.exports = {
    __depends__: [
        // require("diagram-js/lib/features/dragging"),
        require("diagram-js/lib/features/tool-manager")
    ],
    globalDelete: ["type", GlobalDelete]
};

