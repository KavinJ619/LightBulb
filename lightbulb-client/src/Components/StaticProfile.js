import React, { Component,Fragment } from 'react'
import PropTypes from "prop-types"
import axios from "axios"
import dayjs from "dayjs"

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

const StaticProfile = (props) => {
    const { profile: { handle, createdAt, imageUrl, location, bio, website } } = props
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
    return (
        <div className="home-profile-container">
                    <div className="home-profile-upper">
                        <div>
                            <img src={imageUrl}  className="home-profile-image-container" alt="Profile"/>
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
                    </div>
                </div>
    )

}

StaticProfile.propTypes = {
    profile: PropTypes.object.isRequired
}

export default StaticProfile