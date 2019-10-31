import {RectangularBinner} from "./modules/rectangularbin";

if (!window) {
    window = self;
}
(function (window) {
    window.scagnosticsml = function(){
        let thisInstance = this;
        return thisInstance;

        function output(key, value){
            this[key] = value;
        }
    }
})(window);