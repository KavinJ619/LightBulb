import React, { Component, Fragment } from 'react'
import PropTypes from "prop-types"

import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import DeleteIcon from '@material-ui/icons/Delete';

import { connect } from "react-redux";
import { deleteIdea } from "../Redux/actions/dataActions"
import Tooltip from '@material-ui/core/Tooltip'

export class DeleteIdea extends Component {
    state = {
        open: false
    }

    handleOpen = () => {
        this.setState({
            open:true
        })
    }

    handleClose = () => {
        this.setState({
            open:false
        })
    }

    deleteIdea = () => {
        this.props.deleteIdea(this.props.ideaId);
        this.setState({ open:false })
    }

    

    render() {  
        return (
            <Fragment>
                <Tooltip title="Delete Idea">
                    <IconButton onClick={this.handleOpen} className="deleteButton">
                        <DeleteIcon color="secondary" className="deleteB" fontSize="default"/>
                    </IconButton>
                </Tooltip>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>
                        Are you sure?
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.deleteIdea} color="secondary">
                            Delete Idea
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

DeleteIdea.propTypes = {
    deleteIdea: PropTypes.func.isRequired,
    ideaId: PropTypes.string.isRequired
}

export default connect(null, { deleteIdea })(DeleteIdea)
