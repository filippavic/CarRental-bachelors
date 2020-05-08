import React, { Component } from 'react';
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown
} from "reactstrap";


export class AdminPriceTableRow extends Component {
  constructor(props){
    super(props);
  }


    render() {
        return (
            <>
            <tr>
              <th scope="row">
                {this.props.price.sifmodel}
              </th>
              <td>{this.props.price.nazivproizvodac}</td>
              <td>{this.props.price.nazivmodel}</td>
              <td>{this.props.price.cijenapodanu}</td>
            </tr>
            </>
        )
    }
}

export default AdminPriceTableRow