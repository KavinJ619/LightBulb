import React, { Component, Fragment } from 'react'
import Link from "react-router-dom/Link"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import PropTypes from "prop-types"

import Menu  from "@material-ui/core/Menu"
import MenuItem  from "@material-ui/core/MenuItem"
import IconButton  from "@material-ui/core/IconButton"
import Tooltip  from "@material-ui/core/Tooltip"
import Typography  from "@material-ui/core/Typography"
import Badge  from "@material-ui/core/Badge"

import NotificationsIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite"
import ChatIcon from '@material-ui/icons/Chat';

import {connect} from "react-redux";
import {markNotificationsRead} from "../Redux/actions/userActions";

class Notifications extends Component{
    state = {
        anchorElement: null
    }

    handleOpen = event =>{
        this.setState({
            anchorElement: event.target
        })
    }

    handleClose = () => {
        this.setState({
            anchorElement:null
        })
    }

    onMenuOpen = () => {
        let unreadNotificationsIds = this.props.notifications
          .filter((not) => !not.read)
          .map((not) => not.notification);
        this.props.markNotificationsRead(unreadNotificationsIds);
      };

    render(){
        const notifications=this.props.notifications;
        const anchorEl = this.state.anchorElement;

        dayjs.extend(relativeTime)

        let notificationIcon;
        if (notifications && notifications.length > 0){
            notifications.filter(not => not.read === false).length > 0 ? (
                (notificationIcon = (
                    <Badge badgeContent={notifications.filter(not => not.read === false).length}
                        color="secondary">
                            <NotificationsIcon />
                        </Badge>
                ))
            ): (
                notificationIcon = <NotificationsIcon />
            )
        } 
        else{
            notificationIcon = <NotificationsIcon />
        }

        let notificationsMarkup= notifications && notifications.length > 0 ? (
            notifications.map(not => {
                const verb = not.type === 'like' ? 'liked' : 'commented on';
                const time = dayjs(not.createdAt).fromNow();
                const iconColor = not.read ? 'primary' : 'secondary';
                const icon = not.type === 'like' ? (
                    <FavoriteIcon color={iconColor}  />
                ) : (
                    <ChatIcon color={iconColor}  />
                )
                return (
                    <MenuItem key={not.createdAt} onClick={this.handleClose}>
                        {icon}
                        <Typography Component={Link}
                        color="default" variant="body1" to={`/users/${not.recipient}/idea/${not.ideaId}`}>
                            {not.sender} {verb} your idea {time}
                        </Typography>
                    </MenuItem>
                )
            })
        ) : (
            <MenuItem onClick={this.handleClose}>
                You have no notifications yet. Unlucky!
            </MenuItem>
        )
        return (
            <Fragment>
                <Tooltip placement="top" title="Notifications">
                    <IconButton aria-owns={anchorEl ? 'simple-menu' : undefined} 
                    aria-haspopup="true" onClick={this.handleOpen}>
                        {notificationIcon}
                    </IconButton>
                </Tooltip>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose} onEntered={this.onMenuOpen}>
                    {notificationsMarkup}
                </Menu>
            </Fragment>
        )
    }
}

Notifications.propTypes ={
    markNotificationsRead: PropTypes.func.isRequired,
    notifications: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
    notifications: state.user.notifications
})

export default connect(mapStateToProps, { markNotificationsRead })(Notifications);
