import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import Link from "react-router-dom/Link"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import PropTypes from "prop-types"

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Typography } from '@material-ui/core/';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AddCommentIcon from '@material-ui/icons/AddComment';

import { connect } from "react-redux";
import { likeIdea,unLikeIdea } from "../Redux/actions/dataActions"
import DeleteIdea from "./DeleteIdea"
import IdeaDialog from "./IdeaDialog"




const styles = {
    card: {
        display:'flex',
        marginBottom:20,
        backgroundColor:'#e0f2f1'
    },
    image:{
        minWidth: 200,
        objectFit:'cover'
    },
    content: {
        padding: 25,
        marginBottom: 10,
        width:'100%'
    },
    
}

export class Idea extends Component {
    likedIdea = () => {
        if (this.props.user.likes && this.props.user.likes.find(like => like.ideaId === this.props.idea.ideaId)){
            return true
        }
        else{
            return false
        }
    }

    likeIdea = () => {
        this.props.likeIdea(this.props.idea.ideaId);
    }

    unLikeIdea = () => {
        this.props.unLikeIdea(this.props.idea.ideaId);
    }

    render() {
        const { classes,idea : { body, createdAt, userImage, userHandle, ideaId, likeCount, commentCount, comments }, user: { authenticated, credentials: { handle } } } = this.props
        const likeButton = !authenticated ? (
            <div>
                <Link to="/login">
                    <IconButton className="unlikedButton">
                        <FavoriteBorderIcon />
                    </IconButton>
                </Link>
                
            </div>
        ) : (
            this.likedIdea() ? (
                <div className="likedButton">
                    <IconButton onClick={this.unLikeIdea} className="likedButton">
                        <FavoriteIcon color="primary"/>
                    </IconButton>
                </div>
            ) : (
                <div className="unlikedButton">
                    <IconButton onClick={this.likeIdea} className="unlikedbButton">
                        <FavoriteBorderIcon />
                    </IconButton>
                </div>
            )
        )
        dayjs.extend(relativeTime)
        const deleteButton = authenticated && userHandle === handle ? (
            <DeleteIdea ideaId={ideaId}/>
        ) : null
        
        return (
            <Card className={classes.card}>
                <CardMedia image={userImage} title="Profile Image" className={classes.image} />
                <CardContent className={classes.content}>
                    <Typography variant="h5" component={Link} to={`/users/${userHandle}`} color="primary">{userHandle}</Typography>
                    {deleteButton}
                    <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
                    <Typography variant="body1">{body}</Typography>
                    <div className="like-and-comment-container">
                        <div className="like-and-comment">
                            <div className="likes-and-comments-count">
                                <p className="likeCounts">{likeCount} Likes</p>
                                <p className="commentCounts">
                                    {commentCount} Comments
                                </p>
                            </div>
                            <div className="like-and-comment-button">
                                <div className="likeButton">
                                    {likeButton}
                                </div>
                                <div className="commentButton">
                                    <IdeaDialog ideaId={ideaId} userHandle={userHandle} openDialog={this.props.openDialog} />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </CardContent>
            </Card>
        )
    }
}

Idea.propTypes ={
    likeIdea: PropTypes.func.isRequired,
    idea : PropTypes.object.isRequired,
    unLikeIdea: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    openDialog: PropTypes.bool
}

const mapStateToProps = state => ({
    user:state.user
});

const mapActionToProps = {
    likeIdea,
    unLikeIdea
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(Idea))
