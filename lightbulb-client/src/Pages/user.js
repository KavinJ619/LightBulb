import React, { Component } from 'react'
import PropTypes from "prop-types"
import axios from "axios"
import Idea from "../Components/Idea"
import Grid from "@material-ui/core/Grid"

import { connect } from "react-redux";
import { getUserData } from "../Redux/actions/dataActions"
import StaticProfile from "../Components/StaticProfile"

export class user extends Component {

    state= {
        profile: null,
        ideaIdParam: null
    }

    componentDidMount(){
        const handle = this.props.match.params.handle;
        const ideaId = this.props.match.params.ideaId

        if (ideaId){
            this.setState({
                ideaIdParam: ideaId
            })
        }

        this.props.getUserData(handle);
        axios.get(`/user/${handle}`)
            .then(res => {
                this.setState({
                    profile: res.data.user
                })
            })
            .catch(err => {
                console.log(err)
            })
    }


    render() {
        const {ideas, loading} =  this.props.data;
        const { ideaIdParam } = this.state;

        const ideasMarkup = loading ? (
            <p>Loading data</p>
        ) : ideas === null ? (
            <p>No ideas from the user</p>
        ) : !ideaIdParam ? (
            ideas.map(idea => <Idea key={idea.ideaId} idea={idea} />)
        ) : (
            ideas.map(idea => {
                if (idea.ideaId !== ideaIdParam){
                    return <Idea key={idea.ideaId} idea={idea} />
                }
                else {
                    return <Idea key={idea.ideaId} idea={idea} openDialog/>
                }
            })
        )
        return (
            <Grid container>
                <Grid item sm={8} xs={12}>
                    {ideasMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    {this.state.profile === null ? (
                        <p>Loading Profile...</p>
                    ) : (
                        <StaticProfile  profile={this.state.profile} />
                    )}
                </Grid>
            </Grid>
        )
    }
}

user.propTypes = {
    getUserData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    data:state.data
})

export default connect(mapStateToProps, {getUserData})(user)
