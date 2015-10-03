import React       from 'react';
import { connect } from 'react-redux';
import { joinRoom } from 'actions/room';
import Chat from 'components/Chat';

const mapStateToProps = (state) => ({
  room : state.room
});

export class HomeView extends React.Component {
  static propTypes = {
    dispatch : React.PropTypes.func,
    room  : React.PropTypes.object
  }

  _joinRoom() {
    const { dispatch } = this.props;
    dispatch(joinRoom('reactyo'));
  }

  render () {
    const { dispatch, room } = this.props;
    if(room.get('token') !== undefined){
      return (
        <div className='fluid-container text-center'>
          <Chat room={room} />
        </div>
      );
    }else{
      return (
        <div className='fluid-container text-center'>
          <button className='btn btn-default'
                  onClick={::this._joinRoom}>
            Join a Room
          </button>
        </div>
      );
    }

  }
}

export default connect(mapStateToProps)(HomeView);
