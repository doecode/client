import React from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button} from 'react-bootstrap';

export default class Splash extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {

        return (
        <div className="row not-so-wide-row">
            <div className="col-md-3"></div>
            <div className="col-md-6 col-xs-12 static-content">
                <h2 className="static-content-title">FAQ's</h2>
                <br/>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at ligula nec nibh vulputate condimentum ac ac felis. Nulla et turpis id 
                    erat luctus porta. Curabitur sit amet enim nibh. Sed orci ligula, blandit nec arcu quis, dignissim porttitor ipsum. Aenean ac ultricies neque.
                    Mauris vestibulum leo sapien, vel laoreet dui porta in. Nam mattis turpis nec neque convallis, id pretium urna ullamcorper. Nullam lacinia vitae
                    quam vitae convallis. Proin pulvinar euismod enim non pellentesque. In non elit orci. Duis eu congue enim. Etiam placerat laoreet tortor, ut 
                    vestibulum dui aliquam sed.
                </p>
                <p>
                    Curabitur id gravida nisl. Aenean viverra nunc orci, at ultricies risus sollicitudin vel. Curabitur iaculis eget mi sit amet lobortis. Fusce 
                    condimentum urna dolor, id bibendum dui elementum sit amet. Cras felis nisi, ultricies sit amet iaculis sed, faucibus sed massa. Nunc porta,
                    ipsum ac finibus convallis, erat tellus porta felis, a vehicula nisi est ut libero. Morbi in neque iaculis, aliquam quam nec, venenatis lacus.
                    Donec eu quam in est feugiat iaculis. Phasellus nulla lectus, fermentum ac nunc non, dictum dignissim neque. Nulla ipsum augue, tincidunt ac 
                    augue sit amet, gravida hendrerit ipsum. Cras molestie blandit pretium. Donec sit amet felis vel risus pretium dictum.
                </p>
                <p>
                    Integer non nibh dui. Mauris dapibus sit amet enim id vulputate. Donec porttitor erat ex, et scelerisque libero dictum sit amet. Proin lacinia 
                    id justo eget pharetra. Fusce sit amet urna diam. Cras egestas enim orci, a semper mauris varius nec. Sed commodo quam vitae egestas ullamcorper.
                    Sed lacinia viverra augue, vitae luctus orci dapibus at. Vestibulum tempus efficitur quam eget pellentesque. Pellentesque semper lacinia cursus.
                    Donec vitae risus odio. Pellentesque finibus lacus nec ornare sagittis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec egestas
                    pellentesque felis, at efficitur velit elementum vitae. Morbi vulputate, sapien nec varius feugiat, arcu orci fringilla justo, et commodo metus sem id eros. 
                </p>
            </div>
            <div className="col-md-3"></div>
        </div>
        );
    }
}

