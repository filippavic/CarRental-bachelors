import React, { Component } from 'react';
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown
} from "reactstrap";


export class AdminLocationTableRow extends Component {
  constructor(props){
    super(props);
  }

  changeLocationStatus = (e) => {
    e.preventDefault();
    let locationValues = {
      isActive: this.props.isActive,
      siflokacija: this.props.location.siflokacija
    };
    this.props.changeLocationStatus(locationValues);
  }

  openChangeModal = (e) => {
    e.preventDefault();
    const locationData = {
      siflokacija: this.props.location.siflokacija,
      ulica: this.props.location.ulica,
      kucnibroj: this.props.location.kucnibroj,
      pbrmjesto: this.props.location.pbrmjesto,
      nazivmjesto: this.props.location.nazivmjesto,
      koddrzava: this.props.location.koddrzava,
      nazivdrzava: this.props.location.nazivdrzava
    };
    this.props.openChangeModal(locationData);
  }


    render() {
        return (
            <>
            <tr>
              <th scope="row">
                {this.props.location.siflokacija}
              </th>
              <td>{this.props.location.ulica}</td>
              <td>{this.props.location.kucnibroj}</td>
              <td>{this.props.location.pbrmjesto}</td>
              <td>{this.props.location.nazivmjesto}</td>
              <td>{this.props.location.nazivdrzava}</td>
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
                      {this.props.isActive ? (
                        <DropdownItem
                        href=""
                        onClick={this.changeLocationStatus}
                      >
                        Zatvori podružnicu
                      </DropdownItem>
                      ) : (
                        <DropdownItem
                        href=""
                        onClick={this.changeLocationStatus}
                      >
                        Otvori podružnicu
                      </DropdownItem>
                      )}
                      <DropdownItem
                        href=""
                        onClick={this.openChangeModal}
                      >
                        Uredi
                      </DropdownItem>
                      
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </td>
            </tr>
            </>
        )
    }
}

export default AdminLocationTableRow
