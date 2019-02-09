import React, { Component } from 'react'
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon } from 'mdbreact';
import { connect } from 'react-redux'
import { createEncounter, patchEncounter, cancelEditEncounter } from '../actions/encounters'

class EncounterForm extends Component {
    state = {
        name: '',
        status: '',
        updating: false,
        style: {}
    }

    componentDidMount() {
        if(!this.state.updating && this.props.encounter) {
            console.log('setting updating', this.props.encounter)
            const { name, status } = this.props.encounter
            this.setState({
                name,
                status,
                updating: this.props.encounter,
                style: {
                    width: '25em',
                }
            })
        }
    }

    validateInput = () => {
        //TODO
    }

    handleKeyDown = (event) => {
        switch(event.key) {
          case 'Enter':
            this.handleSubmit(this.props.toggleButtonNavigation)
            break
          case 'Escape':
            this.handleCancel()
            break
          default:
            break
        }
      }

    handleChange = (type, value) => {
        switch (type) {
            case 'name':
                this.setState({
                    name: value
                })
                break
            case 'status':
                this.setState({
                    status: value
                })
                break
            default:
                return
        }
    }

    handleUpdate = () => {
        console.log('handleUpdate')
        const { updating, ...changedEncounter } = this.state
        const fieldsToUpdate = Object.entries(changedEncounter).filter(([key, value]) => {
            return (updating[key] && updating[key] !== value)
          }).map(([propName, value]) => {
            return {
              propName,
              value
            }
          })
          if(fieldsToUpdate.length > 0) {
            this.props.dispatch(patchEncounter(localStorage.getItem('DNDTOKEN'), fieldsToUpdate, updating._id))
          } else {
            this.handleCancel()
          }
    }

    handleCreate = () => {
        console.log('handleCreate')
        const payload = {
            name: this.state.name,
            status: this.state.status
        }

        this.props.dispatch(createEncounter(localStorage.getItem('DNDTOKEN'), payload))
        this.props.toggleButtonNavigation('Submit_Encounter')
    }

    handleSubmit = () => {
        if(!this.state.updating) {
            this.handleCreate()
        } else {
            this.handleUpdate()
        }

    }

    handleCancel = () => {
        this.props.dispatch(cancelEditEncounter())
    }

    render() {
        const { name, status } = this.state
        const { toggleButtonNavigation } = this.props
        return (
            <MDBContainer style={this.state.style}>
                <MDBRow className="d-flex justify-content-center">
                    <MDBCol md="8">
                        <MDBCard className="create-character">
                            <MDBCardBody className="mx-4 d-row" >
                                <div className="text-center">
                                    <h3 className="mb-5">
                                        <strong style={formHeaderStyle}>
                                            &nbsp;{this.state.updating ? `Edit ${this.state.updating.name}` : 'Create Encounter'}
                                        </strong>
                                    </h3>
                                </div>
                                <MDBIcon icon="khanda" />
                                <MDBInput
                                    label="Name"
                                    group
                                    containerClass="mb-0"
                                    required={true}
                                    onChange={(e) => this.handleChange("name", e.target.value)}
                                    onKeyDown={(e) => this.handleKeyDown(e)}
                                    value={name}
                                />
                                <MDBInput
                                    label="Status"
                                    group
                                    onChange={(e) => this.handleChange("status", e.target.value)}
                                    onKeyDown={(e) => this.handleKeyDown(e)}
                                    value={status}
                                />
                                <br />
                                <div className="text-center">
                                    <MDBBtn
                                        type="button"
                                        rounded
                                        color="black"
                                        className="btn-block z-depth-1a"
                                        onClick={() => this.handleSubmit(toggleButtonNavigation)}
                                    >
                                        {this.state.updating? 'Save' : 'Create'}
                                    </MDBBtn>
                                </div>
                                {this.state.updating? <br /> : ''}
                                {this.state.updating &&
                                <div className="text-center">
                                    <MDBBtn
                                        type="button"
                                        rounded
                                        color="black"
                                        className="btn-block z-depth-1a"
                                        onClick={() => this.handleCancel()}
                                    >
                                        Cancel
                                    </MDBBtn>
                                </div>
                                }
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>

            </MDBContainer>
        )
    }
}

function mapStateToProps({ User }) {
    return {
        User
    }
}

const formHeaderStyle = {
    color:'black'
}
  

export default connect(mapStateToProps)(EncounterForm)