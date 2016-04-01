'use strict';

define(['JSSM'], function(JSSM){

    var App = function(){

        this.fsm = new JSSM({
            transitions : [
                { name : 'init', from : 'none'   , to : 'default' },
                { name : 'show', from : 'default', to : 'shown'   },
                { name : 'hide', from : 'shown'  , to : 'default' }
            ],
            actions : {
                init : init,
                show : show,
                hide : hide,
            },
            context : this
        });

        function init(/*obj*/info){ console.log(info); }
        function show(/*obj*/info){ console.log(info); }
        function hide(/*obj*/info){ console.log(info); }

    };

    return App;

});