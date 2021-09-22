/* eslint-disable eqeqeq */
class Utils {
    arrayItemDelete(arr, item) {
        if(item == undefined) return arr;

        for(let i in arr) {
            if(typeof arr[i] == "object" && typeof item == "object") {
                if(this.objectsCompare(arr[i], item)) {
                    arr[i] = undefined;
                    continue;
                }
            }
            
            if(arr[i] == item) {
                arr[i] = undefined;
            }
        }

        var newarr = [];
        for(let i in arr) {
            if(arr[i] != undefined) {
                newarr.push(arr[i]);
            }
        }

        return newarr;
    }

    objectsCompare(obj1, obj2) {
        if(!(typeof obj1 === "object" && typeof obj2 === "object")) return false;
        if(this.objectLength(obj1) != this.objectLength(obj2)) return false;

        var isEqual = true;

        for(let i in obj1) {
            if(typeof obj1[i] == "object" && typeof obj2[i] == "object") {
                if(!this.objectsCompare(obj1[i], obj2[i])) isEqual = false;
                continue;
            }

            if(obj1[i] != obj2[i]) isEqual = false;
        }

        return isEqual;
    }

    objectLength(obj) {
        if(typeof obj !== "object") return 0;

        var length = 0;
        
        for(let i in obj) {
            length++;
        }

        return length;
    }

    countWordsNumber(str) {
        var strArr = str.split("");
        var lowerCase = 0;
        var upperCase = 0;
        var numbers = 0;
        var underline = 0;

        for(let item of strArr) {
            var code = item.charCodeAt();
            if(code >= "a".charCodeAt() && code <= "z".charCodeAt()) lowerCase++;
            if(code >= "A".charCodeAt() && code <= "Z".charCodeAt()) upperCase++;
            if(code >= "0".charCodeAt() && code <= "9".charCodeAt()) numbers++;
            if(item == "_") underline++;
        }

        return {
            lowerCase: lowerCase,
            upperCase: upperCase,
            numbers: numbers,
            underline: underline
        };
    }

    bindKeyListener(keyName, isCtrl, isPD, callback) {
        document.body.addEventListener("keydown", (e) => {
            if(isCtrl) {
                if(e.ctrlKey && e.key == keyName) {
                    if(isPD) {
                        e.preventDefault();
                    }
                    callback();
                }
            } else {
                if(e.key == keyName) {
                    if(isPD) {
                        e.preventDefault();
                    }
                    callback();
                }
            }
        });
    }
}

// Browser
if(typeof window === "object") window.nutils = new Utils();

// Node.js
if(typeof require === "function") module.exports = new Utils();
