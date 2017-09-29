import React from 'react';
import ReactDOM from 'react-dom';

export default class About extends React.Component {
  constructor(props) {
    super(props);
    this.changeImage = this.changeImage.bind(this);
    this.changeDiscover = this.changeDiscover.bind(this);
    this.changeCreate = this.changeCreate.bind(this);
    this.changeSubmit = this.changeSubmit.bind(this);

    this._imageUrls = [
      "https://www.osti.gov/doecode/images/DOEcodeFeatures_main710px-min.png",
      "https://www.osti.gov/doecode/images/DOEcodeFeatures_doi710px-min.png",
      "https://www.osti.gov/doecode/images/DOEcodeFeatures_Catalog710px-min.png",
      "https://www.osti.gov/doecode/images/DOEcodeFeatures_Policy710px-min.png",
      "https://www.osti.gov/doecode/images/DOEcodeFeatures_Easy710px-min.png",
      "https://www.osti.gov/doecode/images/DOEcodeFeatures_GitHub710px-min.png",
      "https://www.osti.gov/doecode/images/DOEcodeFeatures_SocialCode710px-min.png"
    ];

    this._discoverUrls = ["https://www.osti.gov/doecode/images/Discover-min.png", "https://www.osti.gov/doecode/images/Discover_hover-min.png"];

    this._createUrls = ["https://www.osti.gov/doecode/images/Create-min.png", "https://www.osti.gov/doecode/images/Create_hover-min.png"];

    this._submitUrls = ["https://www.osti.gov/doecode/images/Submit-min.png", "https://www.osti.gov/doecode/images/Submit_hover-min.png"]
    this.state = {
      currentImage: this._imageUrls[0],
      currentDiscover: this._discoverUrls[0],
      currentCreate: this._createUrls[0],
      currentSubmit: this._submitUrls[0]
    }
  }

  changeDiscover(index) {
    this.setState({"currentDiscover": this._discoverUrls[index]});
  }

  changeCreate(index) {
    this.setState({"currentCreate": this._createUrls[index]});
  }

  changeSubmit(index) {
    this.setState({"currentSubmit": this._submitUrls[index]});
  }

  changeImage(index) {
    this.setState({"currentImage": this._imageUrls[index]});
  }
  render() {
    return (
      <div>

        <div className="container-fluid bgWhite">
          <div className="container containerStyle">
            <div className="row">
              <div className="col-xs-12 static-content left-text">
                <h2 className="static-content-title">About</h2>
              </div>
              <div className=""></div>
            </div>
            <div className="row">
              <div className=""></div>
              <div className="col-xs-12 static-content">
                <br/>
                <p className='left-text'>
                  The Department of Energy (DOE) Office of Scientific and Technical Information (OSTI) developed a new DOE software services platform and search tool for DOE-funded code – DOE CODE. DOE CODE replaces OSTI’s old software center, the Energy Science and Technology Software Center (ESTSC).
                </p>

                <p className="left-text hidden-md hidden-lg">
                  <strong>CREATE</strong>
                  - Create code inside or outside DOE CODE.</p>
                <p className="left-text hidden-md hidden-lg">
                  <strong>SUBMIT</strong>
                  - Submit your DOE-funded code.</p>
                <p className="left-text hidden-md hidden-lg">
                  <strong>DISCOVER</strong>
                  - Discover DOE-funded software and code.</p>

                <img title='Create' className="hidden-xs hidden-sm" src={this.state.currentCreate} width="150" height="113" alt="Create" onMouseOver={() => {
                  this.changeCreate(1)
                }} onMouseOut={() => {
                  this.changeCreate(0)
                }}/>
                <img title='Submit' className="col-md-offset-1 hidden-xs hidden-sm" src={this.state.currentSubmit} width="150" height="113" alt="Submit" onMouseOver={() => {
                  this.changeSubmit(1)
                }} onMouseOut={() => {
                  this.changeSubmit(0)
                }}/>
                <img title='Discover' className="col-md-offset-1 hidden-xs hidden-sm" src={this.state.currentDiscover} width="150" height="113" alt="Discover" onMouseOver={() => {
                  this.changeDiscover(1)
                }} onMouseOut={() => {
                  this.changeDiscover(0)
                }}/>
                <div className=""></div>
                <br/>
                <br/>
              </div>
              <div className=""></div>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="container containerStyle">
            <div className="row">
              <div className=""></div>
              <div className="col-xs-12 static-content">
                <img title='DOE Code Features' className="hidden-xs hidden-sm" src={this.state.currentImage} width="710" height="440" alt="DOE Code Features" useMap="#featuremap"></img>
                <map name="featuremap">
                  <area title='DOI' shape="circle" coords="220,83,32" alt="DOI" onMouseOver={() => {
                    this.changeImage(1)
                  }} onMouseOut={() => {
                    this.changeImage(0)
                  }}/>
                  <area title='Software Catalog' shape="circle" coords="160,216,32" alt="Software Catalog" onMouseOver={() => {
                    this.changeImage(2)
                  }} onMouseOut={() => {
                    this.changeImage(0)
                  }}/>
                  <area title='DOE Code Resources' shape="circle" coords="220,354,32" alt="DOE Code Resources" onMouseOver={() => {
                    this.changeImage(3)
                  }} onMouseOut={() => {
                    this.changeImage(0)
                  }}/>
                  <area title='Easy' shape="circle" coords="488,352,32" alt="Easy" onMouseOver={() => {
                    this.changeImage(4)
                  }} onMouseOut={() => {
                    this.changeImage(0)
                  }}/>
                  <area title='Open Source' shape="circle" coords="548,217,32" alt="Open Source" onMouseOver={() => {
                    this.changeImage(5)
                  }} onMouseOut={() => {
                    this.changeImage(0)
                  }}/>
                  <area title='DOE Code Seamless' shape="circle" coords="489,83,32" alt="DOE Code Seamless" onMouseOver={() => {
                    this.changeImage(6)
                  }} onMouseOut={() => {
                    this.changeImage(0)
                  }}/>
                </map>

                <h3 className="hidden-md hidden-lg featuresStyle">FEATURES</h3>
                <p className="left-text hidden-md hidden-lg">
                  <strong>DOI</strong>
                  - DOE CODE issues digital object identifiers (DOIs) for software code so your software is more easily cited and discoverable. Allows for stronger connections between code, publications, data, and other forms of STI through citation in reference sections.</p>
                <p className="left-text hidden-md hidden-lg">
                  <strong>CATALOG</strong>
                  - DOE Software Catalog.</p>
                <p className="left-text hidden-md hidden-lg">
                  <strong>BEST PRACTICES AND POLICY</strong>
                  - DOE CODE resources provide you information on best practices and policies for software.</p>
                <p className="left-text hidden-md hidden-lg">
                  <strong>SOCIAL CODING</strong>
                  - DOE CODE seamlessly interfaces with common development platforms to make DOE-funded software and code more easily submitted, discoverable, and citable.</p>
                <p className="left-text hidden-md hidden-lg">
                  <strong>GITHUB</strong>
                  - DOE CODE is an open source product on GitHub that other institutions can download and deploy for their own purposes.</p>
                <p className="left-text hidden-md hidden-lg">
                  <strong>EASY</strong>
                  - DOE CODE is easy to use!</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}
