var React = require("react"),
    ReactDOM = require("react-dom"),
    PropTypes = require("prop-types"),
    createStore = require("@nathanfaucett/store"),
    inherits = require("@nathanfaucett/inherits"),

    reduxDevtoolsExtension = require("redux-devtools-extension"),

    ReactStore = require("../..");


var store = createStore(),

    Component = React.Component,
    Provider = ReactStore.Provider,
    connect = ReactStore.connect;


store.setInitialState({
    counter: {
        count: 0
    }
});

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    store.addAndComposeReduxStore(window.__REDUX_DEVTOOLS_EXTENSION__);
}

store.addMiddleware(function counterMiddleware(store, action, next) {
    switch (action.type) {
        case "INC": {
            store.dispatch({
                type: "INC_DONE",
                count: store.getState().counter.count + 1
            });
            break;
        }
        case "DEC": {
            store.dispatch({
                type: "DEC_DONE",
                count: store.getState().counter.count - 1
            });
            break;
        }
    }

    next(action);
});

store.add(function counter(state, action) {
    switch (action.type) {
        case "INC_DONE":
            return {
                count: action.count
            };
        case "DEC_DONE":
            return {
                count: action.count
            };
        default: {
            return state
        }
    }
});


function Counter(props, children, context) {
    Component.call(this, props, children, context);
}
inherits(Counter, Component);

Counter.propTypes = {
    count: PropTypes.number.isRequired
};

Counter.prototype.render = function() {
    return (
        React.createElement("div", null,
            React.createElement("button", {
                onClick: this.props.incCount
            }, "+"),
            React.createElement("button", {
                onClick: this.props.decCount
            }, "-"),
            React.createElement("p", null, this.props.count)
        )
    );
};


function mapDispatchToProps(dispatch) {
    return {
        incCount: function() {
            dispatch({
                type: "INC"
            });
        },
        decCount: function() {
            dispatch({
                type: "DEC"
            });
        }
    };
}

function mapStateToProps(state /*, ownProps */) {
    return {
        count: state.counter.count
    };
}

var CounterContainer = connect(mapStateToProps, mapDispatchToProps, Counter);


ReactDOM.render(
    React.createElement(Provider, {
        store: store,
        render: function render() {
            return React.createElement(CounterContainer, null);
        }
    }),
    document.getElementById("app")
);
