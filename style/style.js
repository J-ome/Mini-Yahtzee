import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#675046'
  },
  header: {
    marginTop: 30,
    marginBottom: 15,
    backgroundColor: '#812700',
    flexDirection: 'row',
  },
  footer: {
    marginTop: 20,
    backgroundColor: '#812700',
    flexDirection: 'row'
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 23,
    textAlign: 'center',
    margin: 10,
  },
  author: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
  },
  gameinfo: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 20,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5
  },
  row: {
    marginTop: 20,
    padding: 10
  },
  flex: {
    flexDirection: "row"
  },
  button: {
    margin: 30,
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#504743",
    width: 150,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  buttonText: {
    color:"#ffffff",
    fontSize: 20
  }, 
  bigDice: {
    alignSelf: 'center',
    marginBottom: 12,
    marginTop: 15
  },
  pointsRow: {
    fontSize: 25,
    marginTop: 15
  },
  pointsText: {
    padding: 5,
    fontSize: 20
  },
  pointsTitle: {
    alignSelf: "center",
  },
  pointNumbers: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginLeft: 15,
    marginRight: 42,
    marginTop: 15
  },
  rulesHeader: {
    textAlign: "center",
    fontSize: 25,
  },
  rules: {
    textAlign: "center",
    fontSize: 15,
    marginBottom: 5,
  },
  playButton: {
    margin: 30,
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#504743",
    width: 150,
    borderRadius: 15,
    justifyContent: 'center',
    alignSelf: "center",
    color: "#ffffff",
  },
  clearScoreboard: {
    color:"#ffffff",
    fontSize: 15
  },
  scoreboard: {
    alignSelf: "center",
    padding: 5,
  },
  scoreboardBorder: {
    borderWidth: 1,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10,
    borderRadius: 15
  }
});