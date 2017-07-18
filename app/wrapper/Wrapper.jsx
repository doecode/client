import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import Footer from './Footer';

export default class Wrapper extends React.Component {
  constructor(props) {
    super(props);
  }


render() {
  return ( < div >
    <div>

      <Header/>
    </div>
    {this.props.children}
    < div >
    <Footer/>
    < /div>
  </div >);
}

}
