import React from 'react';
import ReactDOM from 'react-dom';

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.footer_classes = (this.props.is_homepage)
      ? "footer-homepage"
      : "footer footer-bottom";
    this.img_link = (this.props.is_homepage)
      ? "https://www.osti.gov/sites/www.osti.gov/files/public/DOE_SC_OSTI_FFF.png"
      : 'https://www.osti.gov/includes/doecode/images/DOE_SC_OSTI_666_sm.png';
    this.footer_link = (this.props.is_homepage)
      ? "footer-link-homepage"
      : "footer-link";
  }

  render() {
    const linkColorClass = (this.props.is_homepage)
      ? 'white'
      : 'footer-link';
    return (
      <footer className={this.footer_classes}>
        <div className="container">
          <br/> {!this.props.is_homepage && <hr className="footer-separator"/>}
          <div className="row center-text">
            <div className='col-md-3'></div>
            <div className="col-md-6 col-xs-12 center-text">
              <img alt='usdoeimg' src={this.img_link} className="mt-3 mb-1 img-responsive center-block" alt="U.S. Department of Energy" id="footer-banner" useMap="#footer-banner-map"/>
              <map name="footer-banner-map" id="footer-banner-map">
                <area alt="Office of Scientific and Technical Information" title="Office of Scientific and Technical Information" href="/" shape="rect" coords="236,1,400,44" target="_self"/>
                <area alt="Office of Science" title="Office of Science" href="https://science.energy.gov" shape="rect" coords="157,0,235,44" target="_blank"/>
                <area alt="U.S. Department of Energy" title="U.S. Department of Energy" href="https://energy.gov" shape="rect" coords="0,1,157,44" target="_blank"/>
              </map>
            </div>
            <div className='col-md-3'></div>
          </div>

          <div className="row text-center mt-1 mb-1 white">
            <span className='hide-xs'>
              <ul className="list-inline">
                <li className={this.footer_link}>
                  <a title='Website Policies / Important Links' href="/doecode/disclaimer">
                    <span className="fa fa-university footer-fa-icon"></span>&nbsp;&nbsp;Website Policies / Important Links</a>
                </li>
                <li className={this.footer_link}>
                  <a title='Contact Us' href="/doecode/contact">
                    <span className="fa fa-comments-o footer-fa-icon"></span>&nbsp;&nbsp;Contact Us</a>
                </li>
                <li className={this.footer_link}>
                  <a title='Facebook' target="_blank" href="https://www.facebook.com/ostigov">
                    <span className="fa fa-facebook"></span>
                  </a>
                </li>
                <li className={this.footer_link}>
                  <a title='Twitter' target="_blank" href="https://twitter.com/OSTIgov">
                    <span className="fa fa-twitter"></span>
                  </a>
                </li>
                <li className={this.footer_link}>
                  <a title='Google Plus' target="_blank" href="https://plus.google.com/+OstiGov">
                    <span className="fa fa-google-plus"></span>
                  </a>
                </li>
                <li className={this.footer_link}>
                  <a title='Youtube' target="_blank" href="https://www.youtube.com/user/ostigov">
                    <span className="fa fa-youtube-play"></span>
                  </a>
                </li>
              </ul>
            </span>
            <span className='hide-md hide-lg hide-sm'>
              <ul className="list-inline">
                <li className={this.footer_link}>
                  <a title='Facebook' target="_blank" href="https://www.facebook.com/ostigov">
                    <span className="fa fa-facebook"></span>
                  </a>
                </li>
                <li className={this.footer_link}>
                  <a title='Twitter' target="_blank" href="https://twitter.com/OSTIgov">
                    <span className="fa fa-twitter"></span>
                  </a>
                </li>
                <li className={this.footer_link}>
                  <a title='Google Plus' target="_blank" href="https://plus.google.com/+OstiGov">
                    <span className="fa fa-google-plus"></span>
                  </a>
                </li>
                <li className={this.footer_link}>
                  <a title='Youtube' target="_blank" href="https://www.youtube.com/user/ostigov">
                    <span className="fa fa-youtube-play"></span>
                  </a>
                </li>
              </ul>
              <div className='row hide-md hide-lg not-so-wide-row '>
                <br/>
                <div className='col-xs-6 center-text website-policies-mobile'>
                  <a title='Website Policies' href="/doecode/disclaimer" className={linkColorClass}>
                    <span className="fa fa-university footer-fa-icon"></span>&nbsp;Website Policies
                  </a>
                </div>
                <div className='col-xs-6 center-text'>
                  <a title='Contact Us' href="/doecode/contact" className={linkColorClass}>
                    <span className="fa fa-comments-o footer-fa-icon"></span>&nbsp;Contact Us</a>
                </div>
              </div>
            </span>
          </div>
        </div>
      </footer>

    );
  }

}
