import React, { Component } from 'react'
import { connect } from 'react-redux'
import { MDBContainer, MDBCol, MDBBtn } from 'mdbreact'
import EncounterSelect from '../encounters/EncounterSelect'
import InitiativeRow from './InitiativeRow'
import InitiativeForm from './InitiativeForm'
import { getNextTurn } from '../../redux/actions/initiatives'
import MyMDBModal from '../modal/MDBModal';
import './TurnTracker.css'

class TurnTracker extends Component {
    constructor(props) {
        super(props)
        let encounter = false
        let fixedEncounter = false
        if (this.props.setEncounter) {
            encounter = this.props.setEncounter
            fixedEncounter = true
        } else if (this.props.Encounters.list && this.props.Encounters.list.length > 0) {
            encounter = this.props.Encounters.list[0]
        }

        const initiatives = this.props.Initiatives.list
            .filter(initiative => {
                return initiative.encounter === encounter._id
            }).sort((a, b) => b.initiative - a.initiative).sort((a, b) => a._id - b._id)
        const characters = this.props.Characters.list
            .filter(character => {
                const ids = initiatives.map(i => {
                    return i.character ? i.character._id : false
                })
                return ids.includes(character._id)
            })
        const activeTurn = initiatives.find(i => i.active)
        this.state = {
            encounter,
            initiatives,
            characters,
            activeTurn: activeTurn ? activeTurn : null,
            fixedEncounter
        }
    }

    componentDidMount() {
        if (this.refs.activeTurn) {
            const el = document.getElementById('activeTurn')
            window.scrollTo(0, el.offsetTop + el.offsetHeight)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { newTurn } = this.props.Initiatives
        if ((newTurn && newTurn !== prevProps.Initiatives.newTurn)
            || this.state.encounter !== prevState.encounter) {
            const el = document.getElementById('activeTurn')
            if (el) window.scrollTo(0, el.offsetTop + el.offsetHeight)
        }
        if (this.props.setEncounter !== prevProps.setEncounter) {
            this.setState({
                encounter: this.props.setEncounter ? this.props.setEncounter : this.props.Encounters.list[0],
                fixedEncounter: !this.state.fixedEncounter
            })
        }
        if ((this.props.Characters.list !== prevProps.Characters.list ||
            this.props.Initiatives.list !== prevProps.Initiatives.list) &&
            this.state.encounter) {
            const initiatives = this.props.Initiatives.list
                .filter(initiative => {
                    return initiative.encounter === this.state.encounter._id
                }).sort((a, b) => b.initiative - a.initiative)
            const characters = this.props.Characters.list
                .filter(character => {
                    const ids = initiatives.map(i => {
                        return i.character ? i.character._id : false
                    })
                    return ids.includes(character._id)
                })
            const activeTurn = initiatives.find(i => i.active)
            this.setState({
                initiatives,
                characters,
                activeTurn: activeTurn ? activeTurn : null
            })
        }
    }

    setEncounter = (encounter) => {
        const initiatives = this.props.Initiatives.list.filter(initiative => {
            return initiative.encounter === encounter._id
        }).sort((a, b) => b.initiative - a.initiative)
        const activeTurn = initiatives.find(i => i.active)
        this.setState({
            encounter,
            initiatives,
            activeTurn: activeTurn ? activeTurn : null
        })
    }

    nextTurn = () => {
        this.props.dispatch(
            getNextTurn(localStorage.getItem('DNDTOKEN'),
                this.state.encounter._id,
                this.state.activeTurn)
        )
    }

    toggleModal = () => {
        this.setState({
            modalOpen: !this.state.modalOpen
        })
    }

    render() {
        const InitiativeFormAttributes = {
            characters: this.props.Characters.list,
            setEncounter: this.state.encounter,
            dispatch: this.props.dispatch
        }
        const { initiatives } = this.state
        return (
            <div>
                {
                    (initiatives) && (
                        <React.Fragment>
                            {this.state.modalOpen && (
                                <MyMDBModal
                                    toggle={this.toggleModal}
                                    isOpen={true}
                                    fullHeight
                                    centered
                                    position="left"
                                    backdrop={false}
                                    canConfirm={false}
                                    labels={{
                                        header: 'Initiative Roll',
                                        confirm: 'Insert Character'
                                    }}>
                                    <InitiativeForm {...InitiativeFormAttributes} />
                                </MyMDBModal>
                            )}
                            <MDBContainer className="d-flex justify-content-center">
                                <MDBCol md="12">
                                    <div className="turn-tracker-sticky-header">
                                        <div className="turn-tracker-sticky-header-content">
                                            {
                                                this.state.fixedEncounter ? (
                                                    <div style={{ paddingTop: '2rem' }}>
                                                        <h3 className="turn-tracker-sticky-header-content-text">Active Encounter: {this.state.encounter.name}</h3>
                                                        <h4 className="turn-tracker-sticky-header-content-text">{initiatives.length} Characters</h4>
                                                    </div>
                                                ) : (
                                                        <div style={{ padding: '1rem 1rem 0rem 1rem' }}>
                                                            <EncounterSelect
                                                                encounters={this.props.Encounters.list}
                                                                value={this.state.encounter}
                                                                onChange={value => this.setEncounter(value)}
                                                                extra="trackerselect"
                                                            />
                                                        </div>
                                                    )
                                            }
                                            {this.props.User.isDM ?
                                                <div className="d-flex justify-content-center">
                                                    <div className='d-flex justify-content-center'>
                                                        <MDBBtn
                                                            className="shrink-button"
                                                            type="button"
                                                            color="black"
                                                            onClick={this.toggleModal}
                                                        >
                                                            Add Characters
                                                </MDBBtn>
                                                        {
                                                            initiatives.length > 1 && (
                                                                <MDBBtn
                                                                    className="shrink-button"
                                                                    type="button"
                                                                    color={this.state.activeTurn ? 'unique' : 'black'}
                                                                    onClick={() => this.nextTurn()}
                                                                >
                                                                    {!this.state.activeTurn ? 'Start Encounter' : 'Next Turn'}
                                                                </MDBBtn>
                                                            )
                                                        }
                                                    </div>
                                                </div> :
                                                <br/>
                                            }
                                        </div>
                                    </div>
                                    <div className="turn-tracker-content">
                                        {this.state.encounter && initiatives && (
                                            initiatives.map(initiative => {
                                                return (
                                                    <div
                                                        tabIndex={initiative.active ? '1' : null}
                                                        key={initiative._id}
                                                        id={initiative.active ? 'activeTurn' : null}
                                                        ref={initiative.active ? 'activeTurn' : null}
                                                    >
                                                        <InitiativeRow
                                                            active={initiative.active}
                                                            key={initiative._id}
                                                            initiative={initiative}
                                                            character={this.state.characters.find(c => c._id === initiative.characterStamp._id)}
                                                            encounter={this.state.encounter}
                                                            dispatch={this.props.dispatch}
                                                            totalRows={initiatives.length}
                                                            user={this.props.User}
                                                        />
                                                    </div>
                                                )
                                            })
                                        )}
                                    </div>
                                </MDBCol>
                            </MDBContainer>
                        </React.Fragment>
                    )
                }
            </div>
        )
    }
}


function mapStateToProps({ User, Encounters, Characters, Initiatives }) {
    return {
        User,
        Encounters,
        Characters,
        Initiatives
    }
}

export default connect(mapStateToProps)(TurnTracker)