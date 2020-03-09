import React, { Component } from 'react';
import '../App.css';
import Loader from './Loader';

export default class PiCalendar extends Component {
    state = {
        year: "",
        portfolio: [],
        selecedPortfolioId: "",
        selectedPortfolio: {
            id: 0,
            name: ""
        },
        showPlan: false,
        programs: [],
        pSaveBtnTxt: "fas fa-plus",
        iSaveBtnTxt: "fas fa-plus",
        selectedProgram: {
            createdDate: "",
            endDate: "",
            fiYear: "",
            id: 0,
            piNo: 0,
            portfolioId: 0,
            startDate: ""
        },
        selectedProgramNo: 0,
        loader: false,
        showItr: false,
        iterations: [],
        selectedIeration: {
            createdDate: "",
            endDate: "",
            workingDays: "",
            id: 0,
            itrNo: 0,
            programPlanId: 0,
            startDate: ""
        },
        selectedProgramId: 0
    }

    componentDidMount() {
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
        this.setState({ year: evt.target.value, showPlan: false, showItr: false })
    }
    onChangePortfolio(evt) {
        this.setState({ selecedPortfolioId: evt.target.value, showPlan: false, showItr: false });
    }
    loadProgramForPortfolio() {
        let portfolioId = this.state.selecedPortfolioId
        if (this.state.year === "") {
            alert("Please enter the year");
        }
        this.setState({ loader: true })
        fetch(process.env.REACT_APP_LOCAL_DOMAIN+"/api/getProgramCalendar?portfolioId=" + portfolioId + "&fiYear=" + this.state.year)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    programs: data,
                    showPlan: true,
                    loader: false
                })
            })
            .catch((error) => {
                console.error('Error:', error);
                this.setState({ loader: false })
            });
    }

    editProgram(selectedProgram) {
        console.log(selectedProgram);
        this.setState({ pSaveBtnTxt: "fas fa-save", selectedProgram: selectedProgram })
    }

    changePiNo(e) {
        let selectedProgram = { ...this.state.selectedProgram }
        selectedProgram.piNo = e.target.value
        this.setState({ selectedProgram })
    }

    changeStDt(e) {
        let selectedProgram = { ...this.state.selectedProgram }
        selectedProgram.startDate = e.target.value
        this.setState({ selectedProgram })
    }

    changeEdDt(e) {
        let selectedProgram = { ...this.state.selectedProgram }
        selectedProgram.endDate = e.target.value
        this.setState({ selectedProgram })
    }

    createPiCalendar() {
        this.setState({ loader: true })
        let self = this
        fetch(process.env.REACT_APP_LOCAL_DOMAIN+"/api/createProgramCalendar?portfolioId=" + this.state.selecedPortfolioId + "&fiYear=" + this.state.year, {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            self.loadProgramForPortfolio()
            alert("Program created Succefully")
            self.setState({ loader: false })
        });
    }
    saveProgram() {
        let selectedProg = this.state.selectedProgram
        if (selectedProg.piNo === 0) {
            alert("please enter the PI NO");
            return
        }
        if (selectedProg.portfolioId === 0) {
            selectedProg.portfolioId = this.state.selecedPortfolioId
        }
        if (selectedProg.id === 0) {
            selectedProg.fiYear = this.state.year
        }
        if (selectedProg.id === 0) {
            let progAvail = this.state.programs.find(pr => {
                if (pr.piNo == selectedProg.piNo) {
                    return true
                }
            })
            if (typeof progAvail !== "undefined") {
                alert("program Number is already available")
                return
            }
        }
        let self = this
        this.setState({ loader: true })
        fetch('http://localhost:8080/api/saveProgramCalendar', {
            method: 'post',
            body: JSON.stringify(selectedProg),
            headers: {
                "Content-Type": "application/json"
            },
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            self.loadProgramForPortfolio()
            alert("Saved Succefully")
            self.setState({ loader: false })
            self.clearProgram()
        });

    }
    clearProgram() {
        let selectedProgram = { ...this.state.selectedProgram }
        selectedProgram.endDate = ""
        selectedProgram.startDate = ""
        selectedProgram.piNo = 0
        selectedProgram.id = 0
        selectedProgram.portfolioId = 0
        this.setState({ selectedProgram, pSaveBtnTxt: "fas fa-plus" })
    }
    loadIteration(prg) {
        let progId = prg.id;
        console.log(prg)
        this.setState({ loader: true, showItr: false, selectedProgramNo: prg.piNo, selectedProgramId: progId })
        this.fetchItr(progId)
    }
    fetchItr(progId) {
        fetch(process.env.REACT_APP_LOCAL_DOMAIN+"/api/getIterationCalendar?programPlanId=" + progId)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    iterations: data,
                    showItr: true,
                    loader: false
                })
                this.clearItr()
            })
            .catch((error) => {
                console.error('Error:', error);
                this.setState({ loader: false })
            });
    }
    changeitrNo(e) {
        let selectedIeration = { ...this.state.selectedIeration }
        selectedIeration.itrNo = e.target.value
        this.setState({ selectedIeration })
    }
    changeitrStDt(e) {
        let selectedIeration = { ...this.state.selectedIeration }
        selectedIeration.startDate = e.target.value
        this.setState({ selectedIeration })
    }
    changeitrEdDt(e) {
        let selectedIeration = { ...this.state.selectedIeration }
        selectedIeration.endDate = e.target.value
        this.setState({ selectedIeration })
    }
    changeitrWrkDay(e) {
        let selectedIeration = { ...this.state.selectedIeration }
        selectedIeration.workingDays = e.target.value
        this.setState({ selectedIeration })
    }
    clearItr() {
        let selectedIeration = { ...this.state.selectedIeration }
        selectedIeration.endDate = ""
        selectedIeration.startDate = ""
        selectedIeration.itrNo = 0
        selectedIeration.id = 0
        selectedIeration.workingDays = 0
        selectedIeration.programPlanId = 0
        this.setState({ selectedIeration, iSaveBtnTxt: "fas fa-plus" })
    }
    editItr(itr) {
        this.setState({ iSaveBtnTxt: "fas fa-save", selectedIeration: itr })
    }
    saveItr() {
        let itr = this.state.selectedIeration
        console.log(itr)
        if (itr.itrNo === 0) {
            alert("please enter the Itr NO");
            return
        }
        if (itr.programPlanId === 0) {
            itr.programPlanId = this.state.selectedProgramId
        }
        if (itr.id === 0) {
            let progAvail = this.state.iterations.find(pr => {
                if (pr.itrNo == itr.itrNo) {
                    return true
                }
            })
            if (typeof progAvail !== "undefined") {
                alert("Iteration Number is already available")
                return
            }
        }
        let self = this
        this.setState({ loader: true })
        fetch('http://localhost:8080/api/saveIterationCalendar', {
            method: 'post',
            body: JSON.stringify(itr),
            headers: {
                "Content-Type": "application/json"
            },
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            alert("Saved Succefully")
            self.setState({ loader: false })
            self.clearItr()
            self.fetchItr(itr.programPlanId)
        });

    }
    render() {
        let portfolioList = this.state.portfolio.map(po => {
            return (<option key={po.id} value={po.id}>{po.name}</option>)
        })
        let programList = () => {
            if (this.state.showPlan == false) {
                return
            }
            if (this.state.programs.length === 0) {
                return (<button className="btn btn-primary" onClick={() => this.createPiCalendar()}>Create Pi Calendar</button>)
            } else {
                let Rows = this.state.programs.map(prg => {
                    return (
                        <tr key={prg.id}>
                            <td>{prg.piNo}</td>
                            <td>{prg.startDate}</td>
                            <td>{prg.endDate}</td>
                            <td>
                                <div className="btn-group">
                                    <button className="btn btn-sm btn-warning" onClick={() => this.editProgram(prg)}><i className="fas fa-edit"></i></button>
                                    <button className="btn btn-sm btn-info" onClick={() => this.loadIteration(prg)}><i className="fas fa-chevron-right"></i></button>
                                </div>
                            </td>
                        </tr>
                    )
                })
                let thead = () => {
                    return (
                        <thead className="thead-light">
                            <tr className="darkThead text-white font-weight-bold">
                                <td>PI NO</td>
                                <td>Start Date</td>
                                <td>End Date</td>
                                <td>Options</td>
                            </tr>
                            <tr className="bg-info">
                                <td><input type="number" className="form-control form-control-sm" value={this.state.selectedProgram.piNo} onChange={(e) => this.changePiNo(e)} /></td>
                                <td><input type="Date" className="form-control form-control-sm" value={this.state.selectedProgram.startDate ? this.state.selectedProgram.startDate : ""} onChange={(e) => this.changeStDt(e)} /></td>
                                <td><input type="Date" className="form-control form-control-sm" value={this.state.selectedProgram.endDate ? this.state.selectedProgram.endDate : ''} onChange={(e) => this.changeEdDt(e)} /></td>
                                <td colSpan="2">
                                    <div className="btn-group">
                                        <button className="btn btn-success btn-sm" onClick={() => this.saveProgram()}><i className={this.state.pSaveBtnTxt}></i></button>
                                        <button className="btn btn-danger btn-sm" onClick={() => this.clearProgram()}><i className="fas fa-broom"></i></button>
                                    </div>
                                </td>
                            </tr>
                        </thead>
                    )
                }
                let table = <table className="table table-striped">{thead()}<tbody>{Rows}</tbody></table>
                return table;
            }
        }
        let iterations = () => {
            if (!this.state.showItr) {
                return
            } else {
                let Rows = this.state.iterations.map(itr => {
                    return (
                        <tr key={itr.id}>
                            <td>{itr.itrNo}</td>
                            <td>{itr.startDate}</td>
                            <td>{itr.endDate}</td>
                            <td>{itr.workingDays}</td>
                            <td>
                                <div className="btn-group">
                                    <button className="btn btn-sm btn-warning" onClick={() => this.editItr(itr)}><i className="fas fa-edit"></i></button>
                                </div>
                            </td>
                        </tr>
                    )
                })
                let thead = () => {
                    return (
                        <thead className="thead-light">
                            <tr className="darkThead text-white font-weight-bold">
                                <td>Iteration No</td>
                                <td>Start Date</td>
                                <td>End Date</td>
                                <td>Working Days</td>
                                <td>Options</td>
                            </tr>
                            <tr className="bg-info">
                                <td><input type="number" className="form-control form-control-sm" value={this.state.selectedIeration.itrNo} onChange={(e) => this.changeitrNo(e)} /></td>
                                <td><input type="Date" className="form-control form-control-sm" value={this.state.selectedIeration.startDate ? this.state.selectedIeration.startDate : ""} onChange={(e) => this.changeitrStDt(e)} /></td>
                                <td><input type="Date" className="form-control form-control-sm" value={this.state.selectedIeration.endDate ? this.state.selectedIeration.endDate : ''} onChange={(e) => this.changeitrEdDt(e)} /></td>
                                <td><input type="number" className="form-control form-control-sm" value={this.state.selectedIeration.workingDays} onChange={(e) => this.changeitrWrkDay(e)} /></td>
                                <td colSpan="2">
                                    <div className="btn-group">
                                        <button className="btn btn-success btn-sm" onClick={() => this.saveItr()}><i className={this.state.iSaveBtnTxt}></i></button>
                                        <button className="btn btn-danger btn-sm" onClick={() => this.clearItr()}><i className="fas fa-broom"></i></button>
                                    </div>
                                </td>
                            </tr>
                        </thead>
                    )
                }
                let table = <table className="table table-striped">{thead()}<tbody>{Rows}</tbody></table>
                return table;
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
                        <input type="text" className="form-control" id="year" value={this.state.year} onChange={(evt) => this.onChangeYear(evt)} />
                    </div>
                    <div className="m-2 ">
                        <i>Portfolio:&nbsp;</i>
                        <select className="form-control" id="portfolioList" onChange={(evt) => this.onChangePortfolio(evt)}>
                            <option value=""></option>
                            {portfolioList}
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={() => this.loadProgramForPortfolio()}>
                    <i class="fas fa-truck-loading"></i></button>
                </div>
                <div className="row mt-2">
                    <div className="col-md-6 p-1">
                        <div className="card shadow">
                            <div className="card-body">
                                <h5 className="card-title">Programs</h5>
                                {programList()}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 p-1 ">
                        <div className="card shadow">
                            <div className="card-body">
                                <h5 className="card-title">Iterations for selectedProgram : &nbsp;{this.state.selectedProgramNo}</h5>
                                {iterations()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}