import React, { Component, Fragment } from 'react'
import PropTypes from "prop-types";
import { Link } from "react-router-dom"
import { connect } from "react-redux";

import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField"
import { submitComment } from "../Redux/actions/dataActions"
import SendIcon from '@material-ui/icons/Send';

export class CommentForm extends Component {
    state = {
        body: '',
        errors: {}
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.UI.errors){
            this.setState({
                errors: nextProps.UI.errors
            })
        }
        if (!nextProps.UI.errors && !nextProps.UI.loading){
            this.setState({ body: '' })
        }
    }

    handleChange = event => {
        this.setState({ 
            [event.target.name]: event.target.value
         })
    }

    handleSubmit = event => {
        event.preventDefault();
        this.props.submitComment(this.props.ideaId, { body: this.state.body })
    }

    render() {
        
        const {authenticated} = this.props;
        const errors = this.state.errors;
        const icon = <IconButton type="submit" variant="contained" color="secondary"><SendIcon /></IconButton>
        const commentFormMarkup = authenticated ? (
            <div className="add-comment-container">
                <form onSubmit={this.handleSubmit}>
                    <div className="form-comment-container">
                        <TextField InputProps={{endAdornment: icon}} fullWidth name="body" type="text" 
                        label="Tell them what you think!" error={errors.comment ? true : false}  
                        helperText={errors.comment} value={this.state.body} onChange={this.handleChange} 
                        className="comment-field" />
                    </div>
                </form>
            </div>
        ): null
        return commentFormMarkup;
    }
}

CommentForm.propTypes = {
    submitComment: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    ideaId: PropTypes.string.isRequired,
    authenticated: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
    UI: state.UI,
    authenticated: state.user.authenticated
})

export default connect(mapStateToProps, { submitComment })(CommentForm);
