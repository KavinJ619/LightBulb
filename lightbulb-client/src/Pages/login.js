import React, { Component } from 'react';
import withStyles  from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import Link from "react-router-dom/Link";

import Typography from "@material-ui/core/Typography";
import  TextField from "@material-ui/core/TextField";
import  Button from "@material-ui/core/Button";
import CircularProgress from '@material-ui/core/CircularProgress';

//Redux imports
import { connect } from "react-redux";
import { loginUser } from "../Redux/actions/userActions"


const styles ={
    textField: {
        marginBottom: 10
    },
    pageTitle:{
        marginBottom: 20
    },
    customError: {
        color: 'red',
        fontSize: '1rem',
        textAlign:'center',
        marginBottom: 17,
        border: '1px solid red',
        padding: '13px',
        width: '60%',
        margin: '0 auto'
    },
    button: {
        position:'relative'
    },
    progress: {
        position:'absolute'
    }
};



class login extends Component {
    constructor() {
        super();
        this.state ={
            email:'',
            password: '',
            errors: {}
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.UI.errors){
            this.setState({
                errors:nextProps.UI.errors
            })
        }
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.loginUser(userData, this.props.history);
        
    }

    render() {
        const { classes, UI: { loading } } = this.props;
        const { errors } = this.state
        return (
            <div className="login-form-container">
                <div className="login-header">
                    <h3>Log In</h3>
                </div>
                <form noValidate onSubmit={this.handleSubmit}>
                    {errors.general && (
                        <Typography variant="body2" className={classes.customError}>
                            {errors.general}
                        </Typography>
                    )}
                    <div className="login-textfields">
                        <div className="login-textfield">
                            <TextField id="email" name="email" label="Email" onChange={this.handleChange} fullWidth variant="outlined" 
                            helperText={errors.email} error={errors.email ? true:false}  />
                        </div>
                        <div className="login-textfield">
                            <TextField id="password" name="password" label="Password" type="password" onChange={this.handleChange} fullWidth variant="outlined" 
                            helperText={errors.password} error={errors.password ? true:false} />
                        </div>
                    </div>
                    <div className="login-button">
                        <Button variant="contained" color="primary" size="large" type="submit" 
                        className={classes.button} disabled={loading}>
                            {loading && (
                                <CircularProgress className={classes.progress} size={30} />
                            )}
                            Login
                        </Button>
                    </div>
                    <div className="sign-up-redirect">
                        <small>Don't have an account? <Link to="/signup">Sign Up</Link>!</small>
                    </div>
                </form>
            </div>
        )
    }
}

login.propTypes={
    classes: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    user : PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
});

const mapActionsToProps ={
    loginUser
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(login))
