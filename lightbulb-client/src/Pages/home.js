import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from "prop-types";

import Idea from "../Components/Idea"
import Profile from "../Components/Profile"

import { connect } from "react-redux"
import { getIdeas } from "../Redux/actions/dataActions"

class home extends Component {

    componentDidMount(){
        this.props.getIdeas();
    }
screams
    render() {
        const { ideas, loading } = this.props.data
        let recentIdeasMarkup = !loading ? (
        ideas.map(idea => <Idea key={idea.ideaId} idea={idea} />)
        ) : <CircularProgress />

        return (
            <Grid container>
                <Grid item sm={8} xs={12}>
                    {recentIdeasMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <Profile />
                </Grid>
            </Grid>
        )
    }
}

home.propTypes = {
    getIdeas: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  };
  
  const mapStateToProps = (state) => ({
    data: state.data
  });
  
  export default connect(
    mapStateToProps,
    { getIdeas }
  )(home);