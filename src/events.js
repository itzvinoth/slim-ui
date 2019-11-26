import Vue from "vue"

export default class Events {
    constructor () {
        this.eventBus = new Vue();
    }
    on(name, callback) {
        return this.eventBus.$on(name, callback);
    }
    emit(name, data) {
        return this.eventBus.$emit(name, data);
    }
    off(name, callback) {
        return this.eventBus.$off(name, callback);
    }
}

