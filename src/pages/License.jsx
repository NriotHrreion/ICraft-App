import React, { Component } from "react";
import Page from "../components/Page";
import "./TextPage.css";

export default class License extends Component {
    render() {
        return (
            <Page title="关于" secondTitle="许可" back="about" className="text-page">
                <div className="header-container">
                    <h1>许可</h1>
                </div>
                <div className="main-container">
                    <br/>
                    <p>
MIT License<br/><br/>
Copyright (c) 2021 NriotHrreion<br/><br/>
Permission is hereby granted, free of charge, to any person obtaining a copy<br/>
of this software and associated documentation files (the "Software"), to deal<br/>
in the Software without restriction, including without limitation the rights<br/>
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell<br/>
copies of the Software, and to permit persons to whom the Software is<br/>
furnished to do so, subject to the following conditions:<br/><br/>
The above copyright notice and this permission notice shall be included in all<br/>
copies or substantial portions of the Software.<br/><br/>
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR<br/>
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,<br/>
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE<br/>
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER<br/>
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,<br/>
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE<br/>
SOFTWARE.
</p>
                </div>
            </Page>
        );
    }
}
