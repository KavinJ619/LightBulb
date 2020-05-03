import React, { Component } from 'react';
import withStyles  from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import Link from "react-router-dom/Link";

import Typography from "@material-ui/core/Typography";
import  TextField from "@material-ui/core/TextField";
import  Button from "@material-ui/core/Button";
import CircularProgress from '@material-ui/core/CircularProgress';

import { connect } from "react-redux"
import { signUpUser } from "../Redux/actions/userActions"


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



class signup extends Component {
    constructor() {
        super();
        this.state ={
            email:'',
            password: '',
            confirmPaswword: '',
            handle: '',
            errors: {}
        }
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    componentWillReceiveProps(nextProps){
        if (nextProps.UI.errors){
            this.setState({
                errors:nextProps.UI.errors
            })
        }
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            loading:true
        });
        const newUserData = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            handle: this.state.handle
        }
        this.props.signUpUser(newUserData, this.props.history);
    }

    render() {
        const { classes, UI: {loading} } = this.props;
        const { errors } = this.state
        return (
            <div className="signup-form-container">
                <div className="login-header">
                    <h3>Sign Up</h3>
                </div>
                <form noValidate onSubmit={this.handleSubmit}>
                    {errors.general && (
                        <Typography variant="body2" className={classes.customError}>
                            {errors.general}
                        </Typography>
                    )}
                    <div className="signup-textfields">
                        <div className="login-textfield">
                            <TextField id="email" name="email" label="Email" onChange={this.handleChange} fullWidth 
                            helperText={errors.email} error={errors.email ? true:false}  />
                        </div>
                        <div className="login-textfield">
                            <TextField id="password" name="password" label="Password" type="password" onChange={this.handleChange} fullWidth 
                            helperText={errors.password} error={errors.password ? true:false} />
                        </div>
                        <div className="login-textfield">
                            <TextField id="confirmPassword" name="confirmPassword" label="Confirm Password" type="password" onChange={this.handleChange} fullWidth  
                            helperText={errors.confirmPassword} error={errors.confirmPassword ? true:false} />
                        </div>
                        <div className="login-textfield">
                            <TextField id="handle" name="handle" label="Username" type="text" onChange={this.handleChange} fullWidth 
                            helperText={errors.handle} error={errors.handle ? true:false} />
                        </div>
                    </div>
                    <div className="login-button">
                        <Button variant="contained" color="primary" size="large" type="submit" 
                        className={classes.button} disabled={loading}>
                            {loading && (
                                <CircularProgress className={classes.progress} size={30} />
                            )}
                            Sign Up
                        </Button>
                    </div>
                    <div className="sign-up-redirect">
                        <small>Already have an account? <Link to="/login">Log In</Link>!</small>
                    </div>
                </form>
            </div>
        )
    }
}

signup.propTypes={
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    signUpUser: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    user: state.user,
    UI:state.UI
})

export default connect(mapStateToProps, { signUpUser })(withStyles(styles)(signup))
