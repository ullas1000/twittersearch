import React, { Component } from 'react';
import axios from 'axios';
import LazyLoad from 'react-lazyload';
import './App.css';
import {
    BrowserRouter as Router,
    Link,
    Switch,
    Route // for later
} from 'react-router-dom'
import './css/bootstrap.min.css';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seconds: 30, data: []
        }
        this.tick = this.tick.bind(this);
        this.searchQuery = this.searchQuery.bind(this);
        this.btnClick = this.btnClick.bind(this);


    }

    tick() {
        var a = this.state.seconds - 1;
        if (a === 0) {
            //this.setState({ seconds: 60 })
            this.searchQuery(this.refs.txtQuery.value);
        }
        else {
            this.setState({ seconds: a })
        }

        // document.getElementById("sp").textContent = a;

    }
    componentDidMount() {

        if (this.props.history.location.pathname.split('/key=')[1] != undefined) {
            this.searchQuery(this.props.history.location.pathname.split('/key=')[1]);
            this.refs.txtQuery.value = this.props.history.location.pathname.split('/key=')[1];
        }
        setInterval(this.tick, 1000);

    }
    searchQuery(query) {
        var that = this;
        axios.get('https://aravindtwitter.herokuapp.com/twittersearch?key=' + query)
            .then(function (response) {

                that.setState({ data: response.data, seconds: 30 })
                console.log(response);
            })
            .catch(function (error) {

                console.log(error);
            })
            .finally(function () {

            });

    }
    btnClick() {
        this.searchQuery(this.refs.txtQuery.value);
        this.props.history.push('/key=' + this.refs.txtQuery.value)
    }
    render() {
        return (
            <div>
                <div className="container">

                    <div className="row">

                        <div className="col-md-12">
                            <br />
                            <div className="row">
                                <div className="col-md-6  col-sm-6">
                                    <span>Search @ Twitter</span>
                                </div>
                                <div className="col-md-6 col-sm-6 text-right">
                                    <span className="float-right">Auto refresh in {this.state.seconds} seconds</span>
                                </div>
                            </div>

                            <hr size="30" />
                            <div className="row">
                                <div className="col-md-3 col-sm-3"></div>
                                <div className="col-md-6 col-sm-6">
                                    <input type="text" className="form-control" ref="txtQuery" />
                                </div>
                                <div className="col-md-3 col-sm-3">
                                    <input type="button" className="btn btn-primary" value="Search" onClick={this.btnClick} />
                                </div>
                            </div>

                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <br />
                        <div className="col-md-12 tweetContainer">
                            <div className="row">
                                <Tweets tweetlist={this.state.data} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Search;

class Tweets extends Component {
    constructor(props) {
        super(props)
    }
    renderTweets() {


        var that = this
        if (this.props.tweetlist.statuses != undefined) {

            return this.props.tweetlist.statuses.map(function (x) {

                return (<LazyLoad><div className="col-lg-12 col-md-6 col-sm-6 col-xs-12">
                    <div className="media">
                        <div className="media-left">
                            <a href="#">
                                <img className="media-object" src={x.user.profile_image_url} alt="..." />
                            </a>
                        </div>
                        <div className="media-body">
                            <p className="card-text"><small className="text-muted">{x.user.name}</small>&nbsp;<small className="text-muted">@{x.user.screen_name}</small>&nbsp;<small className="text-muted">{x.created_at}</small></p>
                            <p className="message">{x.text}</p>
                        </div>
                    </div>
                </div></LazyLoad>)
            })
        }
        else {

        }
    }
    render() {
        return (<div>
            {this.renderTweets()}
        </div>)
    }
}