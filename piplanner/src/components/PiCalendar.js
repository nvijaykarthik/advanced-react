import React, { Component } from 'react';
import '../App.css';

export default class PiCalendar extends Component {
    state = {
        year:"",
        portfolio: [],
        selecedPortfolioId:"",
        showPlan:"",
        programs:[]
    }

    componentDidMount() {
        fetch("http://localhost:8080/api/portfolio")
            .then((response) => response.json())
            .then((data) => {

                this.setState({
                    portfolio: data
                })
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    onChangeYear(evt) {
        this.setState({ year: evt.target.value })
    }
    onChangePortfolio(evt) {
        this.setState({ selecedPortfolioId: evt.target.value,  showPlan: false});
    }
    loadProgramForPortfolio() {
        let portfolioId= this.state.selecedPortfolioId
        if (this.state.year === "") {
            alert("Please enter the year");
        }
        fetch("http://localhost:8080/api/getProgramCalendar?portfolioId=" + portfolioId + "&fiYear=" + this.state.year)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    programs: data
                })
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    
    render() {
        let portfolioList = this.state.portfolio.map(po => {
            return (<option key={po.id} value={po.id}>{po.name}</option>)
        })
        let programList=()=>{
            if(this.state.programs.length===0){
            return(<button className="btn btn-primary">Create Pi Calendar</button>)
            }else{
                let Rows=this.state.programs.map(prg=>{
                    return(
                    <tr>
                        <td>{prg.piNo}</td>
                        <td>{prg.startDate}</td>
                        <td>{prg.endDate}</td>
                        <td><button className="btn btn-sm btn-warning">edit</button>
                        &nbsp;<button className="btn btn-sm btn-info">>>></button></td>
                    </tr>
                    )
                })
            let thead=()=>{
                return(
                <thead>
                    <tr>
                        <td>PI NO</td>
                        <td>Start Date</td>
                        <td>End Date</td>
                        <td>Options</td>
                    </tr>
                    <tr>
                        <td><input type="number"/></td>
                        <td><input type="Date"/></td>
                        <td><input type="Date"/></td>
                        <td colSpan="2"><button className="btn btn-success btn-sm">Save</button></td>
                    </tr>
                </thead>
             )
            }
            let table=<table className="table">{thead()}<tbody>{Rows}</tbody></table>
            return table;
            }
        }
        return (
            <div className="container-fluid">
                <div className="form-inline border-bottom">
                    <div className="m-2 ">
                        <i>Year:&nbsp;</i>
                        <input type="text" className="form-control" id="year" value={this.state.year} onChange={(evt) => this.onChangeYear(evt)}/>
                    </div>
                    <div className="m-2 ">
                        <i>Portfolio:&nbsp;</i>
                        <select className="form-control" id="portfolioList" onChange={(evt) => this.onChangePortfolio(evt)}>
                            <option value=""></option>
                            {portfolioList}
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={() => this.loadProgramForPortfolio()}>Load Plan</button>
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