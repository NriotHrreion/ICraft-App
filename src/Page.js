import React, { Component } from "react";
import { Image, Breadcrumb, Button } from "react-bootstrap";
import "./Page.css";

import AppIcon from "./static/app_icon.ico";

export default class Page extends Component {
    render() {
        if(this.props.title) {
            document.title = this.props.title;
        }

        return (
            <div className={this.props.className}>
                <div className="nav-container">
                    <Breadcrumb>
                        <Breadcrumb.Item active>Craftmine</Breadcrumb.Item>
                        <Breadcrumb.Item active>{this.props.title}</Breadcrumb.Item>
                    
                        <Image src={AppIcon} className="app-icon"></Image>
                    </Breadcrumb>
                </div>
                {this.props.children}
                <div className="footer-container">
                    <p>Copyright &copy; NriotHrreion {new Date().getFullYear()}</p>
                </div>
            </div>
        );
    }
}
