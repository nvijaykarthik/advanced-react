import React, { Component } from 'react';
import '../App.css';

export default class Loader extends Component {
    render() {
        return (
            <div className="loader center">
                <i className="fa fa-spinner fa-spin" />
            </div>
        )
    }
}