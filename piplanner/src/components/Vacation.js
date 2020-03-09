import React, { Component } from 'react';
import '../App.css';
import Loader from './Loader';
export default class Vacation extends Component {
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
        vacation: {},
        member: {
            id: "",
            itrId: "",
            leaveDays: "",
            portfolioId: "",
            programPlanId: "",
            teamId: "",
            teamMemberId: "",
            vacationType: "",
            itrNo: "",
            teamMemberName: ""
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
                    loader:false
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
                    loader:false
                })
            })
            .catch((error) => {
                console.error('Error:', error);
                this.setState({ loader: false })
            });
    }

    onChangeYear(evt) {
        this.setState({ selectedYear: evt.target.value, showPlan: false, selectedProgram: "", selectTeam: "", selectTeamName: "", programs: [], teams: [], portfolio: [] });
        for(let i=0;i<10000;i++){
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
                //console.log('Success:', data);
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
                //console.log('Success:', data);
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
        //console.log(tName);
        this.setState({ selectTeam: evt.target.value, piplan, showPlan: false, selectTeamName: tName.name,vacation:{},member:{} });
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
        //get vacation plan
        fetch(process.env.REACT_APP_LOCAL_DOMAIN+"/api/getVacations?programPlanId=" + this.state.selectedProgram + "&teamId=" + this.state.selectTeam + "&portfolioId=" + this.state.selectedPortfolio)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    vacation: data,
                    loader:false
                })
                this.getCapacity();
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
                    loader:false
                })
                this.refreshLoad()
            })
            .catch((error) => {
                console.error('Error:', error);
                this.setState({ loader: false })
            });
    }
    showSelectedVacation(member) {
        this.setState({ member: member })
    }
    onchangeVac(e) {
        let member = { ...this.state.member };
        member.vacationType = e.target.value;
        this.setState({ member })
    }
    onchangeDays(e) {
        let member = { ...this.state.member };
        member.leaveDays = e.target.value;
        this.setState({ member })
    }
    saveVacation() {
        let member = this.state.member
        console.log(member)
        let self = this
        this.setState({ loader: true })
        fetch('http://localhost:8080/api/saveVacation', {
            method: 'post',
            body: JSON.stringify(member),
            headers: {
                "Content-Type": "application/json"
            },
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            self.btnLoadPlan()
            alert("Saved Succefully")
            self.setState({ member: data,loader:false })
            self.getCapacity();
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
            return (<td className="pb-0" key={itr.id}>Itr{itr.itrNo}<br /><small>{stDate} to {edDate}</small></td>)
        })

        let itrCapacityList = this.state.capacity.map(cp => {
            return (<td className="pt-0" key={cp.itrId}><small>C:&nbsp;{cp.capacity},L:&nbsp;{cp.load},({cp.percent}%)</small></td>)
        })

        let teamMemberVacation = () => {
            let vacations = this.state.vacation
            console.log(vacations)
            let row = []
            let i = 0;
            let x = 10000;
            for (let key in vacations) {
                x++
                let tr = []
                if (vacations.hasOwnProperty(key)) {
                    let iteration = {}
                    iteration = vacations[key]
                    let td = []
                    td.push(<td className="border-right" key={key}>{key}</td>)
                    for (let itr in iteration) {
                        i++
                        if (iteration.hasOwnProperty(itr)) {
                            let member = iteration[itr]
                            td.push(<td className="border-right align-middle text-center" key={i} ><button className="btn btn-sm border-bottom" onClick={() => this.showSelectedVacation(member)}>{member.leaveDays}</button></td>)
                        }
                    }
                    tr.push(<tr key={x}>{td}</tr>)
                }
                row.push(tr)
            }
            console.log(row)
            return row;
        }
        let showSave = () => {
            if (this.state.member.itrNo !== "") {
                return <button type="button" className="btn btn-primary float-right" onClick={() => this.saveVacation()}>Save</button>
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
                        <select className="form-control" id="teamList" onChange={(evt) => this.onChangeTeam(evt)}>
                            <option value=""></option>
                            {teamList}
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={() => this.btnLoadPlan()}><i class="fas fa-truck-loading"></i></button>
                </div>
                <div className="row mt-2">
                    <div className="col-md-6">
                        <table className="table table-striped shadow">
                            <thead >
                                <tr className="darkThead text-white font-weight-bold">
                                    <td className="pb-0"><h1><i>{this.state.selectTeamName}</i></h1></td>
                                    {itrList}
                                </tr>
                                <tr className="darkThead text-white font-weight-bold">
                                    <td className="pt-0"></td>
                                    {itrCapacityList}
                                </tr>
                            </thead>
                            <tbody>
                                {teamMemberVacation()}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-6">
                        <div className="card shadow">
                            <div className="card-header bg-info text-white"><h5>Vacation Plan</h5></div>
                            <div className="card-body">
                                <h5 className="card-title">In Itr : &nbsp;{this.state.member.itrNo}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">For :&nbsp;{this.state.member.teamMemberName}</h6>
                                <div className="form-group">
                                    <label htmlFor="days" className="font-weight-bold">Leave count</label>
                                    <input type="number" className="form-control" id="days" placeholder="no of days" value={this.state.member.leaveDays} onChange={(e) => this.onchangeDays(e)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="vac" className="font-weight-bold">Vacation Type</label>
                                    <select className="form-control" id="vac" value={this.state.member.vacationType} onChange={(e) => this.onchangeVac(e)}>
                                        <option value="VACATION">VACATION</option>
                                        <option value="HOLIDAY">HOLIDAY</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                {showSave()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}