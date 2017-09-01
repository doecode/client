import React from 'react';
import ReactDOM from 'react-dom';

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.footer_classes = (this.props.is_homepage)   ? "footer-homepage" : "footer footer-bottom";
    this.img_link = (this.props.is_homepage) ? "https://www.osti.gov/sites/www.osti.gov/files/public/DOE_SC_OSTI_FFF.png":"https://www.osti.gov/doecode/images/DOE_SC_OSTI_666_sm.png";
    this.footer_link = (this.props.is_homepage) ? "footer-link-homepage":"footer-link";
  }

  render() {
    return (
      <footer className={this.footer_classes}>
        <div className="container">
          <br/>
          {!this.props.is_homepage && <hr className="footer-separator"/>}
          <div className="row">
            <div className="col text-center">
              <img src={this.img_link} className="mt-3 mb-1" alt="U.S. Department of Energy"/>
            </div>
          </div>

          <div className="row text-center mt-1 mb-1 white">
            <ul className="list-inline">
              <li className={this.footer_link}>
                <a href="/doecode/disclaimer"><span className="fa fa-university"></span>&nbsp;Website Policies / Important Links</a>
              </li>
              <li className={this.footer_link}>
                <a href="/doecode/contact"><span className="fa fa-comments-o"></span>&nbsp;Contact Us</a>
              </li>
              <li className={this.footer_link}>
                <a target="_blank" href="https://www.facebook.com/ostigov">
                  <span className="fa fa-facebook"></span>
                </a>
              </li>
              <li className={this.footer_link}>
                <a target="_blank" href="https://twitter.com/OSTIgov">
                  <span className="fa fa-twitter"></span>
                </a>
              </li>
              <li className={this.footer_link}>
                <a target="_blank" href="https://plus.google.com/+OstiGov">
                  <span className="fa fa-google-plus"></span>
                </a>
              </li>
              <li className={this.footer_link}>
                <a target="_blank" href="https://www.youtube.com/user/ostigov">
                  <span className="fa fa-youtube-play"></span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>

    );
  }

}
