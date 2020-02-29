import React, { Component } from 'react';
import Loader from './Loader'
import '../App.css';

export default class PiCalendar extends Component {
    state = {
        year: "",
        portfolio: [],
        selecedPortfolioId: "",
        showPlan: false,
        programs: [],
        pSaveBtnTxt: "fas fa-plus",
        selectedProgram: {
            createdDate: "",
            endDate: "",
            fiYear: "",
            id: 0,
            piNo: 0,
            portfolioId: 0,
            startDate: "0"
        },
        loader: false

    }

    componentDidMount() {
        this.setState({ loader: true })
        fetch("http://localhost:8080/api/portfolio")
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
        this.setState({ year: evt.target.value, showPlan: false })
    }
    onChangePortfolio(evt) {
        this.setState({ selecedPortfolioId: evt.target.value, showPlan: false });
    }
    loadProgramForPortfolio() {

        let portfolioId = this.state.selecedPortfolioId
        if (this.state.year === "") {
            alert("Please enter the year");
        }
        this.setState({ loader: true })
        fetch("http://localhost:8080/api/getProgramCalendar?portfolioId=" + portfolioId + "&fiYear=" + this.state.year)
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
            let progAvail = this.state.programs.find(pr => {
                if (pr.piNo == selectedProg.piNo) {
                    return true
                }
            })
            if(typeof progAvail !== "undefined"){
                alert("program Number is already available")
                return
            }
        }
        console.log(selectedProg)
        let self = this
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
        });

    }
    clearProgram() {
        let selectedProgram = { ...this.state.selectedProgram }
        selectedProgram.endDate = ""
        selectedProgram.startDate = ""
        selectedProgram.piNo = 0
        selectedProgram.id = 0
        this.setState({ selectedProgram,pSaveBtnTxt:"fas fa-plus" })
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
                return (<button className="btn btn-primary">Create Pi Calendar</button>)
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
                                    <button className="btn btn-sm btn-info"><i className="fas fa-chevron-right"></i></button>
                                </div>
                            </td>
                        </tr>
                    )
                })
                let thead = () => {
                    return (
                        <thead className="thead-light">
                            <tr>
                                <td>PI NO</td>
                                <td>Start Date</td>
                                <td>End Date</td>
                                <td>Options</td>
                            </tr>
                            <tr>
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
                let table = <table className="table">{thead()}<tbody>{Rows}</tbody></table>
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
                        Load Plan</button>
                </div>
                <div className="row mt-2">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">{programList()}</div>
                        </div>
                    </div>
                    <div className="col-md-6"></div>
                </div>
            </div>
        )
    }
}