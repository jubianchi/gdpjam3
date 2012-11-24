define([
  'underscore',
  'underscore.string',
  'backbone',
  'hogan',
], function(_, _string, Backbone, Hogan) {
  'use strict';

  var classToType = {};

  ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Undefined', 'Null'].forEach(function(name){
    classToType['[object ' + name + ']'] = name.toLowerCase();
  });

  // mix in non-conflict functions to Underscore namespace if you want
  _.mixin(_string.exports());
  _.mixin({includeStr: _string.include, reverseStr: _string.reverse});

  // enhance Backbone views with close() mechanism
  _.extend(Backbone.View.prototype, {

    /**
     * For views that wants templating, put their the string version of a mustache template,
     * that will be compiled with Hogan
     */
    template: null,

    /**
     * Array of bounds between targets and the view, that are unbound by `destroy`
     */
    _bounds: [],

    // overload the initialize method to bind `destroy()`
    initialize: function() {
      _.bindAll(this);
      // initialize to avoid static behaviour
      this._bounds = [];
      // bind to remove element to call the close method.
      this.$el.bind('remove', this.dispose);
    },

    /**
     * Allows to bound a callback of this view to the specified emitter
     * bounds are keept and automatically unbound by the `destroy` method.
     *
     * @param emitter [Backbone.Event] the emitter on which callback is bound
     * @param events [String] events on which the callback is bound
     * @param callback [Function] the bound callback
     */
    bindTo: function(emitter, events, callback) {
      emitter.on(events, callback);
      this._bounds.push([emitter, events, callback]);
    },
      
    /**
     * Unbounds a callback of this view from the specified emitter
     *
     * @param emitter [Backbone.Event] the emitter on which callback is unbound
     * @param events [String] event on which the callback is unbound
     */
    unboundFrom: function(emitter, event) {
      for (var i = 0; i < this._bounds.length; i++) {
        var spec = this._bounds[i];
        if (spec[0] === emitter && spec[1] === event) {
          spec[0].off(spec[1], spec[2]);
          this._bounds.splice(i, 1);
          break;
        }
      }
    },

    /**
     * The destroy method correctly free DOM and event handlers
     * It must be overloaded by subclasses to unsubsribe events.
     */
    dispose: function() {
      // automatically remove bound callback
      for (var i = 0; i < this._bounds.length; i++) {
        var spec = this._bounds[i];
        spec[0].off(spec[1], spec[2]);
      }
      // unbind DOM callback
      this.$el.unbind();
      // remove rendering
      this.remove();
      this.trigger('dispose', this);
    },

    /**
     * The `render()` method is invoked by backbone to display view content at screen.
     * if a template is defined, use it
     */
    render: function() {
      // template rendering
      if (this.template) {
        // first compilation if necessary
        if (_.isString(this.template)) {
          this.template = Hogan.compile(this.template);
        }
        // then rendering
        this.$el.empty().append(this.template.render(this._getRenderData()));
      }
      // for chaining purposes
      return this;
    },

    /**
     * This method is intended to by overloaded by subclass to provide template data for rendering
     *
     * @return an object used as template data (this by default)
     */
    _getRenderData: function() {
      return this;
    }

  });

  return {

    /**
     * This method is intended to replace the broken typeof() Javascript operator.
     *
     * @param obj [Object] any check object
     * @return the string representation of the object type. One of the following:
     * object, boolean, number, string, function, array, date, regexp, undefined, null
     *
     * @see http://arcturo.github.com/library/coffeescript/07_the_bad_parts.html
     */
    type: function(obj) {
      var strType = Object.prototype.toString.call(obj);
      return classToType[strType] || "object";
    },
  }
});