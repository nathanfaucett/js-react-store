var createReactClass = require("create-react-class"),
    PropTypes = require("prop-types");


var Provider = createReactClass({

    getChildContext: function() {
        return {
            store: this.props.store
        };
    },

    render: function() {
        return this.props.render();
    }
});


Provider.propTypes = {
    store: PropTypes.shape({
        getState: PropTypes.func.isRequired,
        dispatch: PropTypes.func.isRequired
    }).isRequired,
    render: PropTypes.func.isRequired
};

Provider.childContextTypes = {
    store: PropTypes.shape({
        getState: PropTypes.func.isRequired,
        dispatch: PropTypes.func.isRequired
    })
};


module.exports = Provider;