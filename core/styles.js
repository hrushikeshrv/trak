import {StyleSheet} from "react-native";

export const constants = {
    background: 'white',
    backgroundDark1: '#DEDEDE',

    fontColor: 'black',
    mutedFontColor: 'grey',

    primaryLight2: '#E57373',
    primaryLight1: '#EF5350',
    primaryColor: '#F44336',
    primaryDark1: '#E53935',
    primaryDark2: '#D32F2F',

    errorLight2: '#E57373',
    errorLight1: '#EF5350',
    errorColor: '#F44336',
    errorDark1: '#E53935',
    errorDark2: '#D32F2F',
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: constants.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ajc: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    jcc: {
        justifyContent: 'center'
    },
    jcsb: {
        justifyContent: 'space-between',
    },
    centeredRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    row: {
        flexDirection: 'row',
        width: '100%',
    },
    screenContainer: {
        backgroundColor: constants.background,
        padding: 20,
        flex: 1,
    },
    button: {
        backgroundColor: constants.background,
        color: 'black',
        borderColor: constants.primaryDark1,
        borderWidth: 3,
        padding: 15,
        marginBottom: 20,
        marginLeft: 5,
        marginRight: 5,
    },
    deleteButton: {
        padding: 10,
        borderColor: 'black',
        borderRadius: 5,
        backgroundColor: constants.errorColor,
    },
    marginTop: {
        marginTop: 20
    },
    marginTopDouble: {
        marginTop: 50
    },
    marginBottom: {
        marginBottom: 20,
    },
    bold: {
        fontWeight: 'bold'
    },
    small: {
        fontSize: 13,
    },
    textInput: {
        borderBottomColor: constants.primaryDark1,
        borderBottomWidth: 2,
        padding: 7,
        margin: 5,
        minWidth: 200
    },
    trackerTileContainer: {
        marginTop: 10,
        flexDirection: 'row',
        flex: 1,
        flexWrap: 'wrap',
    },
    trackerTile: {
        width: '80%',
        padding: 20,
        margin: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: constants.primaryLight1,
        color: 'black',
        borderColor: constants.primaryDark1,
        borderWidth: 3
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 30,
    },
    recordRow: {
        padding: 10,
        borderBottomColor: 'grey',
        borderBottomWidth: 2
    }
});

export default styles;
