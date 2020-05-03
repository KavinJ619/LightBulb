import React, { Component, Fragment } from 'react'
import PropTypes from "prop-types";

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from "@material-ui/core/IconButton";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from "@material-ui/core/CircularProgress"
import WbIncandescentIcon from '@material-ui/icons/WbIncandescent';
import CancelIcon from '@material-ui/icons/Cancel';


import { connect } from "react-redux"
import { postIdea, clearErrors } from "../Redux/actions/dataActions";

class PostIdea extends Component{
    state = {
        open: false,
        body: '',
        errors: {}
      };
      componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
          this.setState({
            errors: nextProps.UI.errors
          });
        }
        if (!nextProps.UI.errors && !nextProps.UI.loading) {
          this.setState({ body: '', open: false, errors: {} });
        }
      }
      handleOpen = () => {
        this.setState({ open: true });
      };
      handleClose = () => {
          this.props.clearErrors();
        this.setState({ open: false, errors: {} });
      };
      handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
      };
      handleSubmit = (event) => {
        event.preventDefault();
        this.props.postIdea({ body: this.state.body });
      };

    render(){
        const {errors} = this.state
        const { UI: { loading } } = this.props
        return (
            <Fragment>
                
                <Tooltip title="Add an Idea!">
                    <IconButton onClick={this.handleOpen}>
                        <WbIncandescentIcon className="post-icon"/>
                    </IconButton>
                </Tooltip>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <Tooltip title="Close">
                        <Button className="closePostButton" onClick={this.handleClose}>
                            <CancelIcon className="CloseIcon" color="secondary"/>
                        </Button>
                    </Tooltip>
                    <DialogTitle>
                        Tell Everyone what you are thinking!
                    </DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                            <TextField name="body" type="text" label="Idea" 
                            multiline rows="3" placeholder="Pitch us your Idea!" 
                            error={errors.body ? true : false} helperText={errors.body} 
                            onChange={this.handleChange} fullWidth className="post-body" />
                        <div className="submitIdeaButton">
                            <Button type="submit" variant="contained" color="secondary" disabled={loading} className="pitchButton">
                                Pitch!
                                {loading && (
                                    <CircularProgress size={30} className="progress" />
                                )}
                            </Button>
                        </div>
                        
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }

}

PostIdea.propTypes = {
    postIdea: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    UI: state.UI
})


export default connect(mapStateToProps, { postIdea, clearErrors })(PostIdea)