import React, { Component, Fragment } from 'react'
import PropTypes from "prop-types";


import { connect } from "react-redux"
import { editUserDetails } from "../Redux/actions/userActions";


import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';

let iconStyles = {
    backgroundColor: '#992FA8',
    color: '#fff',
    marginLeft : 40
};

class EditDetails extends Component {

    state={
        bio:'',
        website: '',
        location: '',
        open: false
    }
    mapUserDetailsToState = (credentials) => {
        this.setState({
            bio: credentials.bio ? credentials.bio : '',
            website: credentials.website ? credentials.website : '',
            location: credentials.location ? credentials.location : ''
        })
    }

    componentDidMount() {
        const { credentials } = this.props;
        this.mapUserDetailsToState(credentials);
    }

    handleOpen =() => {
        this.setState({
            open:true
        })
        this.mapUserDetailsToState(this.props.credentials)
    }

    handleClose = () => {
        this.setState({
            open:false
        })
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSubmit = () => {
        const userDetails = {
            bio: this.state.bio,
            website: this.state.website,
            location: this.state.location
        }
        this.props.editUserDetails(userDetails)
        this.handleClose()
    }

    

    render() {
        
        return (
            <Fragment>
                <Tooltip title="Edit Your  Details" placement="top">
                    <Button style={iconStyles} onClick={this.handleOpen} variant="contained" endIcon={<EditIcon />}>
                        Edit
                    </Button>
                </Tooltip>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>Edit Your Details</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                                name="bio"
                                type="text"
                                label="Bio"
                                placeholder="Give a Bio!"
                                className="edit-text"
                                value={this.state.bio}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <TextField
                                name="website"
                                type="text"
                                label="Website"
                                placeholder="Your Website"
                                className="edit-text"
                                value={this.state.website}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <TextField
                                name="location"
                                type="text"
                                label="Location"
                                placeholder="Give your Location!"
                                className="edit-text"
                                value={this.state.location}
                                onChange={this.handleChange}
                                fullWidth
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} colors="primary">Cancel</Button>
                        <Button onClick={this.handleSubmit} colors="primary">Save</Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

EditDetails.propTypes = {
    editUserDetails: PropTypes.func.isRequired
  };
  
  const mapStateToProps = (state) => ({
    credentials: state.user.credentials
  });
  
  export default connect(
    mapStateToProps,
    { editUserDetails }
  )(EditDetails);
