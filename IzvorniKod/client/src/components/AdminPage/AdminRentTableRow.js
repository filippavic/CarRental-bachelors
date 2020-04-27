import React, { Component } from 'react';
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown
} from "reactstrap";

var moment = require('moment');

export class AdminRentTableRow extends Component {
  constructor(props){
    super(props);
    this.state = {
        late: false
    };
  }

  componentWillReceiveProps(props) {
    var now = moment();
    var planirano = moment(props.rent.planiranidatumvrijemedo, 'DD.MM.YYYY. HH:mm');
    if(!props.rent.datumvrijemedo && now.isAfter(planirano)){
      this.setState({late: true});
    }
    else{
      this.setState({late: false});
    }
  }

  setPickedUp = (e) => {
    e.preventDefault();
    let pickupValues = {
      registratskaoznaka: this.props.rent.registratskaoznaka,
      sifnajam: this.props.rent.sifnajam,
      sifvozilo: this.props.rent.sifvozilo,
      siflokprikupljanja: this.props.rent.siflokprikupljanja
    };
    this.props.setPickedUp(pickupValues);
  }

  setFinished = (e) => {
    e.preventDefault()
    let finishValues = {
      registratskaoznaka: this.props.rent.registratskaoznaka,
      sifnajam: this.props.rent.sifnajam,
      sifvozilo: this.props.rent.sifvozilo,
      siflokvracanja: this.props.rent.siflokvracanja
    };
    this.props.setFinished(finishValues);
  }

    render() {
        return (
            <>
            <tr>
              <th scope="row">
                {this.props.rent.registratskaoznaka}
              </th>
              <td>{this.props.rent.ime}</td>
              <td>{this.props.rent.prezime}</td>
              <td>{this.props.rent.planiranidatumvrijemeod}</td>
              <td style={this.state.late ? {color: "#ff6961"} : {}}>{this.props.rent.planiranidatumvrijemedo}</td>
              <td>{this.props.rent.datumvrijemeod}</td>
              <td>{this.props.rent.siflokprikupljanja}</td>
              <td>{this.props.rent.siflokvracanja}</td>
              <td>{this.props.rent.iznosnajma} kn</td>
              <td className="text-right">
                  <UncontrolledDropdown>
                    <DropdownToggle
                      className="btn-icon-only text-light"
                      color=""
                      role="button"
                      size="sm"
                    >
                      <i className="fas fa-ellipsis-v" />
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-arrow" right>
                      <DropdownItem
                        href=""
                        onClick={this.setPickedUp}
                        disabled={this.props.rent.datumvrijemeod ? true : false}
                      >
                        Označi kao prikupljeno
                      </DropdownItem>
                      <DropdownItem
                        href=""
                        onClick={this.setFinished}
                        disabled={this.props.rent.datumvrijemeod ? false : true}
                      >
                        Označi kao vraćeno
                      </DropdownItem>
                      <DropdownItem
                        href=""
                        onClick={e => e.preventDefault()}
                        disabled
                      >
                        Detalji
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </td>
            </tr>
            </>
        )
    }
}

export default AdminRentTableRow
