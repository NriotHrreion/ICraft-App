import React, { Component } from "react";
import { Breadcrumb, Button } from "react-bootstrap";
import "./Page.css";

export default class ChildPage extends Component {
    backButton() {
        if(this.props.back) {
            return (
                <div style={{display: "inline-block"}}>
                    <Button variant="link" className="link-btn" onClick={() => {
                        window.location.href = "http://"+ window.location.host +"/"+ this.props.back
                    }}>返回</Button>
                </div>
            );
        }
    }

    render() {
        return (
            <div className={this.props.className}>
                <div className="nav-container">
                    <Breadcrumb>
                        {this.backButton()}
                        <Breadcrumb.Item active>ICraft</Breadcrumb.Item>
                        {this.props.nonav ? null : <Breadcrumb.Item active>{this.props.title}</Breadcrumb.Item>}
                        {this.props.nonav && this.props.secondTitle ? null : <Breadcrumb.Item active>{this.props.secondTitle}</Breadcrumb.Item>}
                    </Breadcrumb>
                </div>
                {this.props.children}
            </div>
        );
    }
}
