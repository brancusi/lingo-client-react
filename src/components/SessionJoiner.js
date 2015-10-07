import React from 'react';
import Radium from 'radium';
import guid from 'utils/guid';

@Radium
export default class SessionJoiner extends React.Component {
  static propTypes = {
    join: React.PropTypes.func.isRequired
  }

  _clickHandler () {
    this.props.join(guid());
  }

  render () {
    const styles = {
      alignSelf: 'center'
    };

    const cardStyles = {
      alignSelf: 'center',
      backgroundColor: '#0584C6',
      color: '#F9F9FA',
      fontFamily: 'sofia-pro-soft, sans-serif',
      borderRadius: '8px'
    };

    const titleStyles = {
      fontWeight: 'bold',
      fontSize: '4em'
    };

    const bodyStyles = {
      fontWeight: 'medium',
      fontSize: '2em'
    };

    const buttonStyles = {
      fontFamily: 'sofia-pro-soft, sans-serif',
      backgroundColor: '#CDECF9',
      color: '#0584C6',
      fontSize: '2em',
      fontWeight: 'bold'
    };

    return (
      <div className='col-xs-12 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3 col-xl-6 col-xl-offset-3' style={styles}>
        <div className="card card-block" style={cardStyles}>
          <p style={titleStyles}>Speak. Daily.</p>
          <p style={bodyStyles}>Create a playground. Easy.</p>
          <div className='row'>

              <a className='btn btn-primary col-xs-8 col-xs-offset-2 col-md-6 col-md-offset-3' style={buttonStyles} onClick={::this._clickHandler}>
                Go Lingo
              </a>

          </div>
        </div>
      </div>
    );
  }
}
