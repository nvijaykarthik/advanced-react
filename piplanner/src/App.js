import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    piplanners: [],
    portfolio: [],
    selectedPortfolio: "",
    programs: [],
    years: [],
    selectedProgram: "",
    selectedYear: "2020",
    teams: [],
    selectTeam: "",
    itrs: [],
    showPlan: false,
    capacity: 0,
    piplan: {
      comments: "",
      description: "",
      fJiraLnk: "",
      featureId: "",
      id: 0,
      itrId: 0,
      portfolioId: 0,
      programPlanId: 0,
      storyJiraLnk: "",
      storyNumber: "",
      storyPoints: "",
      storyPointsDev: "",
      storyPointsTst: "",
      teamId: 0
    }
  }


  //get list of portfolio-done
  //get list of teams from that portfolio-done
  //get list of programs in that portfolio-done
  //get list of iteration for that program -done


  componentDidMount() {
    fetch("http://localhost:8080/api/portfolio")
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        this.setState({
          portfolio: data
        })
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch("http://localhost:8080/api/getConfiguredYears")
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        this.setState({
          years: data
        })
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }

  onChangeYear(evt) {
    this.setState({ selectedYear: evt.target.value })
  }
  onChangePortfolio(evt) {
    let piplan = { ...this.state.piplan };
    piplan.portfolioId = evt.target.value;
    this.setState({ selectedPortfolio: evt.target.value, piplan, showPlan: false, selectedProgram: "", selectTeam: "" });
    this.loadProgramForPortfolio(evt.target.value);
    this.loadTeamForPortfolio(evt.target.value);
  }
  loadProgramForPortfolio(portfolioId) {
    if (this.state.selectedYear === "") {
      alert("Please select the year");
    }
    fetch("http://localhost:8080/api/getProgramCalendar?portfolioId=" + portfolioId + "&fiYear=" + this.state.selectedYear)
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        this.setState({
          programs: data
        })
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  loadTeamForPortfolio(portfolioId) {
    fetch("http://localhost:8080/api/teamsForPortfolio?portfolioId=" + portfolioId)
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        this.setState({
          teams: data
        })
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  loadIterationForProgram(prgId) {
    fetch("http://localhost:8080/api/getIterationCalendar?programPlanId=" + prgId)
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        this.setState({
          itrs: data
        })
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  onChangeProgram(evt) {
    let piplan = { ...this.state.piplan };
    piplan.programPlanId = evt.target.value;
    this.setState({ selectedProgram: evt.target.value, piplan, showPlan: false });
    this.loadIterationForProgram(evt.target.value)
  }
  onChangeTeam(evt) {
    let piplan = { ...this.state.piplan };
    piplan.teamId = evt.target.value;
    this.setState({ selectTeam: evt.target.value, piplan, showPlan: false });
  }

  btnLoadPlan() {
    if (this.state.selectedProgram === "") {
      alert("please select the program")
      return;
    }
    if (this.state.selectTeam === "") {
      alert("please select the team")
      return;
    }
    fetch("http://localhost:8080/api/getPiPlanners?programId=" + this.state.selectedProgram + "&teamId=" + this.state.selectTeam)
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        this.setState({
          piplanners: data,
          showPlan: true
        })
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  btnNewPlan() {
    this.setState({
      piplan: {
        comments: "",
        description: "",
        fJiraLnk: "",
        featureId: "",
        id: 0,
        itrId: 0,
        portfolioId: this.state.selectedPortfolio,
        programPlanId: this.state.selectedProgram,
        storyJiraLnk: "",
        storyNumber: "",
        storyPoints: "",
        storyPointsDev: "",
        storyPointsTst: "",
        teamId: this.state.selectTeam
      }
    })
  }


  onchangefeatureId(e) {
    let piplan = { ...this.state.piplan };
    piplan.featureId = e.target.value;
    this.setState({ piplan })
  }
  onchangefJiraLnk(e) {
    let piplan = { ...this.state.piplan };
    piplan.fJiraLnk = e.target.value;
    this.setState({ piplan })
  }
  onchangestoryNumber(e) {
    let piplan = { ...this.state.piplan };
    piplan.storyNumber = e.target.value;
    this.setState({ piplan })
  }
  onchangestoryJiraLnk(e) {
    let piplan = { ...this.state.piplan };
    piplan.storyJiraLnk = e.target.value;
    this.setState({ piplan })
  }
  onchangestoryPoints(e) {
    let piplan = { ...this.state.piplan };
    piplan.storyPoints = e.target.value;
    this.setState({ piplan })
  }
  onchangecomments(e) {
    let piplan = { ...this.state.piplan };
    piplan.comments = e.target.value;
    this.setState({ piplan })
  }
  onchangedescription(e) {
    let piplan = { ...this.state.piplan };
    piplan.description = e.target.value;
    this.setState({ piplan })
  }
  onchangeitrId(e) {
    let piplan = { ...this.state.piplan };
    piplan.itrId = e.target.value;
    this.setState({ piplan })
  }


  savePlan() {
    let piplan = this.state.piplan;
    if (piplan.featureId === "" && piplan.storyNumber === "" && piplan.description === "") {
      alert("Please enter details of any one of 'Feature Id','Story number','description'")
      return
    }
    let self=this
    fetch('http://localhost:8080/api/savePiPlanner', {
      method: 'post',
      body: JSON.stringify(piplan),
      headers: {
        "Content-Type": "application/json"
      },
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      let piplanners=self.state.piplanners
      piplanners.push(data)
      self.setState({piplanners:piplanners,piplan:data})
    });
  console.log(piplan)
  }

render() {
  let piList = this.state.piplanners.map(pi => {
    let it=this.state.itrs.find(itr=>itr.id===pi.itrId)
    let itNo=""
    if(typeof it != "undefined"){
      itNo=it.itrNo
    }
    console.log(itNo)
    return (
      <tr key={pi.id}>
        <td>{pi.featureId}</td>
        <td>{pi.storyNumber}</td>
        <td>{pi.description}</td>
        <td>{pi.storyPointsDev}</td>
        <td>{itNo}</td>
        <td>{pi.comments}</td>
        <td><button className="btn btn-sm btn-warning">edit</button></td>
      </tr>
    )
  })
  let portfolioList = this.state.portfolio.map(po => {
    return (<option key={po.id} value={po.id}>{po.name}</option>)
  })
  let programList = this.state.programs.map(pr => {
    return (<option key={pr.id} value={pr.id}>{pr.piNo}</option>)
  })
  let teamList = this.state.teams.map(t => {
    return (
      <option key={t.id} value={t.id}>{t.name}</option>
    )
  })
  let yearList = this.state.years.map(yr => {
    return (<option key={yr} value={yr}>{yr}</option>)
  })
  let itrList = this.state.itrs.map(itr => {
    return (<option key={itr.id} value={itr.id}>{itr.itrNo}</option>)
  })
  let planView = () => {
    if (this.state.showPlan === true) {
      return (
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <table className="table table-bordered">
                  <thead className="thead-dark">
                    <tr>
                      <th>FeatureId</th>
                      <th>Story No</th>
                      <th>Description</th>
                      <th>Story Points</th>
                      <th>Iteration</th>
                      <th>Comments</th>
                      <th>options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {piList}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <div className="clearfix">
                  <strong>Edit/New Features</strong>

                  <button type="button" className="btn btn-secondary float-right" onClick={() => this.btnNewPlan()}>New Feature</button>
                </div>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="featureId" className="font-weight-bold">FeatureId</label>
                  <input type="text" className="form-control" id="featureId" placeholder="ABC-1234" value={this.state.piplan.featureId} onChange={(e) => this.onchangefeatureId(e)} />
                  <input type="text" className="form-control form-control-sm" id="fJiraLink" placeholder="http://jira.com/issues=ABC-1234" value={this.state.piplan.fJiraLnk} onChange={(e) => this.onchangefJiraLnk(e)} />
                </div>
                <div className="form-group">
                  <label htmlFor="storyNo" className="font-weight-bold">Story Number</label>
                  <input type="text" className="form-control" id="storyNo" placeholder="ABC-1234" value={this.state.piplan.storyNumber} onChange={(e) => this.onchangestoryNumber(e)} />
                  <input type="text" className="form-control form-control-sm" id="sJiraLink" placeholder="http://jira.com/issues=ABC-1234" value={this.state.piplan.storyJiraLnk} onChange={(e) => this.onchangestoryJiraLnk(e)} />
                </div>
                <div className="form-group">
                  <label htmlFor="desc" className="font-weight-bold">Description</label>
                  <textarea className="form-control" id="desc" rows="3" value={this.state.piplan.description} onChange={(e) => this.onchangedescription(e)}></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="stPoints" className="font-weight-bold">Story Points</label>
                  <input type="text" className="form-control" id="stPoints" placeholder="1,2,3,5,8,13,20" value={this.state.piplan.storyPoints} onChange={(e) => this.onchangestoryPoints(e)} />
                </div>
                <div className="form-group">
                  <label htmlFor="iter" className="font-weight-bold">Iteration</label>
                  <select className="form-control" id="iter" value={this.state.piplan.itrId} onChange={(e) => this.onchangeitrId(e)}>
                    <option value=""></option>
                    {itrList}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="comments" className="font-weight-bold">Comments</label>
                  <textarea className="form-control" id="comments" rows="3" value={this.state.piplan.comments} onChange={(e) => this.onchangecomments(e)}></textarea>
                </div>
              </div>
              <div className="card-footer">
                <button type="button" className="btn btn-success float-right" onClick={() => this.savePlan()}>Save</button>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card">
              <div className="card-body">
                <b>Summary</b>&nbsp;<button className="btn btn-warning btn-sm">refresh</button>
                <ul>
                  <li>ITR1</li>
                  <ul>
                    <li>Capacity</li>
                    <li>Load</li>
                  </ul>
                  <li>ITR2</li>
                  <ul>
                    <li>Capacity</li>
                    <li>Load</li>
                  </ul>
                  <li>ITR3</li>
                  <ul>
                    <li>Capacity</li>
                    <li>Load</li>
                  </ul>
                  <li>ITR4</li>
                  <ul>
                    <li>Capacity</li>
                    <li>Load</li>
                  </ul>
                  <li>ITR5</li>
                  <ul>
                    <li>Capacity</li>
                    <li>Load</li>
                  </ul>
                </ul>
              </div>
            </div>
          </div>
        </div>)
    }
    else {
      return (null)
    }
  }
  return (
    <div className="container-fluid">
      <table className="table">
        <thead>
          <tr className="bg-light">
            <td>Year</td>
            <td>Select Portfolio</td>
            <td>Select Program Increment <br /><small>(select portfolio to load this)</small></td>
            <td>Select Team <br /><small>(select portfolio to load this)</small></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><select className="form-control" id="portfolioList" onChange={(evt) => this.onChangeYear(evt)}>
              <option value=""></option>
              {yearList}
            </select></td>
            <td><select className="form-control" id="portfolioList" onChange={(evt) => this.onChangePortfolio(evt)}>
              <option value=""></option>
              {portfolioList}
            </select></td>
            <td><select className="form-control" id="portfolioList" onChange={(evt) => this.onChangeProgram(evt)}>
              <option value=""></option>
              {programList}
            </select></td>
            <td><select className="form-control" id="portfolioList" onChange={(evt) => this.onChangeTeam(evt)}>
              <option value=""></option>
              {teamList}
            </select></td>
            <td><button className="btn btn-primary mb-2" onClick={() => this.btnLoadPlan()}>Load Plan</button></td>
          </tr>
        </tbody>
      </table>
      {planView()}
      <div className="row">
        Pi Objective
      </div>
    </div>
  );
}
}

export default App;

