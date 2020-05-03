import React, { Component, Fragment } from 'react'
import PropTypes from "prop-types";
import { Link } from "react-router-dom"
import { connect } from "react-redux";
import { Grid, Typography } from '@material-ui/core';
import dayjs  from "dayjs"

export class Comments extends Component {
    render() {
        const { comments } = this.props;
        return (
            <div className="comments-container">
                { comments.map((comment) => {
                    const { body, createdAt, userImage, userHandle } = comment;
                    return (
                        <Fragment key={createdAt}>
                            <div className="comment-item">
                                <div className="comment-image-container">
                                    <img src={userImage} alt="Profile" className="comment-image" />
                                </div>
                                <div className="comment-content">
                                    <div className="comment-handle">
                                        <Typography component={Link} to={`/user/${userHandle}`} variant="h5" color="primary">
                                            {userHandle}
                                        </Typography>
                                    </div>
                                    <div className="comment-date">
                                        {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                                    </div>
                                    <div className="comment-body">
                                        {body}
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    )
                }) }
            </div>
        )
    }
}

Comments.propTypes = {

}

export default Comments
