import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

const BORDER_COLOR = '#bfbfbf'
const BORDER_STYLE = 'solid'
const COL1_WIDTH = 65
const COLN_WIDTH = 35
const styles = StyleSheet.create({
  body: {
    padding: 30,
    fontSize: 14,
    fontFamily: "Roboto",
    fontWeight: 400
  },
  title: {
    textAlign: 'center',
    paddingBottom: '50px',
    paddingTop: '10px'
  },
  price: {
    textAlign: 'right',
    paddingBottom: '20px',
    paddingTop: '20px',
    fontWeight: 600
  },
  name: {
    textAlign: 'left',
    fontSize: 12,
    paddingBottom: '10px'
  },
  subtitle: {
    textAlign: 'left',
    paddingBottom: '20px',
    paddingTop: '20px',
    fontWeight: 600
  },
  image: {
    width: '60%',
    textAlign: 'center'
  },
  table: { 
    display: "table", 
    width: "100%", 
    borderStyle: BORDER_STYLE, 
    borderColor: BORDER_COLOR,
    borderWidth: 1, 
    borderRightWidth: 0, 
    borderBottomWidth: 0,
    
  }, 
  tableRow: { 
    margin: "auto", 
    flexDirection: "row" 
  }, 
  tableCol1Header: { 
    width: COL1_WIDTH + '%', 
    borderStyle: BORDER_STYLE, 
    borderColor: BORDER_COLOR,
    borderBottomColor: '#000',
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0
  },     
  tableColHeader: { 
    width: COLN_WIDTH + "%", 
    borderStyle: BORDER_STYLE, 
    borderColor: BORDER_COLOR,
    borderBottomColor: '#000',
    bgColor: '000000',
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0
  },   
  tableCol1: { 
    width: COL1_WIDTH + '%', 
    borderStyle: BORDER_STYLE, 
    borderColor: BORDER_COLOR,
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0
  },   
  tableCol: { 
    width: COLN_WIDTH + "%", 
    borderStyle: BORDER_STYLE, 
    borderColor: BORDER_COLOR,
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0,
    textAlign: 'center'
  }, 
  tableCellHeader: {
    margin: 5, 
    fontSize: 12,
    fontWeight: 400
  },  
  tableCell: { 
    margin: 5, 
    fontSize: 12 
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

Font.register({
    family: "Roboto",
    src:
      "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf"
});

export default function ConfirmDocument (props) {

    return (
        <Document>
            <Page style={styles.body}>
            <Text style={styles.title}>Rent-a-car</Text>
            
            <Text style={styles.name}>Ime i prezime: {props.resInfo.ime} {props.resInfo.prezime}</Text>
            <Text style={styles.name}>E-mail adresa: {props.resInfo.mail}</Text>
            <Text style={styles.name}>Datum rođenja: {props.resInfo.datumrod}</Text>
            
            <Text style={styles.subtitle}>Potvrda rezervacije br. {props.sifnajam} | {props.time}</Text>
            
            <View style={styles.table}> 
                <View style={styles.tableRow}> 
                <View style={styles.tableCol1Header}> 
                    <Text style={styles.tableCell}>Datumi i lokacije </Text>
                </View> 
                <View style={styles.tableColHeader}> 
                    <Text style={styles.tableCell}>Informacije o vozilu</Text>
                </View> 
        
                </View>
                <View style={styles.tableRow}> 
                <View style={styles.tableCol1}> 
                    <Text style={styles.tableCell}>Vrijeme prikupljanja: {props.resInfo.datumVrijemeOd}</Text>
                    <Text style={styles.tableCell}>Vrijeme vraćanja: {props.resInfo.datumVrijemeDo}</Text>
                    <Text style={styles.tableCell}>Lokacija prikupljanja: {props.resInfo.ulicap} {props.resInfo.kucnip}, {props.resInfo.pbrp} {props.resInfo.mjestop}</Text>
                    <Text style={styles.tableCell}>Lokacija vraćanja: {props.resInfo.ulicad} {props.resInfo.kucnid}, {props.resInfo.pbrd} {props.resInfo.mjestod}</Text>
                </View> 
                <View style={styles.tableCol}> 
                    <Image
                    style={styles.image}
                    src={props.resInfo.urlslika}
                    crossorigin="anonymous"
                    />
                    <Text style={styles.tableCell}>{props.resInfo.nazivproizvodac} {props.resInfo.nazivmodel}</Text>
                    <Text style={styles.tableCell}>Registracija: {props.resInfo.registracija}</Text>
                </View> 
        
                </View>         
            </View>
            
            <Text style={styles.price}>Ukupni iznos: {props.resInfo.iznosnajma} kn</Text>
            
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                `${pageNumber} / ${totalPages}`
            )} fixed />
            
            </Page>
        </Document>

    ) 
}
