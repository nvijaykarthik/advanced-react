import React, { Component } from 'react';
import '../App.css';

export default class Teams extends Component {
    state = {
        portfolios: [],
        selectedPortfolioId: "",
        portfolioTeams: [],
        selectedTeamId: "",
        teamMembers: [],
        newPortfolio: "",
        newTeam: "",
        newMember: "",
        memberRole: "",
        editedPortfolioId: "",
        editedTeamId: "",
        editedMemberId: "",
        portfolio: {
            createdBy: "",
            name: "",
            id:""
        },
        team: {
            name: "",
            portfolioId: "",
            createdBy: "",
            id:""
        },
        member: {
            memberName: "",
            role: "",
            teamId: "",
            createdBy: "",
            id:""
        }
    }

    componentDidMount() {
        this.loadPortfolioList();
    }

    loadPortfolioList() {
        fetch(process.env.REACT_APP_LOCAL_DOMAIN+"/api/portfolio")
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    portfolios: data
                })
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    loadTeamForPortfolio(portfolioId) {
        fetch(process.env.REACT_APP_LOCAL_DOMAIN+"/api/teamsForPortfolio?portfolioId=" + portfolioId)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    portfolioTeams: data
                })
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    loadTeamMembers(teamId) {
        fetch(process.env.REACT_APP_LOCAL_DOMAIN+"/api/teamMembersForTeam?teamId=" + teamId)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    teamMembers: data
                })
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    onClickPortfolio(portfolio) {
        this.setState({ teamMembers: [], selectedTeamId: "", selectedPortfolioId: portfolio.id, editedPortfolioId: "",newPortfolio:"", editedTeamId: "", newTeam: ""})
        this.loadTeamForPortfolio(portfolio.id);
    }

    onClickTeams(team) {        
        this.setState({ editedMemberId: "", editedTeamId: "", newTeam: "", selectedTeamId: team.id, newMember:"",memberRole:"" })
        this.loadTeamMembers(team.id);
    }

    addNewPortfolio() {
        if (this.state.newPortfolio === "") {
            alert("Please enter Portfolio Name")
            return;
        }

        let portfolio = { ...this.state.portfolio };
        portfolio.createdBy = "User";
        portfolio.name = this.state.newPortfolio;

        if(this.state.editedPortfolioId !== "") {
            portfolio.id = this.state.editedPortfolioId
        }

        fetch('http://localhost:8080/api/portfolio', {
            method: 'post',
            body: JSON.stringify(portfolio),
            headers: {
                "Content-Type": "application/json"
            },
        }).then(function (response) {
            return response.json();
        }).then((data) => {
            this.loadPortfolioList();
            this.setState({ newPortfolio: "" , editedPortfolioId: ""})
            alert("Portfolio saved Successfully")

        });

    }
    onChangePortfolio(evt) {
        this.setState({ newPortfolio: evt.target.value })
    }

    addNewTeam() {
        if (this.state.newTeam === "") {
            alert("Please enter Team Name")
            return;
        }

        let team = { ...this.state.team };
        team.createdBy = "User";
        team.name = this.state.newTeam;
        team.portfolioId = this.state.selectedPortfolioId;

        if(this.state.editedTeamId !== "") {
            team.id = this.state.editedTeamId
        }

        fetch('http://localhost:8080/api/teamsForPortfolio', {
            method: 'post',
            body: JSON.stringify(team),
            headers: {
                "Content-Type": "application/json"
            },
        }).then(function (response) {
            return response.json();
        }).then((data) => {
            this.loadTeamForPortfolio(this.state.selectedPortfolioId);
            this.setState({ newTeam: "", editedTeamId: ""})
            alert("Team saved Successfully")

        });

    }
    onChangeTeam(evt) {
        this.setState({ newTeam: evt.target.value })
    }
    addNewMember() {
        if (this.state.newMember === "" || this.state.memberRole === "") {
            alert("Please enter team member name and choose role")
            return;
        }

        let member = { ...this.state.member };
        member.createdBy = "User";
        member.memberName = this.state.newMember;
        member.role = this.state.memberRole;
        member.portfolioId = this.state.selectedPortfolioId;
        member.teamId = this.state.selectedTeamId;

        if(this.state.editedMemberId !== "") {
            member.id = this.state.editedMemberId
        }

        fetch('http://localhost:8080/api/teamMembersForTeam', {
            method: 'post',
            body: JSON.stringify(member),
            headers: {
                "Content-Type": "application/json"
            },
        }).then(function (response) {
            return response.json();
        }).then((data) => {
            this.loadTeamMembers(this.state.selectedTeamId);
            this.setState({ newMember: "", memberRole: "", editedMemberId: ""})
            alert("Team Member saved Successfully")

        });

    }
    onChangeMember(evt) {
        this.setState({ newMember: evt.target.value })
    }
    onChangeRole(evt) {
        this.setState({ memberRole: evt.target.value })
    }
    editPortfolio(po, evt) {
        this.setState( {portfolioTeams: [], teamMembers: [], selectedTeamId: "", editedTeamId: "", editedMemberId: "", selectedPortfolioId: "" ,newPortfolio: po.name, editedPortfolioId: po.id })
        evt.stopPropagation()
    }
    editTeam(et, evt) {
        this.setState( {teamMembers: [], selectedTeamId: "", editedMemberId: "", newTeam: et.name, editedTeamId: et.id })
        evt.stopPropagation()
    }
    editMember(em, evt) {
        this.setState( {newMember: em.memberName, memberRole: em.role, editedMemberId: em.id })
        evt.stopPropagation()
    }
    render() {
        let portfolioList = this.state.portfolios.map(po => {
            return (
                <tr>
                    <td>
                        <span className={this.state.selectedPortfolioId == po.id ? "list-group-item list-group-item-action active" : "list-group-item list-group-item-action"} onClick={() => this.onClickPortfolio(po)}>
                            <label>{po.name}</label>
                            <button type="button" class="btn btn-warning btn-sm float-right" onClick={this.editPortfolio.bind(this, po)}><i className="fas fa-edit"></i></button>
                        </span>
                    </td>
                </tr>
            )
        })
        let teamList = this.state.portfolioTeams.map(pt => {
            return (
                <tr>
                    <td>
                        <span className={this.state.selectedTeamId == pt.id ? "list-group-item list-group-item-action active" : "list-group-item list-group-item-action"} onClick={() => this.onClickTeams(pt)} >
                            <label>{pt.name}</label>
                            <button type="button" class="btn btn-warning btn-sm float-right" onClick={this.editTeam.bind(this,pt)}><i className="fas fa-edit"></i></button>
                        </span>
                    </td>
                </tr>
            )
        })
        let teamMembersList = this.state.teamMembers.map(tm => {
            return (
                <tr>
                    <td>
                        <span className="list-group-item" >
                            <label>{tm.memberName} - {tm.role}</label>
                            <button type="button" class="btn btn-warning btn-sm float-right" onClick={this.editMember.bind(this,tm)}><i className="fas fa-edit"></i></button>
                        </span>
                    </td>
                </tr>
            )
        })

        let addTeam = () => {
            if (this.state.selectedPortfolioId === "") {
                return null
            }
            else {
                return (
                    <td>
                        <div class="input-group">
                            <input className="form-control" type="text" value={this.state.newTeam} placeholder="Add Team" onChange={(evt) => this.onChangeTeam(evt)} />
                            <div class="input-group-append">
                                <button type="button" className={this.state.editedTeamId === "" ? "btn btn-dark btn-sm float-right" : "btn btn-success btn-sm float-right"} 
                                onClick={() => this.addNewTeam()}>
                                    <i className={this.state.editedTeamId === "" ? "fas fa-plus" : "fas fa-save"}></i></button>
                            </div>
                        </div>
                    </td>
                )
            }

        }

        let addTeamMember = () => {
            if (this.state.selectedTeamId === "") {
                return null
            }
            else {
                return (
                    <td>
                        <div class="input-group">
                            <input className="form-control" type="text" value={this.state.newMember} placeholder="Add Member" onChange={(evt) => this.onChangeMember(evt)} />
                            <select className="form-control" id="roleList" value={this.state.memberRole} onChange={(evt) => this.onChangeRole(evt)}>
                                <option value="">Choose Role</option>
                                <option value="DEV">DEV</option>
                                <option value="TEST">TEST</option>
                                <option value="SM">SM</option>
                                <option value="BA">BA</option>
                                <option value="PO">PO</option>
                            </select>
                            <div class="input-group-append">
                                <button type="button" className={this.state.editedMemberId === "" ? "btn btn-dark btn-sm float-right" : "btn btn-success btn-sm float-right"}
                                onClick={() => this.addNewMember()}>
                                    <i className={this.state.editedMemberId === "" ? "fas fa-plus" : "fas fa-save"}></i></button>
                            </div>
                        </div>
                    </td>

                )
            }

        }
        let addPortfolio = () => {
            return (
                <td>
                    <div class="input-group">
                        <input className="form-control" type="text" value={this.state.newPortfolio} placeholder="Add Portfolio" onChange={(evt) => this.onChangePortfolio(evt)} />
                        <div class="input-group-append">
                         <button type="button" className= {this.state.editedPortfolioId === "" ? "btn btn-dark btn-sm float-right" : "btn btn-success btn-sm float-right"} 
                         onClick={() => this.addNewPortfolio()}>
                             <i className={this.state.editedPortfolioId === "" ? "fas fa-plus" : "fas fa-save"}></i></button>
                        </div>
                    </div>
                </td>
            )
        }
        return (
            <div className="container-fluid">
                <div className="card mt-2 shadow">
                    <div className="card-body">
                    <table className="table adjust">
                    <thead>
                        <tr>
                            <th className="darkThead text-white"><h2 >Portifolio</h2></th>
                        </tr>
                        <tr className="bg-info">
                            {addPortfolio()}
                        </tr>
                    </thead>
                    <tbody>
                        {portfolioList}
                    </tbody>
                </table>
                <table className="table adjust-team">
                    <thead >
                        <tr>
                            <th className="darkThead text-white"><h2>Teams</h2></th>
                        </tr>
                        <tr className="bg-info">
                            {addTeam()}
                        </tr>
                    </thead>
                    <tbody>
                        {teamList}
                    </tbody>
                </table>
                <table className="table adjust-member">
                    <thead >
                        <tr>
                            <th className="darkThead text-white"><h2>Team Members</h2></th>
                        </tr>
                        <tr className="bg-info">
                            {addTeamMember()}
                        </tr>
                    </thead>
                    <tbody>
                        {teamMembersList}

                    </tbody>
                </table>
                    </div>
                </div>
                
            </div>
        )
    }
}