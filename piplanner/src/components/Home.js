import React, { Component } from 'react';
import '../App.css';
import Loader from './Loader';

export default class Home extends Component {
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
        loader: false
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
        this.setState({ selectedPortfolio: evt.target.value, piplan, showPlan: false, selectedProgram: "", selectTeam: "", selectTeamName: "" });
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
        fetch(process.env.REACT_APP_LOCAL_DOMAIN+"/api/teamsForPortfolio?portfolioId=" + portfolioId)
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
        fetch(process.env.REACT_APP_LOCAL_DOMAIN+"/api/getIterationCalendar?programPlanId=" + prgId)
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
        this.setState({ selectedProgram: evt.target.value, piplan, showPlan: false });
        this.loadIterationForProgram(evt.target.value)
    }
    onChangeTeam(evt) {
        let piplan = { ...this.state.piplan };
        piplan.teamId = evt.target.value;
        let tName = this.state.teams.find(t => {
            console.log(t.id + "=" + evt.target.value)
            return t.id == evt.target.value

        })
        console.log(tName);
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
                //console.log('Success:', data);
                this.setState({
                    piplanners: data,
                    showPlan: true,
                    loader: false
                })
                this.getCapacity()
            })
            .catch((error) => {
                console.error('Error:', error);
                this.setState({ loader: false })
            });


        this.setState({ loader: true })
        fetch(process.env.REACT_APP_LOCAL_DOMAIN+"/api/getProgramGoalForTeam?programId=" + this.state.selectedProgram + "&teamId=" + this.state.selectTeam)
            .then((response) => response.json())
            .then((data) => {
                //console.log('goal Success:', data);
                if (data.portfolioId === null) {
                    data.piObjective = ""
                    data.commited = ""
                    data.unCommited = ""
                    data.risk = ""
                    data.portfolioId = this.state.selectedPortfolio
                }
                this.setState({
                    programGoal: data,
                    loader: false
                })
            })
            .catch((error) => {
                console.error('Error:', error);
                this.setState({ loader: false })
            });
    }
    getCapacity() {
        this.setState({ loader: true })
        fetch(process.env.REACT_APP_LOCAL_DOMAIN+"/api/getCapacity?programPlanId=" + this.state.selectedProgram + "&teamId=" + this.state.selectTeam)
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
                    groups[pl.itrNo] = []
                }
            })
            piplanners.forEach(pl => {
                if (pl.itrId === 0) {
                    groups['backlog'].push(pl)
                } else {
                    groups[pl.itrNo].push(pl)
                }
            })
            //console.log(groups)
            return groups
        }
        return "";
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
        let itrList = this.state.itrs.map(itr => {
            let stDate = ""
            if (null !== itr.startDate) {
                let stDt = itr.startDate.split("-")
                let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jly", "Aug", "Sep", "Oct", "Nov", "Dec"];
                let stMn = months[Number(stDt[1]) - 1]
                stDate = stDt[2] + "/" + stMn;
            }
            let edDate = ""
            if (null !== itr.endDate) {
                let stDt = itr.endDate.split("-")
                let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jly", "Aug", "Sep", "Oct", "Nov", "Dec"];
                let stMn = months[Number(stDt[1]) - 1]
                edDate = stDt[2] + "/" + stMn;
            }
            return (<td className="pb-0 darkThead text-white" key={itr.id}>Itr{itr.itrNo}<br /><small>{stDate} to {edDate}</small></td>)
        })

        let itrCapacityList = this.state.capacity.map(cp => {
            return (<td className="pt-0  darkThead text-white" key={cp.itrId}><small>C:&nbsp;{cp.capacity},L:&nbsp;{cp.load},({cp.percent}%)</small></td>)
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
        let itrGrps = () => {
            let itrMap = {}
            this.state.itrs.forEach(itr => {
                itrMap[itr.itrNo] = <td className="border-right" key={itr.id}></td>
            })
            console.log(itrMap);
            let groups = this.getGroupedPlann()
            console.log(groups);
            if (groups !== "") {
                let view = []
                let i = 0
                for (let key in groups) {
                    if (groups.hasOwnProperty(key) && key !== 'backlog') {
                        var val = groups[key];
                        let ret = val.map(bk => {
                            let desc = bk.description
                            if (desc !== "" && desc.length > 50)
                                desc = desc.substring(0, 50) + "..."
                            return (<div key={bk.id} title={bk.itrNo} className="stories rounded shadow">
                                <p className="features">#{bk.featureId}-#{bk.storyNumber}</p>
                                <p className="desc">{desc}</p>
                                <p className="points"><span className="numberCircle bg-info text-white" title="Iteration Number">{bk.itrNo}</span>&nbsp;<span className="numberCircle" title="Story Points">{bk.storyPoints}</span></p>
                            </div>
                            )
                        })
                        i++;
                        view[key] = <td key={i} className="border-right">{ret}</td>
                    }
                }
                for (let key in itrMap) {
                    if (itrMap.hasOwnProperty(key)) {
                        let v=view[key]
                        let itrv=itrMap[key]
                        console.log(itrv)
                        if(typeof v ==='undefined'){
                            v=itrMap[key]
                           view[key]=v
                        }
                    }
                }
                console.log(view)               
                return view;
            }
            return
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
                        <select className="form-control" id="teamList" onChange={(evt) => this.onChangeTeam(evt)}>
                            <option value=""></option>
                            {teamList}
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={() => this.btnLoadPlan()}><i className="fas fa-truck-loading"></i></button>
                </div>
                <div className="row mt-2">
                    <div className="col-md-12">
                        <table className="table table-borderless">
                            <thead>
                                <tr>
                                    <td className="pb-0 darkThead text-white"><h1><i>{this.state.selectTeamName}</i></h1></td>
                                    {itrList}
                                </tr>
                                <tr>
                                    <td className="pt-0 darkThead text-white"></td>
                                    {itrCapacityList}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border-right">
                                        <div className="piObj p-2 m-2 shadow">
                                            <i>Objective</i><br />
                                            <textarea rows="5" className="viewOnlyTxtArea form-control" value={this.state.programGoal.piObjective}/>
                                            
                                        </div>
                                        <div className="piCom p-2 m-2 shadow">
                                            <i>Commited</i><br />
                                            <textarea rows="5" className="viewOnlyTxtArea form-control" value={this.state.programGoal.commited}/>
                                        </div>
                                        <div className="piUncom p-2 m-2 shadow">
                                            <i>uncommited</i><br />
                                            <textarea rows="5" className="viewOnlyTxtArea form-control" value={this.state.programGoal.unCommited}/>
                                        </div>
                                        <div className="piRis p-2 m-2 shadow">
                                            <i>risk</i><br />
                                            <textarea rows="5" className="viewOnlyTxtArea form-control" value={this.state.programGoal.risk}/>
                                        </div>
                                        <div className="piBklog p-2 mt-3 shadow">
                                            <i>backlog</i><br />
                                            {grps()}
                                        </div>
                                    </td>

                                    {itrGrps()}

                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}
