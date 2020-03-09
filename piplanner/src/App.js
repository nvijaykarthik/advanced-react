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
import PiCalendar from './components/PiCalendar';
import DependencyConfig from './components/DependencyConfig';

const Main = () => (
    <main>
        <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/teams' component={Teams} />
            <Route exact path='/proPlann' component={Planner} />
            <Route exact path='/vacation' component={Vacation}/>
            <Route exact path='/piCalendar' component={PiCalendar}/>
            <Route exact path='/dependencyconfig' component={DependencyConfig}/>
        </Switch>
    </main>
)

const Menu = () => (
    <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
        <span className="navbar-brand mb-0 h1" >Program Dashboard </span>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav mr-auto">
                <Link to='/' className='nav-item nav-link'>Home</Link>
                <Link to='/teams' className='nav-item nav-link'>Teams</Link>
                <Link to='/piCalendar' className='nav-item nav-link'>PI Calendar</Link>
                <Link to='/vacation' className='nav-item nav-link'>Vacation</Link>
                <Link to='/proPlann' className='nav-item nav-link'>Program Planner</Link>
                <Link to='/dependencyconfig' className='nav-item nav-link'>Dependency Configuration</Link>
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
