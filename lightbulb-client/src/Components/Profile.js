import React, { Component, Fragment } from 'react'
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles"
import { connect } from "react-redux";
import Link from "react-router-dom/Link";
import dayjs from "dayjs"
import EditDetails from "./EditDetails"


import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import CreateIcon from '@material-ui/icons/Create';
import WebIcon from '@material-ui/icons/Web';
import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle';
import TodayIcon from '@material-ui/icons/Today';
import Button from "@material-ui/core/Button"
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import Tooltip from '@material-ui/core/Tooltip';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { logoutUser, uploadImage } from "../Redux/actions/userActions"


//MUI stuff

const styles={
    largeIcon: {
        width: 50,
        height: 50,
    },
    
}

let iconStyles = {
    fontSize: '36px'
};

let iconStylesPhoto = {
    fontSize: '36px',
    transform: 'translate(-150%, 90%)',
    color: 'black'
};

class Profile extends Component {

    handleImageChange = event => {
        const image = event.target.files[0];
        const formData= new FormData();
        formData.append('image', image, image.name);
        this.props.uploadImage(formData);
    }

    handleEditPicture = () => {
        const fileInput = document.getElementById('imageInput')
        fileInput.click();
    }

    handleLogout =() => {
        this.props.logoutUser();
    }

    render() {
        const {user: { credentials: { handle, createdAt, imageUrl, bio, website, location }, loading, authenticated }}=this.props;

        let profileMarkUp = !loading ? (
            authenticated ? (
                <div className="home-profile-container">
                    <div className="home-profile-upper">
                        <div>
                            <img src={imageUrl}  className="home-profile-image-container" alt="Profile"/>
                            <input type="file" id="imageInput" onChange={this.handleImageChange} hidden="hidden" />
                            <Tooltip title="Edit Profile Picture" placement="top">
                                <IconButton onClick={this.handleEditPicture} className="editIcon">
                                    <AddAPhotoIcon color="secondary" style={iconStylesPhoto} />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="home-profile-lower">
                        <div className="home-profile-items">
                            <div className="home-profile-item">
                                <div className="handleIcon">
                                    <Tooltip title="Username" placement="left">
                                        <PersonOutlineIcon style={iconStyles} color="primary"/>
                                    </Tooltip>
                                    
                                </div>
                                <div className="home-handle-h">
                                    {handle}
                            </div>
                            </div>

                            {bio && 
                                    <Fragment>
                                        <div className="home-profile-item">
                                            <div className="handleIcon">
                                            <CreateIcon style={iconStyles} color="primary"/>              
                                            </div>
                                            <div className="home-handle">
                                                <span>{bio}</span>
                                            </div>
                                        </div>
                                    </Fragment>  
                            } 

                            {website && 
                                    <Fragment>
                                        <div className="home-profile-item">
                                            <div className="handleIcon">
                                                <WebIcon style={iconStyles} color="primary"/>
                                            </div>
                                            <div className="home-handle-web">
                                                <span><Button target="_blank" href={website} color="primary" variant="contained">Website</Button></span>
                                            </div>
                                        </div>
                                    </Fragment>  
                            } 
                            {location && 
                                    <Fragment>
                                        <div className="home-profile-item">
                                            <div className="handleIcon">
                                            <PersonPinCircleIcon style={iconStyles} color="primary"/>
                                            </div>
                                            <div className="home-handle">
                                                <span>{location}</span>
                                            </div>
                                        </div>
                                    </Fragment>  
                            } 
                            <div className="home-profile-item">
                                <div className="handleIcon">
                                    <TodayIcon style={iconStyles} color="primary"/>
                                </div>
                                <div className="home-handle">
                                    {dayjs(createdAt).format('DD MMM YYYY')}
                                </div>
                            </div>
                        </div>
                            <Tooltip title="Log Out" placement="top">
                                <Button onClick={this.handleLogout} color="primary" variant="contained" endIcon={<ExitToAppIcon />}>
                                    Log Out
                                </Button>
                            </Tooltip>
                            <EditDetails />
                    </div>
                </div>

            ) : 
            (
                <div className="unauth-prof-container">
                    <div className="unauth-login-button">
                        <Button color="primary" variant="contained" component={Link} to="/login">Have an account? Log in!</Button>
                    </div>
                    <div className="unauth-signup-button">
                        <Button color="secondary" variant="contained" component={Link} to="/signup">New to LightBulb? Get Started!</Button>
                    </div>
                </div>
            )) : 
            (
                <div className="progress-bar">
                    <CircularProgress />
                </div>
                
            )

        return profileMarkUp;
    }
}

const mapStateToProps = state => ({
    user: state.user
})

const mapActionsToProps = {logoutUser, uploadImage };

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    uploadImage: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired
}

export default connect(
    mapStateToProps,
    mapActionsToProps
  )(withStyles(styles)(Profile));
