import React, { Component } from 'react';
import '../App.css';
import Loader from './Loader';

export default class DependencyConfig extends Component {
    state = {
        piplanners: [],
        portfolio: [],
        selectedPortfolio: "",
        programs: [],
        years: [],
        selectedProgram: "",
        selectedYear: "2020",
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
    getGroupedPlann = () => {
        let piplanners = this.state.piplanners;
        if (piplanners.length > 0) {
            let groups = {};
            piplanners.forEach(pl => {
                groups['backlog'] = []
                if (pl.itrId === 0) {
                    groups['backlog'] = []
                } else {
                    groups[pl.itrId] = []
                }
            })
            piplanners.forEach(pl => {
                if (pl.itrId === 0) {
                    groups['backlog'].push(pl)
                } else {
                    groups[pl.itrId].push(pl)
                }
            })
            //console.log(groups)
            return groups
        }
        return "";
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
        console.log('submitDependency' + this.state.dependencyConfig.year);
        console.log('submitDependency' + this.state.dependencyConfig.portfolioId);
        console.log('submitDependency' + this.state.dependencyConfig.programPlanId);
        console.log('submitDependency' + this.state.dependencyConfig.dependentTeam);
        console.log('submitDependency' + this.state.dependencyConfig.myTeam);
        console.log('submitDependency' + this.state.dependencyConfig.myFeature);
        console.log('submitDependency' + this.state.dependencyConfig.dependentFeature);
        console.log('submitDependency' + this.state.dependencyConfig.myTeamItrId);
        console.log('submitDependency' + this.state.dependencyConfig.dependentTeamItrId);

        let dependencyConf = { ...this.state.dependencyConfig };
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
            alert("Saved Succefully");
            self.setState({ loader: false })
        });


    }
    getDependencyMappings() {
        let self = this
        fetch(process.env.REACT_APP_LOCAL_DOMAIN + "/api/getDependencyMappings?year=" + this.state.selectedYear + "&portolioId=" + this.state.portfolioId + "&programPlanId=" + this.state.selectedProgram)
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
        let dependentTeamList = this.state.dependentTeams.map(t => {
            return (
                <option key={t.id} value={t.id}>{t.name}</option>
            )
        })
        let yearList = this.state.years.map(yr => {
            return (<option key={yr} value={yr}>{yr}</option>)
        })



        let grps = () => {
            let groups = this.getGroupedPlann()
            if (groups !== "") {
                return groups.backlog.map(bk => {
                    let desc = bk.description
                    if (desc !== "" && desc.length > 30)
                        desc = desc.substring(0, 30) + "..."
                    return (<div key={bk.id} className="stories rounded">
                        <p className="features">#{bk.featureId}-#{bk.storyNumber}</p>
                        <p className="desc">{desc}</p>
                        <p className="points">{bk.storyPoints}</p>
                    </div>
                    )
                })

            }
            return
        }

        let iterationsSelectList = this.state.itrs.map(itr => {
            return (<option key={itr.id} value={itr.itrNo}>{itr.itrNo}</option>)
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

                                            <select className="form-control" id="teamList" onChange={(evt) => this.onChangeTeam(evt)}>
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

                                            <select className="form-control" id="myIterations" onChange={(evt) => this.onChangeMyIterations(evt)}>
                                                <option value=""></option>
                                                {iterationsSelectList}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-2 marginAuto "><span className="dependOn" >ON</span></div>
                                    <div className="col-md-5">
                                        <div className="form-group">
                                            <label for="myteam">Dependent Team:</label>
                                            <select className="form-control" id="dependentTeamList" onChange={(evt) => this.onChangeDependentTeam(evt)}>
                                                <option value=""></option>
                                                {dependentTeamList}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label for="myteam">Dependent Feature:</label>
                                            <textarea className="form-control" id="dependentfeature" rows="3" value={this.state.dependencyConfig.dependentFeature}
                                                onChange={(e) => this.onchangeDependentFeature(e)}></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label for="myteam">Dependent Iterations:</label>

                                            <select className="form-control" id="dependentIterations" onChange={(evt) => this.onChangeDependentIterations(evt)}>
                                                <option value=""></option>
                                                {iterationsSelectList}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-primary" onClick={() => this.submitDependency()}><i>Save</i></button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        )
    }
}
