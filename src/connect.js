var React = require("react"),
    PropTypes = require("prop-types"),
    extend = require("@nathanfaucett/extend"),
    createReactClass = require("create-react-class"),
    shallowEquals = require("@nathanfaucett/shallow_equals");


module.exports = connect;


function connect(mapStateToProps, mapDispatchToProps, WrappedComponent) {
    var Connect = createReactClass({

        onUpdate: function(state) {
            return onUpdate(this, state);
        },

        getInitialState: function() {

            this._unsubscribe = null;
            this._store = this.props.store || this.context.store;

            this._mappedState = mapStateToProps(this._store.getState(), this.props);
            this._mappedDispatch = mapDispatchToProps(this._store.dispatch, this.props);
            this._mappedProps = extend({}, this._mappedState, this._mappedDispatch);
            this._shouldComponentUpdate = false;

            return null;
        },

        componentDidMount: function() {
            this._unsubscribe = this._store.subscribe(this.onUpdate);
        },

        componentWillUnmount: function() {
            this._unsubscribe();
        },

        componentWillReceiveProps: function(nextProps) {
            this._shouldComponentUpdate = shouldComponentUpdate(
                this,
                nextProps
            );
        },

        shouldComponentUpdate: function() {
            var shouldComponentUpdate = this._shouldComponentUpdate;
            this._shouldComponentUpdate = false;
            return shouldComponentUpdate;
        },

        render: function() {
            return React.createElement(WrappedComponent, this._mappedProps, this.props.children);
        }
    });

    Connect.contextTypes = {
        store: PropTypes.shape({
            getState: PropTypes.func.isRequired,
            dispatch: PropTypes.func.isRequired
        }).isRequired
    };

    function shouldComponentUpdate(_this, nextProps) {
        var prevMappedState = _this._mappedState,
            prevChildren = _this.props.children;

        _this._store = nextProps.store || _this.context.store;
        _this._mappedState = mapStateToProps(_this._store.getState(), nextProps);
        _this._mappedDispatch = mapDispatchToProps(_this._store.dispatch, nextProps);
        _this._mappedProps = extend({}, _this._mappedState, _this._mappedDispatch);

        return (!shallowEquals(prevMappedState, _this._mappedState) ||
            !shallowEquals(prevChildren, nextProps.children)
        );
    }

    function onUpdate(_this /*, state, action */ ) {
        _this.componentWillReceiveProps(
            _this.props,
            _this.children,
            _this.context
        );

        if (_this._shouldComponentUpdate) {
            _this.forceUpdate();
        }
    }


    return Connect;
}