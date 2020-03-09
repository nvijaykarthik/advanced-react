import React, { Component } from 'react';
import '../App.css';
import Loader from './Loader';
class Planner extends Component {
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
    selectTeamName: "",
    itrs: [],
    showPlan: false,
    capacity: [],
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
    },
    programGoal: {
      Id: "",
      portfolioId: "",
      teamId: "",
      programPlanId: "",
      piObjective: "",
      commited: "",
      unCommited: "",
      risk: ""
    },
    loader:false
  }




  componentDidMount() {
    this.getYears()
    this.getPortfolio();
  }
  getYears() {
    this.setState({ loader: true })
    fetch(process.env.REACT_APP_LOCAL_DOMAIN+"/api/getConfiguredYears")
      .then((response) => response.json())
      .then((data) => {
        // //console.log('Success:', data);
        this.setState({
          years: data,
          loader: false
        })
      })
      .catch((error) => {
        console.error('Error:', error);
        this.setState({ loader: false })
      });
  }
  getPortfolio() {
    this.setState({ loader: true })
    fetch(process.env.REACT_APP_LOCAL_DOMAIN+"/api/portfolio")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          portfolio: data,
          loader: false
        })
      })
      .catch((error) => {
        console.error('Error:', error);
        this.setState({ loader: false })
      });
  }

  onChangeYear(evt) {
    this.setState({ selectedYear: evt.target.value, showPlan: false, selectedProgram: "", selectTeam: "", selectTeamName: "", programs: [], teams: [], portfolio: [] });
    for (let i = 0; i < 10000; i++) {
      //introducing sync delay to make the async call work toload the buttons correctly
    }
    this.getPortfolio();
  }
  onChangePortfolio(evt) {
    let piplan = { ...this.state.piplan };
    piplan.portfolioId = evt.target.value;
    this.loadProgramForPortfolio(evt.target.value);
    this.setState({ selectedPortfolio: evt.target.value, piplan, showPlan: false, selectedProgram: "", selectTeam: "" });
    this.loadTeamForPortfolio(evt.target.value);
  }
  loadProgramForPortfolio(portfolioId) {
    if (this.state.selectedYear === "") {
      alert("Please select the year");
    }
    this.setState({ loader: true })
    fetch(process.env.REACT_APP_LOCAL_DOMAIN+"/api/getProgramCalendar?portfolioId=" + portfolioId + "&fiYear=" + this.state.selectedYear)
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        this.setState({
          programs: data,
          loader:false
        })
      })
      .catch((error) => {
        console.error('Error:', error);
        this.setState({ loader: false })
      });
  }
  loadTeamForPortfolio(portfolioId) {
    this.setState({ loader: true })
    fetch(process.env.REACT_APP_LOCAL_DOMAIN+"/api/teamsForPortfolio?portfolioId=" + portfolioId)
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        this.setState({
          teams: data,
          loader:false
        })
      })
      .catch((error) => {
        console.error('Error:', error);
        this.setState({ loader: false })
      });
  }
  loadIterationForProgram(prgId) {
    this.setState({ loader: true })
    fetch(process.env.REACT_APP_LOCAL_DOMAIN+"/api/getIterationCalendar?programPlanId=" + prgId)
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        this.setState({
          itrs: data,
          loader:false
        })
      })
      .catch((error) => {
        console.error('Error:', error);
        this.setState({ loader: false })
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
    let tName = this.state.teams.find(t => {
      return t.id == evt.target.value
    })
    this.setState({ selectTeam: evt.target.value, piplan, showPlan: false, selectTeamName: tName.name });
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
    this.setState({ loader: true })
    fetch(process.env.REACT_APP_LOCAL_DOMAIN+"/api/getPiPlanners?programId=" + this.state.selectedProgram + "&teamId=" + this.state.selectTeam)
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        this.setState({
          piplanners: data,
          showPlan: true,
          loader:false
        })
      })
      .catch((error) => {
        console.error('Error:', error);
        this.setState({ loader: false })
      });
      this.setState({ loader: true })
    fetch(process.env.REACT_APP_LOCAL_DOMAIN+"/api/getCapacity?programPlanId=" + this.state.selectedProgram + "&teamId=" + this.state.selectTeam)
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        this.setState({
          capacity: data,
          loader:false
        })
      })
      .catch((error) => {
        console.error('Error:', error);
        this.setState({ loader: false })
      });
      this.setState({ loader: true })
    fetch(process.env.REACT_APP_LOCAL_DOMAIN+"/api/getProgramGoalForTeam?programId=" + this.state.selectedProgram + "&teamId=" + this.state.selectTeam)
      .then((response) => response.json())
      .then((data) => {
        console.log('goal Success:', data);
        if (data.portfolioId === null) {
          data.piObjective = ""
          data.commited = ""
          data.unCommited = ""
          data.risk = ""
          data.portfolioId = this.state.selectedPortfolio
        }
        this.setState({
          programGoal: data,
          loader:false
        })
      })
      .catch((error) => {
        console.error('Error:', error);
        this.setState({ loader:  false})
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
    let self = this
    this.setState({ loader: true })
    fetch('http://localhost:8080/api/savePiPlanner', {
      method: 'post',
      body: JSON.stringify(piplan),
      headers: {
        "Content-Type": "application/json"
      },
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      self.editPlan(data)
      self.btnLoadPlan()
      alert("Saved Succefully")
      self.refreshLoad()
      self.setState({ loader: false })
    });
  }

  editPlan(pi) {
    this.setState({
      piplan: {
        comments: pi.comments,
        description: pi.description,
        fJiraLnk: pi.fJiraLnk,
        featureId: pi.featureId,
        id: pi.id,
        itrId: pi.itrId,
        portfolioId: this.state.selectedPortfolio,
        programPlanId: this.state.selectedProgram,
        storyJiraLnk: pi.storyJiraLnk,
        storyNumber: pi.storyNumber,
        storyPoints: pi.storyPoints,
        storyPointsDev: pi.storyPointsDev,
        storyPointsTst: pi.storyPointsTst,
        teamId: this.state.selectTeam
      }
    })
  }

  refreshLoad() {
    let itrLoad = {}
    this.state.piplanners.forEach(pl => {
      if (typeof itrLoad[pl.itrId] === "undefined") {
        itrLoad[pl.itrId] = +pl.storyPoints
      } else {
        let currentStPt = itrLoad[pl.itrId]
        let newStpoint = +currentStPt + +pl.storyPoints
        itrLoad[pl.itrId] = newStpoint
      }
    });

    let loadedCp = this.state.capacity
    loadedCp.forEach(cp => {
      let load = itrLoad[cp.itrId]
      cp.load = load
      let per = ((cp.load / cp.capacity) * 100)
      console.log(per)
      if (!isNaN(per)) {
        cp['percent'] = per.toFixed(2)
      } else {
        cp['percent'] = 0
      }
    });
    console.log(itrLoad)
    console.log(loadedCp)
    this.setState({ capacity: loadedCp })
  }

  onchangePiObj(e) {
    let pigoal = { ...this.state.programGoal };
    pigoal.piObjective = e.target.value;
    this.setState({ programGoal: pigoal })
  }

  onchangeCommited(e) {
    let pigoal = { ...this.state.programGoal };
    pigoal.commited = e.target.value;
    this.setState({ programGoal: pigoal })
  }

  onchangeUncommited(e) {
    let pigoal = { ...this.state.programGoal };
    pigoal.unCommited = e.target.value;
    this.setState({ programGoal: pigoal })
  }

  onchangeRisk(e) {
    let programGoal = { ...this.state.programGoal };
    programGoal.risk = e.target.value;
    this.setState({ programGoal })
  }

  saveGoals() {
    let programGoal = this.state.programGoal
    console.log(programGoal)
    if (programGoal.portfolioId === "") {
      alert("Portfolio is empty")
      return
    }
    if (programGoal.teamId === "") {
      alert("Team is empty")
      return
    }
    if (programGoal.programPlanId === "") {
      alert("Program is empty")
      return
    }

    let self = this
    this.setState({ loader: true })
    fetch('http://localhost:8080/api/saveProgramGoal', {
      method: 'post',
      body: JSON.stringify(programGoal),
      headers: {
        "Content-Type": "application/json"
      },
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      self.setState({ programGoal,loader:false })
      alert("Saved Succefully")
    });
  }


  render() {
    let piList = this.state.piplanners.map(pi => {
      let it = this.state.itrs.find(itr => itr.id === pi.itrId)
      let itNo = ""
      if (typeof it != "undefined") {
        itNo = it.itrNo
      }
      return (
        <tr key={pi.id}>
          <td>{pi.featureId}</td>
          <td>{pi.storyNumber}</td>
          <td>{pi.description}</td>
          <td>{pi.storyPoints}</td>
          <td>{itNo}</td>
          <td>{pi.comments}</td>
          <td><button className="btn btn-sm btn-warning" onClick={() => this.editPlan(pi)} data-toggle="modal" data-target="#featurePopup"><i className="fas fa-edit"></i>&nbsp;edit</button></td>
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

    let itrCapacityList = this.state.capacity.map(cp => {
      return (<span key={cp.itrId}><li className="firstchild ">ITR{cp.itrNo}&nbsp;({cp.percent}%)</li><ul className="subSummary"><li>Capacity:&nbsp;{cp.capacity}</li><li>Load:&nbsp;{cp.load}</li></ul></span>)
    })
    let planView = () => {
      if (this.state.showPlan === true) {
        return (
          <div className="row">
            <div className="col-md-10">
              <div className="card shadow">
                <div className="card-body">
                  <div className="clearfix"><span className="teamname">{this.state.selectTeamName}</span>
                    <button type="button" className="btn btn-primary btn-sm float-right mb-1" onClick={() => this.btnNewPlan()} data-toggle="modal" data-target="#featurePopup"><i class="fas fa-plus"></i>&nbsp;New Feature</button>
                  </div>
                  <table className="table table-bordered table-striped">
                    <thead >
                      <tr className="darkThead text-white">
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
            <div className="col-md-2">
              <div className="card shadow">
                <div className="card-body">
                  <b>Summary</b>&nbsp;<button className="btn btn-warning btn-sm" onClick={() => this.refreshLoad()}><i class="fas fa-sync-alt"></i>&nbsp;refresh</button>
                  <ul className="summaryList">
                    {itrCapacityList}
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

    let piGoal = () => {
      if (this.state.showPlan === true) {
        return (<div className="row">
          <div className="col-md-4">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">PI Ojective </div>
              <div className="card-body">
                <textarea className="form-control" id="piobj" rows="10" value={this.state.programGoal.piObjective}
                  onChange={(e) => this.onchangePiObj(e)}></textarea>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow">
              <div className="card-header bg-success text-white">Commited </div>
              <div className="card-body">
                <textarea className="form-control" id="commited" rows="5" value={this.state.programGoal.commited}
                  onChange={(e) => this.onchangeCommited(e)}></textarea>
              </div>
            </div>
            <div className="card  mt-2 shadow">
              <div className="card-header bg-secondary text-white">UnCommited </div>
              <div className="card-body">
                <textarea className="form-control" id="uncommited" rows="5" value={this.state.programGoal.unCommited}
                  onChange={(e) => this.onchangeUncommited(e)}></textarea>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow">
              <div className="card-header bg-danger text-white">Risk </div>
              <div className="card-body">
                <textarea className="form-control" id="risk" rows="10" value={this.state.programGoal.risk}
                  onChange={(e) => this.onchangeRisk(e)}></textarea>
              </div>
            </div>
          </div>
        </div>)
      } else {
        return (null)
      }
    }
    let saveGoalBtn = () => {
      if (this.state.showPlan === true) {
        return (<button className="btn btn-primary float-right" onClick={() => this.saveGoals()}><i class="fas fa-save"></i>&nbsp;Save Goals</button>)
      } else {
        return (null)
      }
    }

    let loader = () => {
      if (this.state.loader) {
        return (<Loader />)
      }
    }
    return (
      <div className="container-fluid">
        {loader()}
        <div className="form-inline border-bottom">
          <div className="m-2 ">
            <i>Year:&nbsp;</i>
            <select className="form-control" id="portfolioList" onChange={(evt) => this.onChangeYear(evt)}>
              <option value=""></option>
              {yearList}
            </select>
          </div>
          <div className="m-2 ">
            <i>Portfolio:&nbsp;</i>
            <select className="form-control" id="portfolioList" onChange={(evt) => this.onChangePortfolio(evt)}>
              <option value=""></option>
              {portfolioList}
            </select>
          </div>
          <div className="m-2 ">
            <i>Program:&nbsp;</i>
            <select className="form-control" id="portfolioList" onChange={(evt) => this.onChangeProgram(evt)}>
              <option value=""></option>
              {programList}
            </select>
          </div>
          <div className="m-2 ">
            <i>Team:&nbsp;</i>
            <select className="form-control" id="portfolioList" onChange={(evt) => this.onChangeTeam(evt)}>
              <option value=""></option>
              {teamList}
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => this.btnLoadPlan()}><i class="fas fa-truck-loading"></i></button>
          <a href="#plan" className="btn btn-sm ml-1 border-bottom">Plan</a>
          <a href="#goal" className="btn btn-sm ml-1 border-bottom">Goal</a>
        </div>

        <h3 id="plan">Plan <a href="#goal" className="btn btn-sm ml-1 border-bottom">Goal</a></h3>
        {planView()}
        <hr />
        <div className="clearfix" id="goal">
          <span style={{ fontSize: "1.75rem", fontWeight: 500 }}>Goals <a href="#plan" className="btn btn-sm ml-1 border-bottom">Plan</a></span>
          {saveGoalBtn()}
        </div>
        {piGoal()}

        <div className="modal fade" id="featurePopup" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalCenterTitle"><strong>Edit/New Features</strong></h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
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
                  <input type="number" className="form-control" id="stPoints" placeholder="1,2,3,5,8,13,20" value={this.state.piplan.storyPoints} onChange={(e) => this.onchangestoryPoints(e)} />
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
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal"><i class="fas fa-times"></i>&nbsp;Close</button>
                <button type="button" className="btn btn-success float-right" onClick={() => this.savePlan()}><i class="fas fa-save"></i>&nbsp;Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Planner;

