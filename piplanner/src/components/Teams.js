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
        newMember:"",
        memberRole:"",
        portfolio: {
            createdBy:"",
            name:""
        },
        team: {
          name:"",
          portfolioId:"",
          createdBy:""  
        },
        member: {
            memberName:"",
            role:"",
            teamId:"",
            createdBy:""
        } 
    }

    componentDidMount() {
        this.loadPortfolioList();
    }

    loadPortfolioList() {
        fetch("http://localhost:8080/api/portfolio")
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
        fetch("http://localhost:8080/api/teamsForPortfolio?portfolioId=" + portfolioId)
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
        fetch("http://localhost:8080/api/teamMembersForTeam?teamId=" + teamId)
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
        this.setState({teamMembers: [], selectedTeamId: "", selectedPortfolioId: portfolio.id})
        this.loadTeamForPortfolio(portfolio.id);
    }

    onClickTeams(team) {
        this.setState({selectedTeamId:team.id})
        this.loadTeamMembers(team.id);
    }

    addNewPortfolio() {
        if(this.state.newPortfolio === "") {
            alert("Please enter Portfolio Name")
            return;
        }

        let portfolio = {...this.state.portfolio};
        portfolio.createdBy = "User";
        portfolio.name = this.state.newPortfolio;

        fetch('http://localhost:8080/api/portfolio', {
            method: 'post',
            body: JSON.stringify(portfolio),
            headers: {
                "Content-Type": "application/json"
            },
            }).then(function (response) {
            return response.json();
            }).then( (data) => {
            this.loadPortfolioList();
            this.setState({newPortfolio:""})
            alert("Portfolio Added Successfully")

        });
        
    }
    onChangePortfolio(evt) {
        this.setState({newPortfolio:evt.target.value})
    }

    addNewTeam() {
        if(this.state.newTeam === "") {
            alert("Please enter Team Name")
            return;
        }

        let team = {...this.state.team};
        team.createdBy = "User";
        team.name = this.state.newTeam;
        team.portfolioId=this.state.selectedPortfolioId;

        fetch('http://localhost:8080/api/teamsForPortfolio', {
            method: 'post',
            body: JSON.stringify(team),
            headers: {
                "Content-Type": "application/json"
            },
            }).then(function (response) {
            return response.json();
            }).then( (data) => {
            this.loadTeamForPortfolio(this.state.selectedPortfolioId);
            this.setState({newTeam:""})
            alert("Team Added Successfully")

        });
        
    }
    onChangeTeam(evt) {
        this.setState({newTeam:evt.target.value})
    }
    addNewMember() {
        if(this.state.newMember === "" || this.state.memberRole === "") {
            alert("Please enter Team Member Name and Role")
            return;
        }

        let member = {...this.state.member};
        member.createdBy = "User";
        member.memberName = this.state.newMember;
        member.role=this.state.memberRole;
        member.portfolioId=this.state.selectedPortfolioId;
        member.teamId=this.state.selectedTeamId;

        fetch('http://localhost:8080/api/teamMembersForTeam', {
            method: 'post',
            body: JSON.stringify(member),
            headers: {
                "Content-Type": "application/json"
            },
            }).then(function (response) {
            return response.json();
            }).then( (data) => {
            this.loadTeamMembers(this.state.selectedTeamId);
            this.setState({newMember:"",memberRole:""})
            alert("Team Member Added Successfully")

        });
        
    }
    onChangeMember(evt) {
        this.setState({newMember:evt.target.value})
    }
    onChangeRole(evt) {
        this.setState({memberRole:evt.target.value})
    }
    render() {
        let portfolioList = this.state.portfolios.map(po =>{
            return(
                <tr>
                  <td>
                  <a className= {this.state.selectedPortfolioId == po.id ? "list-group-item list-group-item-action active": "list-group-item list-group-item-action"} onClick={() => this.onClickPortfolio(po)}>{po.name}</a>                   
                  </td>
                </tr>
            )                                
        })
        let teamList = this.state.portfolioTeams.map(pt =>{
            return(
                <tr>
                  <td>
                  <a className= {this.state.selectedTeamId == pt.id ? "list-group-item list-group-item-action active": "list-group-item list-group-item-action"} onClick={() => this.onClickTeams(pt)}>{pt.name}</a>                   
                  </td>
                </tr>
            )                                
        })
        let teamMembersList = this.state.teamMembers.map(tm =>{
            return(
                <tr>
                  <td>
                  <a className="list-group-item" >{tm.memberName} - {tm.role}</a>                   
                  </td>
                </tr>
            )                                
        })

        let addTeam = () => {
            if(this.state.selectedPortfolioId === "") {
                return null
            }
            else {
                return(
                    <tr>
                        <td> 
                        <span className= "list-group-item list-group-item-action">                             
                            <input className="noBorder" type="text" value={this.state.newTeam} placeholder="Add Team" onChange={(evt) => this.onChangeTeam(evt)}/>                                        
                            <button type="button" class="btn btn-success" onClick={() => this.addNewTeam()}>Add</button>
                            </span> 
                        </td>
                    </tr>
                )
            }
             
        }

        let addTeamMember = () => {
            if(this.state.selectedTeamId === "") {
                return null
            }
            else {
                return(
                    <tr>
                        <td> 
                        <span className= "list-group-item list-group-item-action">                             
                            <input className="noBorder" type="text" value={this.state.newMember} placeholder="Add Member" onChange={(evt) => this.onChangeMember(evt)}/> 
                            &nbsp;<input className="noBorder" type="text" value={this.state.memberRole} placeholder="Role" onChange={(evt) => this.onChangeRole(evt)}/>                                        
                            <button type="button" class="btn btn-success" onClick={() => this.addNewMember()}>Add</button>
                            </span> 
                        </td>
                    </tr>
                )
            }
             
        }
        return (  
            <div className="team-container">                   
                <table className="table adjust">
                    <thead className="thead-dark">
                        <tr>
                            <th>Portifolio</th>
                        </tr>
                    </thead>
                    <tbody>
                      {portfolioList} 
                       <tr>
                        <td> 
                        <span className= "list-group-item list-group-item-action">                             
                          <input className="noBorder" type="text" value={this.state.newPortfolio} placeholder="Add Portfolio" onChange={(evt) => this.onChangePortfolio(evt)}/>                                        
                          <button type="button" class="btn btn-success" onClick={() => this.addNewPortfolio()}>Add</button>
                        </span> 
                        </td>
                       </tr>                        
                    </tbody>
                </table>  
                <table className="table adjust-team">
                    <thead className="thead-dark">
                        <tr>
                            <th>Teams</th>
                        </tr>
                    </thead>
                    <tbody>                  
                        {teamList} 
                        {addTeam()}                
                    </tbody>
                </table>  
                <table className="table adjust-member">
                    <thead className="thead-dark">
                        <tr>                    
                            <th>Team Members</th>
                        </tr>
                    </thead>
                    <tbody>              
                       {teamMembersList}
                       {addTeamMember()}            
                    </tbody>
                </table>  
            </div>                       
        )
    }
}