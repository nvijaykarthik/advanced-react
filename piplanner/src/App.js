import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    piplanners: []
  }

  componentDidMount() {
    fetch("http://localhost:8080/api/getPiPlanners?programId=1&teamId=1")
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        this.setState({
          piplanners:data
        })
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }


  render() {
    let piList = this.state.piplanners.map(pi => {
      return (
          <tr key={pi.id}>
              <td>{pi.storyNumber}</td>
          </tr>
      )
  })
    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <table>
              <thead>
                <tr>
                  <td>FeatureId</td>
                  <td>Story No</td>
                  <td>Description</td>
                  <td>Story Points</td>
                  <td>Iteration</td>
                  <td>Comments</td>
                </tr>
              </thead>
              <tbody>
                {piList}
              </tbody>
            </table>
          </div>
          <div className="col-md-6"></div>
        </div>
        <div className="row">
          Pi Objective
        </div>
      </div>
    );
  }
}

export default App;
