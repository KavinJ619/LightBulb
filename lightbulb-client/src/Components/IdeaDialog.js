import React, { Component, Fragment } from 'react'
import PropTypes from "prop-types";
import { Link } from "react-router-dom"
import { connect } from "react-redux";
import { getIdea, clearErrors } from "../Redux/actions/dataActions"
import Comments from "./Comments"
import CommentForm from "./CommentForm"

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from "@material-ui/core/IconButton";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from "@material-ui/core/CircularProgress"
import CancelIcon from '@material-ui/icons/Cancel';
import dayjs from "dayjs"
import Typography from "@material-ui/core/Typography"
import InfoIcon from '@material-ui/icons/Info';
import AddCommentIcon from '@material-ui/icons/AddComment';


class IdeaDialog extends Component{
    state = {
        open:false,
        oldPath:'',
        newPath:''
    };

    componentDidMount(){
        if (this.props.openDialog){
            this.handleOpen();
        }
    }

    handleOpen = () => {
        let oldPath = window.location.pathname;

        const { userHandle, ideaId } = this.props;
        const newPath = `/users/${userHandle}/idea/${ideaId}`;

        if (oldPath===newPath) {
            oldPath=`/users/${userHandle}`
        }

        window.history.pushState(null, null, newPath);


        this.setState({ open:true, oldPath, newPath })
        this.props.getIdea(this.props.ideaId)
    }
    handleClose = () => {
        window.history.pushState(null, null, this.state.oldPath)
        this.setState({ open:false });
        this.props.clearErrors();
    }

    render() {
        const { idea: { ideaId, body, createdAt, likeCount, commentCount, userImage, userHandle, comments }, UI: { loading } } = this.props

        const dialogMarkup = loading ? (
            <div className="dialogLoad">
                <CircularProgress size={100}/>
            </div>
        ) : (
            <div className="dialog-container">
                <div className="dialog-container-info">
                    <div className="dialog-image-container">
                        <img src={userImage} alt="Profile" className="dialog-image" />
                    </div>
                    <div className="dialog-content-container">
                        <div className="dialog-content">
                            <div className="dialog-content-handle">
                                <Typography component={Link} to={`/user/${userHandle}`} variant="h4" color="primary">
                                    {userHandle}
                                </Typography>
                            </div>
                            <div className="dialog-content-date">
                                {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                            </div>
                            <div className="dialog-content-body">
                                {body}
                            </div>
                        </div>
                        
                    </div>
                </div>  
                
                <Comments comments={comments} /> 
                <CommentForm ideaId={ideaId} />
            </div> 
            
        )

        return (
            <Fragment>
                <Button onClick={this.handleOpen}>
                    <AddCommentIcon color="primary" />
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <Tooltip title="Close">
                        <Button className="closePostButton" onClick={this.handleClose}>
                            <CancelIcon className="CloseIcon" color="secondary"/>
                        </Button>
                    </Tooltip>
                    <DialogContent>
                        {dialogMarkup}
                    </DialogContent>
                </Dialog>
            </Fragment>
        )

    }
}

IdeaDialog.propTypes = {
    getIdea: PropTypes.func.isRequired,
    ideaId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    idea: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    idea: state.data.idea,
    UI: state.UI
})

const mapActionsToProps = {
    getIdea,
    clearErrors
};

export default connect(mapStateToProps, mapActionsToProps)(IdeaDialog)