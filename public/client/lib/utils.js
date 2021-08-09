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

    countLUNumber(str) {
        var strArr = str.split("");
        var lowerCase = [];
        var upperCase = [];

        for(let item of strArr) {
            var code = item.charCodeAt();
            if(code >= "a".charCodeAt() && code <= "z".charCodeAt()) lowerCase.push(item);
            if(code >= "A".charCodeAt() && code <= "Z".charCodeAt()) upperCase.push(item);
        }

        return {
            lowerCase: lowerCase.length,
            upperCase: upperCase.length
        };
    }
}

// Browser
if(typeof window === "object") window.nutils = new Utils();

// Node.js
if(typeof require === "function") module.exports = new Utils();
