import {request} from  "./utils";
import component from "./items"
class Manager {
    constructor (props) {
        this.props = props;
    }

    init () {
        this.appendData();
        this.detectReachBottom(() => {
            this.appendData();
        });
    }

    appendData () {
        request("/list").then(res => {
            const items = res.data;
            for(let item of items){
                const componentName = item.type.replace(/^\w/,w => w.toUpperCase());
                const com = new component[componentName](item);
                const $el = com.createElement();
                this.props.append($el);
            }
        });
    }

    detectReachBottom(callback = () => {}) {

        window.onscroll = () => {
            const THRESHOLD = 50;
            const offsetHeight = document.documentElement.offsetHeight;
            const screenHeight = window.screen.height;
            const scrollY = window.scrollY;
            const gap = offsetHeight - screenHeight - scrollY;
            console.log(gap);
            console.log(callback);
            if (gap < THRESHOLD) {
                callback();
            }

        };

    }



    getInstance ($container) {
        return new Manager($container);
    }
}
let $container = document.getElementById("container");
let manager = new Manager($container);
manager.init();