(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.returnExports = factory();
    }
}(this, function(){

    var JSSM = function(/*obj*/description){
        'use strict';

        this._current  = 'none';
        this._previous = 'none';

        var _settings = {
            log : true,
            strict : false,
            history : false
        }

        //Main checkings
        if (this.is().object(description) === false){
            this.log.error(0, description, true);
            return false;
        }

        if (this.is().object(description._settings)){
            _settings.log    = this.is().boolean(description._settings.log)    ? description._settings.log    : true;
            _settings.strict = this.is().boolean(description._settings.strict) ? description._settings.strict : false;
        }

        this.log.enabled = _settings.log;

        if (!this.is().array(description.transitions)){
            this.log.error(1, description.transitions, true);
            return false;
        } else {
            _settings.transitions = description.transitions;
        }

        if (!this.is().object(description.actions)){
            this.log.error(2, description.actions, true);
            return false;
        }

        if (!this.is().object(description.context)){
            description.context = {};
        }

        //getProtectedCopy _settings object;
        Object.defineProperty(this, '_settings', {
            value : this.getProtectedCopy(_settings),
            writable : false
        });

        var ev;

        //Creating callbacks
        for (var a = 0; a < description.transitions.length; a++){
            if (this.isCorrectTransition(description.transitions[a], description.actions)){

                ev = this.createEvent(description.transitions[a], description.actions[description.transitions[a].name], description.context);

                if (this.is().function(ev)){

                    Object.defineProperty(this, description.transitions[a].name, {
                        value : ev,
                        writable : false
                    });

                }
                
            }
        }

    };

    JSSM.prototype = {
        createEvent : function(/*obj*/transition, /*obj*/callback, /*obj || undef*/context){

            var ev;

            if (!this.is().function(callback)){
                callback = function(){};
            } 

            ev = function(){

                var transitionInfo,
                    args;

                if (this.can(transition.name)){
                    
                    transitionInfo = {
                        name : transition.name,
                        from : this._current,
                        to : transition.to
                    };

                    args = Array.prototype.slice.call(arguments);
                    args.unshift(transitionInfo);

                    callback.apply(context, args);

                    this._previous = this._current;
                    this._current = transition.to;

                    return this;

                } else {
                    
                    if (this._settings.strict === true){
                        this.log.error(6, {
                            name : transition.name,
                            from : this._current,
                        })
                    } else {
                        return this;
                    }

                }

            }.bind(this);

            if (transition.from === 'none'){
                ev();
            } else {
                return ev;
            }
        },
        can : function(/*str*/name){
            for (var a = 0; a < this._settings.transitions.length; a++){
                if (this._settings.transitions[a].name === name){
                    return (this._settings.transitions[a].from === this._current || this._settings.transitions[a].from.indexOf(this._current) > -1);
                }
            }
        },
        cannot : function(/*str*/name){
            return !this.can(name);
        },
        current : function(){
            return this._current;
        },
        isCorrectTransition : function(/*obj*/description, /*func*/actions){
            'use strict';

            if (!this.is().object(description)){
                this.log.error(3, description, true);
                return false;
            }

            if (!this.is().string(description.name) || !(this.is().string(description.from) || this.is().array(description.from)) || !this.is().string(description.to)){
                this.log.error(4, description, true);
                return false;
            }

            if (!this.isAllowedName(description.name)){
                this.log.error(7, description.name, true);
                return false;
            }

            if (!this.is().function(actions[description.name])){
                this.log.warn(5, description.name, true);
            }

            return true;

        },
        isAllowedName : function(/*str*/name){
            return [
                'createEvent',
                'can',
                'isAllowedName',
                'isCorrectTransition',
                'is',
                'log',
                'getProtectedCopy',
                '_settings',
                '_current',
                'current',
                'cannot'
            ].indexOf(name) < 0;
        },
        getProtectedCopy : function(/*obj*/obj){
            'use strict';

            var result = {};

            var apply = function(/*obj*/result, /*obj*/obj){

                var type;

                for (var k in obj){

                    if (this.is().primitive(obj[k])){
                        Object.defineProperty(result, k, {
                            value : obj[k],
                            writable : false
                        });
                    } else {

                        type = this.is(obj[k]);

                        Object.defineProperty(result, k, {
                            value : (function(){

                                switch(type){
                                    case 'object':
                                        return {};
                                    break;
                                    case 'array':
                                        return [];
                                    break;
                                    case 'function':
                                        return obj[k];
                                    break;
                                }

                            })(),
                            writable : false,
                        });

                        if (type !== 'function'){
                            apply(result[k], obj[k]);
                        }  
                    }
                }

            }.bind(this);

            apply(result, obj);

            return result;

        },
        is : function (something){
            'use strict';

            var primitiveTypes = [
                '[object Number]',
                '[object String]',
                '[object Undefined]',
                '[object Null]',
                '[object Boolean]'
            ];

            var toString = function(something){
                return Object.prototype.toString.call(something);
            };

            var checkers = {
                    array : function(something){
                        return toString(something) === '[object Array]';
                    },
                    object : function(something){
                        return toString(something) === '[object Object]';
                    },
                    number : function(something){
                        return toString(something) === '[object Number]';
                    },
                    string : function(something){
                        return toString(something) === '[object String]';
                    },
                    undefined : function(something){
                        return toString(something) === '[object Undefined]';
                    },
                    null : function(something){
                        return toString(something) === '[object Null]';
                    },
                    function : function(something){
                        return toString(something) === '[object Function]';
                    },
                    boolean : function(something){
                        return toString(something) === '[object Boolean]';
                    },
                    primitive : function(something){
                        return primitiveTypes.indexOf(toString(something)) > -1;
                    }
                };

            if (checkers.undefined(something)){
                return checkers;
            } else {
                for (var k in checkers){
                    if (checkers[k](something)){
                        return k;
                    }
                }
            }
        },
        log : {
            enabled : true,
            codes : [
                'Description must be an object not the:',
                'Transitions must be described as array not the:',
                'Actions must be contained in object not in the:',
                'Transition must be described as an object not the:',
                'Incorrect transition: "name" must be a string, "from" must be a string or an array and "to" must be a string.',
                'No action specified for event named: ',
                'Transition is not possible: ',
                'Not allowed name for event: '
            ],
            error : function(/*num*/code, /*smthg*/data, /*bool*/alwaysShow){
                if (this.enabled || alwaysShow){
                    console.error('Error.', this.codes[code], data);
                }
            },
            warn : function(/*num*/code, /*smthg*/data, /*bool*/alwaysShow){
                if (this.enabled || alwaysShow){
                    console.warn('Warning.', this.codes[code], data);
                }
            }
        },
    };

    return JSSM;

}));