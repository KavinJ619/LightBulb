import React, { Component, Fragment } from 'react'
import Link from "react-router-dom/Link";
import { connect } from "react-redux"
import PropTypes from "prop-types"

//Material imports
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Button from "@material-ui/core/Button"
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import HomeIcon from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';
import PostIdea from "./PostIdea"
import Notifications from "./Notifications"



export class Navbar extends Component {
    render() {
        const { authenticated } = this.props;
        return (
            <AppBar position="fixed">
                <Toolbar>
                    {authenticated ? (
                        <Fragment>
                            <div className="nav-container-auth">
                                <PostIdea />
                                <Tooltip title="Home" placement="bottom">
                                    <Link to="/">
                                        <IconButton color="primary">
                                            <HomeIcon className="post-icon"/>
                                        </IconButton>
                                    </Link>

                                </Tooltip>
                                <Notifications className="post-icon"/>
                                
                            </div>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Typography variant="h6">
                                <Button component={Link} to="/" style={{fontSize: 30}}>LightBulb</Button>
                            </Typography>
                            <div className="nav-container">
                                <Button color="inherit" component={Link} to="/">Home</Button>
                                <Button color="inherit" component={Link}  to="/login">Log In</Button>
                                <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
                            </div>
                        </Fragment>
                    )}

                </Toolbar>
            </AppBar>
        )
    }
}

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(Navbar);
