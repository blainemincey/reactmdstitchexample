import React, { Component } from 'react';
import { RemoteMongoClient, UserPasswordCredential } from 'mongodb-stitch-browser-sdk';
import { DataTable, TableHeader, TableBody, TableRow, TableColumn } from "react-md";
import { makeCancelable } from "../../utils/utils";
import { stitchClient } from "../App/App";

export default class Page2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            employees: []
        };

        this.cancelablePromise = makeCancelable(this.getEmployees());

    }


    componentDidMount() {
        if (this.state.employees.length === 0) {

            this.cancelablePromise
                .promise
                .then(employeeResults =>
                this.setState({employees:employeeResults}))
                .then(() => console.log('resolved'))
                .catch((reason) => console.log('isCanceled', reason.isCanceled));
        }
    }



    componentWillUnmount() {
        this.cancelablePromise.cancel();
    }

    getEmployees() {
        console.log("Get Employees");
        let user = 'joe.schmoe@company.com';
        let pass = 'SuperSecretPassword123';
        let credential = new UserPasswordCredential(user,pass);

        return stitchClient.auth.loginWithCredential(credential).then(user => {
            console.log("User logged in: " + user.id);
            // Initialize a MongoDB Service Client
            let mongodb = stitchClient.getServiceClient(
                RemoteMongoClient.factory,
                "mongodb-atlas"
            );
            // Get a hook to the employees collection
            let employees = mongodb.db("HR").collection("employees");

            return employees.find({}, {
                // limit: 3,
                // sort: { "salary": -1 }
            }).asArray();
        }).catch(e => {
            console.log("Error with getEmployees", e);
        })
    }



    render() {
        const {employees} = this.state;
        if(employees.length === 0){
            console.log("zero results");
        }

        return (
            <div>
                <h2>Example DataTable using react-md and MongoDB Stitch</h2>
            <DataTable plain>
                <TableHeader>
                    <TableRow>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>Email</TableColumn>
                        <TableColumn>Role</TableColumn>
                        <TableColumn>Manager</TableColumn>
                        <TableColumn>Salary</TableColumn>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from(employees).map((_,i) => (

                        <TableRow key={i}>
                            <TableColumn>{employees[i].name.first} {employees[i].name.last}</TableColumn>
                            <TableColumn>{employees[i].email}</TableColumn>
                            <TableColumn>{employees[i].role}</TableColumn>
                            <TableColumn>{employees[i].manager.name.first} {employees[i].manager.name.last}</TableColumn>
                            <TableColumn>{employees[i].salary}</TableColumn>
                        </TableRow>
                    ))}
                </TableBody>
            </DataTable>
            </div>
        );
    }
}