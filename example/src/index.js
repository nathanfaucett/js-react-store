var React = require("react"),
    ReactDOM = require("react-dom"),
    PropTypes = require("prop-types"),
    createReactClass = require("create-react-class"),
    createStore = require("@nathanfaucett/store"),

    reduxDevtoolsExtension = require("redux-devtools-extension"),

    ReactStore = require("../..");


var store = createStore(),
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


var Counter = createReactClass({
    render: function() {
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
    }
});

Counter.propTypes = {
    count: PropTypes.number.isRequired
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
