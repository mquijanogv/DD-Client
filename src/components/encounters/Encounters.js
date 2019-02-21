import React from 'react'
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon } from 'mdbreact'
import EncounterForm from './EncounterForm'
import MyEncounters from './MyEncounters'
import { connect } from 'react-redux'
import { checkToken } from '../../utils/misc'

class Encounters extends React.Component {
  state = {
    activeButtonMyEncounters: true,
    editing: false,
    lastClicked: 'Encounters'
  }

  toggleButtonNavigation = (lastClicked) => {
    this.setState((state, props) => {
      if (state.lastClicked !== lastClicked) {
        return {
          activeButtonMyEncounters: !state.activeButtonMyEncounters,
          lastClicked
        }
      } else {
        return
      }
    });
  }

  componentWillMount() {
    if (!this.props.User.authenticated) {
      const token = localStorage.getItem('DNDTOKEN')
      if (token) {
        checkToken.bind(this)(token)
      } else {
        this.props.history.push({
          pathname: '/'
        })
      }
    }
  }

  render() {
    const encounterList = this.props.Encounters.list
    return (
      <div>
        {this.props.User.authenticated &&
          encounterList && (
            <MDBContainer style={styles} className="">
              <div className="characters-Container">
                <MDBRow>
                  <MDBCol md='12' className="mb-4">
                    <MDBBtn onClick={() => this.toggleButtonNavigation('Encounters')} color="black">
                      <MDBIcon icon="magic" size="lg" />
                      &nbsp;
                      My Encounters
              </MDBBtn>
                    <MDBBtn onClick={() => this.toggleButtonNavigation('Create_Encounter')} color="black">
                      <MDBIcon icon="plus" size="lg" />
                      &nbsp;
                      Create Encounter
            </MDBBtn>
                  </MDBCol>
                </MDBRow>
                <MDBIcon color="black" icon="hat-wizard" />
              </div>
              <div className="page-heading">
                <h1 className="page-title">
                  <strong>{this.state.activeButtonMyEncounters ? 'Encounters' : 'Create Encounter'}</strong>
                </h1>
              </div>
              <br />
              {this.state.activeButtonMyEncounters
                ?
                <div>
                  {
                    encounterList.length > 0
                      ?
                      <ol className='my-characters'>
                        {encounterList.map((encounter) => (
                          <li key={encounter._id}>
                            <div className="individual-character">
                              {(this.state.editing &&
                                this.state.editing._id === encounter._id) ? (
                                  <EncounterForm 
                                    encounter={encounter}
                                    done={() => this.setState({editing: false})}
                                  />
                                ) :
                                  <MyEncounters
                                    encounter={encounter}
                                    length={encounterList.length}
                                    activeEncounter={this.props.Encounters.active}
                                    onEdit={encounter => this.setState({editing: encounter})}
                                  />
                              }
                            </div>
                          </li>
                        ))}
                      </ol>
                      :
                      <div className="d-flex justify-content-center">
                        <h3>No Encounters just yet...</h3>
                      </div>
                  }
                </div>
                :
                <div className="my-characters">
                  <EncounterForm
                    toggleButtonNavigation={this.toggleButtonNavigation}
                  />
                </div>
              }
            </MDBContainer>
          )}
      </div>


    )
  }
}

let styles = {
  marginTop: '5em',
};

function mapStateToProps({ User, Encounters }) {
  return {
    User,
    Encounters,
    activeId: Encounters.active ? Encounters.active._id : false
  }

}

export default connect(mapStateToProps)(Encounters)
