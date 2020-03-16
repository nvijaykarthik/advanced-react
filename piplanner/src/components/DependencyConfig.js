import React, { Component } from 'react';
import '../App.css';
import Loader from './Loader';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

export default class DependencyConfig extends Component {
    state = {
        piplanners: [],
        portfolio: [],
        selectedPortfolio: 0,
        programs: [],
        years: [],
        selectedProgram: 0,
        selectedYear: 0,
        teams: [],
        dependentTeams: [],
        selectTeam: "",
        selectDependentTeam: "",
        selectTeamName: "",
        selectDependentTeamName: "",
        dependentTeamStory: "",
        dependencyDescription: "",
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
        dependencyConfig: {
            year: 0,
            portfolioId: 0,
            portfolioName: "",
            programPlanId: 0,
            myTeam: "",
            myTeamId: 0,
            myFeature: "",
            myTeamItrId: 0,
            dependentTeam: "",
            dependentTeamId: 0,
            dependentFeature: "",
            dependentTeamItrId: 0
        },

        dependencyConfigs: [],

        loader: false
    }

    //var Confirm = require('react-confirm-bootstrap');

    componentDidMount() {
        this.getYears()
        this.getPortfolio();
    }
    getYears() {
        this.setState({ loader: true })
        fetch(process.env.REACT_APP_LOCAL_DOMAIN + "/api/getConfiguredYears")
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
        fetch(process.env.REACT_APP_LOCAL_DOMAIN + "/api/portfolio")
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
        let dependencyConf = { ...this.state.dependencyConfig };
        dependencyConf.year = evt.target.value;
        this.setState({ dependencyConfig: dependencyConf });
        this.getPortfolio();
    }
    onChangePortfolio(evt) {
        let piplan = { ...this.state.piplan };
        piplan.portfolioId = evt.target.value;
        let dependencyConf = { ...this.state.dependencyConfig };
        dependencyConf.portfolioId = evt.target.value;
        this.setState({ dependencyConfig: dependencyConf });
        this.loadProgramForPortfolio(evt.target.value);
        this.setState({ selectedPortfolio: evt.target.value, piplan, showPlan: false, selectedProgram: "", selectTeam: "", selectTeamName: "" });
        this.loadTeamForPortfolio(evt.target.value);
    }
    loadProgramForPortfolio(portfolioId) {
        if (this.state.selectedYear === "") {
            alert("Please select the year");
        }
        this.setState({ loader: true })
        fetch(process.env.REACT_APP_LOCAL_DOMAIN + "/api/getProgramCalendar?portfolioId=" + portfolioId + "&fiYear=" + this.state.selectedYear)
            .then((response) => response.json())
            .then((data) => {
                //console.log('Success:', data);
                this.setState({
                    programs: data,
                    loader: false
                })
            })
            .catch((error) => {
                console.error('Error:', error);
                this.setState({ loader: false })
            });
    }
    loadTeamForPortfolio(portfolioId) {
        this.setState({ loader: true })
        fetch(process.env.REACT_APP_LOCAL_DOMAIN + "/api/teamsForPortfolio?portfolioId=" + portfolioId)
            .then((response) => response.json())
            .then((data) => {
                //console.log('Success:', data);
                this.setState({
                    teams: data,
                    loader: false
                })
            })
            .catch((error) => {
                console.error('Error:', error);
                this.setState({ loader: false })
            });
    }
    loadIterationForProgram(prgId) {
        this.setState({ loader: true })
        fetch(process.env.REACT_APP_LOCAL_DOMAIN + "/api/getIterationCalendar?programPlanId=" + prgId)
            .then((response) => response.json())
            .then((data) => {
                //console.log('Success:', data);
                this.setState({
                    itrs: data,
                    loader: false
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
        let dependencyConf = { ...this.state.dependencyConfig };
        dependencyConf.programPlanId = evt.target.value;
        this.setState({ dependencyConfig: dependencyConf });
        this.setState({ selectedProgram: evt.target.value, piplan, showPlan: false });
        this.loadIterationForProgram(evt.target.value)
    }
    onChangeTeam(evt) {
        let piplan = { ...this.state.piplan };
        piplan.teamId = evt.target.value;
        let dependencyConf = { ...this.state.dependencyConfig };
        dependencyConf.myTeamId = evt.target.value;

        let tName = this.state.teams.find(t => {
            console.log(t.id + "=" + evt.target.value)
            return t.id == evt.target.value

        })
        this.reloadDependentTeamList();
        console.log(tName);
        dependencyConf.myTeam = tName.name;
        this.setState({ dependencyConfig: dependencyConf });

        this.setState({ selectTeam: evt.target.value, piplan, showPlan: false, selectTeamName: tName.name });
    }

    onChangeDependentTeam(evt) {
        let dependencyConf = { ...this.state.dependencyConfig };
        dependencyConf.dependentTeamId = evt.target.value;

        let tName = this.state.teams.find(t => {
            console.log(t.id + "=" + evt.target.value)
            return t.id == evt.target.value

        })
        console.log(tName);
        dependencyConf.dependentTeam = tName.name;
        this.setState({ dependencyConfig: dependencyConf });
        this.setState({ selectDependentTeam: evt.target.value, selectDependentTeamName: tName.name });
    }



    removeSelectedTeamFromDependentTeamList(selectTeam) {

        var index = this.state.dependentTeams.indexOf(selectTeam);
        delete this.state.dependentTeams[index];

    }

    reloadDependentTeamList() {
        if (this.state.teams != null && this.state.teams.length > 0) {
            console.log('reloadDependentTeamList' + this.state.selectTeam);
            this.state.dependentTeams = [...this.state.teams];
            // console.log('reloadDependentTeamList before splice' + this.state.dependentTeams);
            // this.state.dependentTeams = this.state.dependentTeams.splice(this.state.dependentTeams.indexOf(this.state.selectTeam), 1);
            //  console.log('reloadDependentTeamList after splice' + this.state.dependentTeams);
            //this.state.dependentTeams = [...this.state.dependentTeams].splice(this.state.selectTeam,1);
        }
    }

    resetDependentTeamList() {
        this.state.dependentTeams = [];

    }

    getCapacity() {
        this.setState({ loader: true })
        fetch(process.env.REACT_APP_LOCAL_DOMAIN + "/api/getCapacity?programPlanId=" + this.state.selectedProgram + "&teamId=" + this.state.selectTeam)
            .then((response) => response.json())
            .then((data) => {
                //console.log('Success:', data);
                this.setState({
                    capacity: data,
                    loader: false
                })
                this.refreshLoad()
            })
            .catch((error) => {
                console.error('Error:', error);
                this.setState({ loader: false })
            });
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
            if (!isNaN(load)) {
                cp.load = load
            } else {
                cp.load = 0
            }
            let per = ((cp.load / cp.capacity) * 100)
            if (!isNaN(per)) {
                cp['percent'] = per.toFixed(2)
            } else {
                cp['percent'] = 0
            }
        });
        this.setState({ capacity: loadedCp })
    }


    onchangeMyFeature(e) {
        let dependencyConf = { ...this.state.dependencyConfig };
        dependencyConf.myFeature = e.target.value;
        this.setState({ dependencyConfig: dependencyConf });
    }
    onchangeDependentFeature(e) {
        let dependencyConf = { ...this.state.dependencyConfig };
        dependencyConf.dependentFeature = e.target.value;
        this.setState({ dependencyConfig: dependencyConf });
    }

    onChangeMyIterations(e) {
        // console.log("onChangeMyIterations",e.target.value);
        let dependencyConf = { ...this.state.dependencyConfig };
        //let itrId = parseInt(e.target.value);
        //console.log("onChangeMyIterations",itrId);
        dependencyConf.myTeamItrId = e.target.value;
        this.setState({ dependencyConfig: dependencyConf });
    }

    onChangeDependentIterations(e) {
        let dependencyConf = { ...this.state.dependencyConfig };
        dependencyConf.dependentTeamItrId = e.target.value;
        this.setState({ dependencyConfig: dependencyConf });
    }

    submitDependency() {


        let dependencyConf = { ...this.state.dependencyConfig };
        dependencyConf.year = this.state.selectedYear;
        dependencyConf.portfolioId = this.state.selectedPortfolio;
        dependencyConf.programPlanId = this.state.selectedProgram;


        if (dependencyConf.dependentTeam === dependencyConf.myTeam) {
            alert("Dependent team cannnot be the same");
        }
        let self = this
        this.setState({ loader: true })
        fetch(process.env.REACT_APP_LOCAL_DOMAIN + '/api/savePiDependencyMapping', {
            method: 'post',
            body: JSON.stringify(dependencyConf),
            headers: {
                "Content-Type": "application/json"
            },
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            alert("Saved Succesfully");
            self.setState({ dependencyConfig: data })
            self.getDependencyMappings();
            self.setState({ loader: false })
        });


    }
    getDependencyMappings() {
        let self = this
        console.log('getDependencyMappings--' + "/api/getDependencyMappings?year=" + this.state.selectedYear + "&portolioId=" + this.state.selectedPortfolio + "&programPlanId=" + this.state.selectedProgram);
        fetch(process.env.REACT_APP_LOCAL_DOMAIN + "/api/getDependencyMappings?year=" + this.state.selectedYear + "&portolioId=" + this.state.selectedPortfolio + "&programPlanId=" + this.state.selectedProgram)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    dependencyConfigs: data,

                    loader: false
                });

            })
            .catch((error) => {
                console.error('Error:', error);
                this.setState({ loader: false })
            });


    }

    createNewDependency() {
        let dependencyConf = { ...this.state.dependencyConfig };
        dependencyConf.id = 0;
        dependencyConf.year = 0;
        dependencyConf.portfolioId = 0;
        dependencyConf.portfolioName = "";
        dependencyConf.programPlanId = 0;
        dependencyConf.myTeam = "";
        dependencyConf.myTeamId = 0;
        dependencyConf.myFeature = "";
        dependencyConf.myTeamItrId = 0;
        dependencyConf.dependentTeam = "";
        dependencyConf.dependentTeamId = 0;
        dependencyConf.dependentFeature = "";
        dependencyConf.dependentTeamItrId = 0;
        this.setState({ dependencyConfig: dependencyConf });
    }

    editDependencyConf(selectedDependencyConfig, evt) {
        console.log('editDependencyConf--', selectedDependencyConfig.dependentTeam);
        console.log('editDependencyConf--', selectedDependencyConfig.dependentTeamId);
        let selectedDependencyConf = { ...this.state.dependencyConfig };
        selectedDependencyConf.year = this.state.selectedYear;
        selectedDependencyConf.portfolioName = this.state.selectedPortfolio;
        selectedDependencyConf.programPlanId = this.state.selectedProgram;
        selectedDependencyConf.id = selectedDependencyConfig.id;
        selectedDependencyConf.myTeam = selectedDependencyConfig.myTeam;
        selectedDependencyConf.myTeamId = selectedDependencyConfig.myTeamId;
        selectedDependencyConf.myFeature = selectedDependencyConfig.myFeature;
        selectedDependencyConf.myTeamItrId = selectedDependencyConfig.myTeamItrId;
        selectedDependencyConf.dependentTeam = selectedDependencyConfig.dependentTeam;
        selectedDependencyConf.dependentTeamId = selectedDependencyConfig.dependentTeamId;
        selectedDependencyConf.dependentFeature = selectedDependencyConfig.dependentFeature;
        selectedDependencyConf.dependentTeamItrId = selectedDependencyConfig.dependentTeamItrId;

        this.setState({ dependencyConfig: selectedDependencyConf });

    }

     deleteDependencyConf(selectedDependencyConfig) {
        console.log('deleteDependencyConf--', selectedDependencyConfig.id);
        
        let c=window.confirm("Do you want to delete?");
        if(c){
            console.log('Confirm--');
             fetch(process.env.REACT_APP_LOCAL_DOMAIN + "/api/removeDependencyMapping?id=" + selectedDependencyConfig.id)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    loader: false
                });
                this.getDependencyMappings();
            })
            .catch((error) => {
                console.error('Error:', error);
                this.setState({ loader: false })
            });
        }
        else{
           console.log('NoConfirm--');
        }
    }

    
        
    



    render() {
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





        let iterationsSelectList = this.state.itrs.map(itr => {
            return (<option key={itr.id} value={itr.itrNo}>{itr.itrNo}</option>)
        })

        let listdependencyConfigs = this.state.dependencyConfigs.map(dependencyConf => {
            return (
                <tr key={dependencyConf.id}>
                    <td>{dependencyConf.myTeam}</td>
                    <td>{dependencyConf.myFeature}</td>
                    <td className="border-right">{dependencyConf.myTeamItrId}</td>
                    <td>{dependencyConf.dependentTeam}</td>
                    <td>{dependencyConf.dependentFeature}</td>
                    <td>{dependencyConf.dependentTeamItrId}</td>
                    <td>
                        <div className="btn-group">
                            <button className="btn btn-sm btn-info" onClick={(evt) => this.editDependencyConf(dependencyConf, evt)}><i className="fas fa-edit"></i></button>
                        </div>
                        <div className="btn-group">
                            <button className="btn btn-sm btn-warning" onClick={(evt) => this.deleteDependencyConf(dependencyConf)}><i className="fa fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            )
        })



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
                        <select className="form-control" id="year" onChange={(evt) => this.onChangeYear(evt)}>
                            <option value=""></option>
                            {yearList}
                        </select>
                    </div>
                    <div className="m-2 ">
                        <i>Portfolio:&nbsp;</i>
                        <select className="form-control" id="portfolio" onChange={(evt) => this.onChangePortfolio(evt)}>
                            <option value=""></option>
                            {portfolioList}
                        </select>
                    </div>
                    <div className="m-2 ">
                        <i>Program:&nbsp;</i>
                        <select className="form-control" id="program" onChange={(evt) => this.onChangeProgram(evt)}>
                            <option value=""></option>
                            {programList}
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={() => this.getDependencyMappings()}><i>Load</i></button>
                </div>

                <div className="row">
                    <div className="col-md-6 p-1">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Dependency Mappings</h5>
                                <table className="table">
                                    <thead className="thead-light">
                                        <tr className="darkThead text-white font-weight-bold">
                                            <td>My Team</td>
                                            <td>My Feature</td>
                                            <td className="border-right">ItrNo</td>
                                            <td>Dependent Team</td>
                                            <td>Dependent Feature</td>
                                            <td>ItrNo</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listdependencyConfigs}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 p-1">

                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Selected Dependency Details</h5>
                                <div className="row">
                                    <div className="col-md-5">
                                        <div className="form-group">
                                            <label for="myteam">My Team:</label>
                                            <select className="form-control" id="myTeamList" value={this.state.dependencyConfig.myTeamId} onChange={(evt) => this.onChangeTeam(evt)}>
                                                <option value=""></option>
                                                {teamList}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label for="myteam">My Feature:</label>

                                            <textarea className="form-control" id="myfeature" rows="3" value={this.state.dependencyConfig.myFeature}
                                                onChange={(e) => this.onchangeMyFeature(e)}></textarea>

                                        </div>
                                        <div className="form-group">
                                            <label for="myteam">Iterations:</label>

                                            <select className="form-control" id="myIterations" value={this.state.dependencyConfig.myTeamItrId} onChange={(evt) => this.onChangeMyIterations(evt)}>
                                                <option value=""></option>
                                                {iterationsSelectList}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-2 marginAuto "><span className="dependOn" >ON</span></div>
                                    <div className="col-md-5">
                                        <div className="form-group">
                                            <label for="myteam">Dependent Team:</label>
                                            <select className="form-control" id="dependentTeamList" value={this.state.dependencyConfig.dependentTeamId} onChange={(evt) => this.onChangeDependentTeam(evt)}>
                                                <option value=""></option>
                                                {teamList}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label for="myteam">Dependent Feature:</label>
                                            <textarea className="form-control" id="dependentfeature" rows="3" value={this.state.dependencyConfig.dependentFeature}
                                                onChange={(e) => this.onchangeDependentFeature(e)}></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label for="myteam">Dependent Iterations:</label>

                                            <select className="form-control" id="dependentIterations" value={this.state.dependencyConfig.dependentTeamItrId} onChange={(evt) => this.onChangeDependentIterations(evt)}>
                                                <option value=""></option>
                                                {iterationsSelectList}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-1">
                                        <button className="btn btn-primary" onClick={() => this.submitDependency()}><i>Save</i></button>
                                    </div>
                                    <div className="col-md-1">
                                        <button className="btn btn-primary" onClick={() => this.createNewDependency()}><i>New</i></button>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        )
    }
}
