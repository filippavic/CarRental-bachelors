import React, { Component } from 'react'

export class UserTableRow extends Component {
    render() {
        return (
            <>
            <tr>
              <th scope="row">
                {this.props.reservation.nazivproizvodac} {this.props.reservation.nazivmodel}
              </th>
              <td>{this.props.reservation.datumvrijemeod}</td>
              <td>{this.props.reservation.datumvrijemedo}</td>
              <td>{this.props.reservation.mjestop}</td>
              <td>{this.props.reservation.mjestod}</td>
              <td>{this.props.reservation.iznosnajma} kn</td>
            </tr>
            </>
        )
    }
}

export default UserTableRow
