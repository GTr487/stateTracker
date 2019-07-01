(function($){
    $.fn.StateTracker = function(options){
        const regExp = /^#([0-9a-f]{3}){1,2}$/i;

        var defaults = {
            stages: [
                {
                    name: "stage 1",
                    state: "Pending",
                    index: "0"
                }
            ],
            states: [
                {
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
                    font-size: 16px;                         \
                }                                            \
                .stTracker__cont{                            \
                    padding: .5em;                           \
                    display: flex;                           \
                    flex-wrap: wrap;                         \
                }                                            \
                .stTracker__box{                             \
                    display: flex;                           \
                    margin-top: 1em;                         \
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
                }                                            \
                .arrow--U span{                              \
                    transform: rotate(-135deg);              \
                }                                            \
                .arrow--R span{                              \
                    transform: rotate(-45deg);               \
                }                                            \
                .arrow--D span{                              \
                    transform: rotate(45deg);                \
                }                                            \
                .arrow--L span{                              \
                    transform: rotate(135deg);               \
                }                                            \
                ').appendTo('head');
        }

        setDefaultClasses('titleColor', 'IconColor', 'arrowColor', '#fff', '#eee');

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
        $.fn.StateTracker.createStage = function(name, state, index){
            if(!name) return;
            var idStg = (getSlashedNames(name)) ? 'id="' +getSlashedNames(name)+ '"' : "";
            var stage = $('<div data-index="' +index+ '" '+idStg+ '></div>').addClass('stTracker__stage');
            stage.prop('state', state)
            $('<div></div>').addClass('stTracker__icon')
                            .append('<i></i>')
                            .appendTo(stage);
            $('<div></div>').addClass('stTracker__title')
                            .append($('<p></p>').html(name))
                            .appendTo(stage);
            return stage;
        }

        $.fn.StateTracker.createArrow = function(direction){
            if(direction != 'U' && direction != 'R' && direction != 'D' && direction != 'L') return;
            return $('<div></div>').addClass('stTracker__arrow arrow--' +direction)
                                   .append('<span></span>');
        }

        this.each(function(){
            var self = this;
            $(self).empty()
                   .addClass('stTracker')
                   .prop('stages', {})
                   .prop('states', {});
            var cont = $('<div></div>').addClass('stTracker__cont').appendTo(this);

            /**
             * @typedef {Object} Stage
             * @property {String} name name of Stage
             * @property {String} state name of init state of stage
             * @property {String} index index of stage
             */
            /**
             * Add stage to stageTracker
             * @param {Stage} stage Stage object to add
             */
            self.addStage = function(stage){
                self.stages[getSlashedNames(stage.name, true)] = {
                    name: stage.name,
                    state: stage.state,
                    index: stage.index
                };
            }

            /**
             * Remove stage
             * @param {String} stage stage to remove
             */
            self.removeStage = function(stage){
                delete self.stages[stage];
            }

            /**
             * @typedef {Object} State
             * @property {String} name name of State
             * @property {String} color color of state icon
             * @property {String} icon icon class to state
             */
            /**
             * Add stage to stageTracker
             * @param {State} state State object to add
             */
            self.addState = function(state){
                self.states[getSlashedNames(state.name)] = {
                    name: state.name,
                    color: state.color,
                    icon: state.icon,
                };
            }

            /**
             * Remove state
             * @param {String} state state to remove
             */
            self.removeState = function(state){
                delete self.states[state];
            }

            /**
             * Set state to stage and reload
             * @param {String} stage Stage to change
             * @param {String} state State to set
             */
            self.setState = function(stage, state){
                self.stages[stage].state = self.states[state].name
            }

            /**
             * Set Index to stage and reload
             * @param {String} stage Stage to change
             * @param {Number} index Index to sort
             */
            self.setIndex = function(stage, index){
                self.stages[stage].index = index;
            }

            /**
             * load or reload all content
             */
            self.load = function(){
                self.loadStages();
                self.loadStates();
            }

            /**
             * load or reload stages
             */
            self.loadStages = function(){
                $(cont).empty()
                var keys = Object.keys(self.stages);
                keys.sort(function(a, b){ return self.stages[a].index - self.stages[b].index; });
                keys.forEach(function(name, index){
                    var stage = self.stages[name];
                    var state = self.states[getSlashedNames(stage.state)];
                    var minicont = $('<div></div>').addClass('stTracker__box');
                    if(index > 0)
                        $.fn.StateTracker.createArrow('R').appendTo(minicont);
                    $.fn.StateTracker.createStage(stage.name, state, stage.index).appendTo(minicont);
                    $(minicont).appendTo(cont);
                });
            };

            /**
             * load or reload states
             */
            self.loadStates = function(){
                var stages = $('.stTracker__stage').toArray();
                if(Array.isArray(stages)){
                    stages.forEach(function(stage, ind){
                        $(stage).children('.stTracker__icon')
                                .children('i').addClass((stage.state && stage.state.icon)? stage.state.icon: "").css('color', (stage.state && stage.state.color)? stage.state.color: "");
                    });
                }
            }

            /**
             * @private Init function
             */
            var init = function(){
                if(Array.isArray(settings.states)){
                    settings.states.forEach(function(state){
                        self.addState(state);
                    });
                }
    
                if(Array.isArray(settings.stages)){
                    settings.stages.forEach(function(stage){
                        self.addStage(stage);
                    });
                }
                self.load();
            }

            init();

        });

    };
}(jQuery));