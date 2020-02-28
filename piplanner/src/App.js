import React, {Component } from "react";
import {
    Switch,
    Route,
    Link
} from "react-router-dom";
import Planner from './components/Planner';
import Home from './components/Home';
import Vacation from './components/Vacation';
import Teams from './components/Teams';

const Main = () => (
    <main>
        <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/teams' component={Teams} />
            <Route exact path='/proPlann' component={Planner} />
            <Route exact path='/vacation' component={Vacation}/>
        </Switch>
    </main>
)

const Menu = () => (
    <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
        <span class="navbar-brand mb-0 h1" >Program Dashboard</span>
          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav mr-auto">
                <Link to='/' className='nav-item nav-link'>Home</Link>
                <Link to='/teams' className='nav-item nav-link'>Teams</Link>
                <Link to='/proPlann' className='nav-item nav-link'>Program Planner</Link>
                <Link to='/vacation' className='nav-item nav-link'>Vacation</Link>
            </div>
        </div>
    </nav>
)

export default class App extends Component {
    render() {
        return (
            <div>
                <Menu/>
                <Main/>
            </div>
        );
    }
}
