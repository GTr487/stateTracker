(function($){
    $.fn.StateTracker = function(options){
        const regExp = /^#([0-9a-f]{3}){1,2}$/i;

        var defaults = {
            stages: [
                {
                    name: "stage 1",
                    state: "Verify"
                },{
                    name: "stage 2",
                    state: "Canceled"
                },{
                    name: "stage 3",
                    state: "Pending"
                },{
                    name: "stage 4",
                    state: "Canceled"
                }
            ],
            states: [
                {
                    name: "Verify",
                    color: "#107c10",
                    icon: "ms-Icon ms-Icon--CheckMark"
                },{
                    name: "Canceled",
                    color: "#f00",
                    icon: "ms-Icon ms-Icon--Cancel"
                },{
                    name: "Pending",
                    color: "#222",
                    icon: "ms-Icon ms-Icon--Help"
                },
            ],
            colors: {
                title: '#000000',
                icon: '#000000',
                arrow: '#000000',
                bgIcon: 'transparent',
                bdIcon: 'transparent'
            }
        }

        var settings = $.extend({}, defaults, options);


        /**
         * Create default CSS Class in the html DOM
         * @param {String} [titleColor='#000000'] Color of the title
         * @param {String} [IconColor='#000000']  Color of the Icon
         * @param {String} [arrowColor='#000000'] Color of the arrows
         * @param {String} [backIconColor='#FFFFFF'] Color of the Icon Background
         * @param {String} [borderIconColor='#EEEEEE'] Color of the border of the icon container
         */
        var setDefaultClasses = function(titleColor, IconColor, arrowColor, backIconColor, borderIconColor){
            if(!regExp.test(titleColor))      titleColor      = '#000000';
            if(!regExp.test(IconColor))       IconColor       = '#000000';
            if(!regExp.test(arrowColor))      arrowColor      = '#000000';
            if(!regExp.test(backIconColor))   backIconColor   = 'transparent';
            if(!regExp.test(borderIconColor)) borderIconColor = 'transparent';
            
            borderIconColor
            $('<style></style>')
                .prop('type', 'text/css')
                .html('\
                .stTracker{                                  \
                    overflow: auto;                          \
                    font-size: 16px;                         \
                }                                            \
                .stTracker__cont{                            \
                    padding: .5em;                           \
                    display: flex;                           \
                }                                            \
                .stTracker__stage{                           \
                    text-align: center;                      \
                }                                            \
                .stTracker__icon{                            \
                    color: ' +IconColor+ ';                  \
                    font-size: 2em;                          \
                    background: ' +backIconColor+ ';         \
                    border: 1px solid ' +borderIconColor+ '; \
                    display: flex;                           \
                    justify-content: center;                 \
                    align-items: center;                     \
                    padding: .5em;                           \
                    border-radius: 50%;                      \
                }                                            \
                .stTracker__icon i{                          \
                    width:1em;                               \
                    height: 1em;                             \
                }                                            \
                .stTracker__title{                           \
                    margin-top: .5em;                        \
                    color: ' +titleColor+ ';                 \
                }                                            \
                .stTracker__arrow{                           \
                    display: flex;                           \
                    align-items: center;                     \
                    padding-bottom: 1.5em;                   \
                    margin: 0 2em 0 1.5em;                   \
                }                                            \
                .stTracker__arrow span{                      \
                    display: inline-block;                   \
                    padding: .5em;                           \
                    border: solid ' +arrowColor+ ';          \
                    border-width: 0 3px 3px 0;               \
                    transform: rotate(-45deg);               \
                }                                            \
                ').appendTo('head');
        }

        setDefaultClasses('titleColor', 'IconColor', 'arrowColor', '#fff', '#eee');

        /**
         * Create class to a state
         * @param {String} className Class Name of State
         * @param {String} [color='#000000'] color of State icon
         */
        var createIconStateClass = function(className, color){
            if(!regExp.test(color)) color = '#000000';
            if(className.length < 1) throw "ClassName Empty";
            className = getSlashedNames(className);
            ///////SOLUCIONAR ESTO
            $('head').append('\
                            <style>\
                            .stTracker__icon--' +className+ '{ color: ' +color+ '; }\
                            </style>');
            console.log('.stTracker__icon--' +className+ '{ color: ' +color+ '; }')
        }

        /**
         * Get a string and return a string with '-' format
         * @param {string} text string to be formatted
         * @param {Boolean} bottomSlash 
         * @return {string} formated string
         */
        var getSlashedNames = function(text, bottomSlash){
            if(!text) return;
            var rgEx = /[^A-Z0-9\_\-]+/ig
            if(bottomSlash) text = text.replace(/\s+/g,'_');
            else text = text.replace(/\s+/g,'-');
            return text.replace(rgEx, '');
        }

        /**
         * Create a Stage with name and state
         * @param {String} name Name of stage
         * @param {String} state name of an existing State
         * @return {object} jQuery Object
         */
        $.fn.StateTracker.createStage = function(name, state){
            if(!name) return;
            var idStg = (getSlashedNames(name)) ? 'id="' +getSlashedNames(name)+ '"' : "";
            var stage = $('<div '+idStg+ '></div>').addClass('stTracker__stage');
            stage.prop('state', state)
            $('<div></div>').addClass('stTracker__icon')
                            .append('<i></i>')
                            .appendTo(stage);
            $('<div></div>').addClass('stTracker__title')
                            .append($('<p></p>').html(name))
                            .appendTo(stage);
            return stage;
        }

        $.fn.StateTracker.createArrow = function(){
            return $('<div></div>').addClass('stTracker__arrow')
                                   .append('<span></span>');
        }

        this.each(function(){
            var self = this;
            $(self).empty()
                   .addClass('stTracker')
                   .prop('stages', {})
                   .prop('states', {});
            var cont = $('<div></div>').addClass('stTracker__cont').appendTo(this);

            if(Array.isArray(settings.states)){
                settings.states.forEach(function(state){
                    self.states[getSlashedNames(state.name)] = {
                        name: state.name,
                        color: state.color,
                        icon: state.icon,
                    };
                });
            }

            if(Array.isArray(settings.stages)){
                settings.stages.forEach(function(stage){
                    self.stages[getSlashedNames(stage.name, true)] = {
                        name: stage.name,
                        state: stage.state
                    };
                });
            }

            self.load = function(){
                self.loadStages();
                self.loadStates();
            }

            self.loadStages = function(){
                $(cont).empty()
                var keys = Object.keys(self.stages);
                keys.forEach(function(name, index){
                    var stage = self.stages[name];
                    var state = self.states[getSlashedNames(stage.state)];
                    $.fn.StateTracker.createStage(stage.name, state).appendTo(cont);
                    if((index +1) < keys.length)
                        $.fn.StateTracker.createArrow().appendTo(cont);
                });
            };

            self.loadStates = function(){
                var keys = Object.keys(self.states);
                keys.forEach(function(name, index){
                    var state = self.states[name];
                    createIconStateClass(state.name, state.color);
                });
                var stages = $('.stTracker__stage').toArray();
                if(Array.isArray(stages)){
                    stages.forEach(function(stage, ind){
                        $(stage).children('.stTracker__icon').addClass('.stTracker__icon--' +getSlashedNames(stage.state.name))
                                .children('i').addClass(stage.state.icon);
                    });
                }
            }

            self.load();
        });

    };
}(jQuery));


$(document).ready(function(){
    $("#gg").StateTracker();
});
