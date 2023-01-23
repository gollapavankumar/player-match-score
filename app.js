const exprees = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const databasePath = path.join(__dirname, "cricketMatchDetails.db");

const app = express();
app.use(exprees.json());

const db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      fileName: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://loclahost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();
const convertPlayerObjectAndResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
  };
};

const convetMatchObjectAndResponseObject = (dbObject) => {
    return {
        matchId: dbObject.match_id,
        match:dbObject.match,
        year:dbObject.year
    }
}
//GET API PLAYERS;

app.get("/players/", async(request,response) => {
    const = getPlayersQuery = `
    SELECT
        *
    FROM
        player;
    `;
    const playersArray = await database.all(getPlayersQuery);
    response.send(
        playersArray.map((eachplayer) => 
        convertPlayerObjectAndResponseObject(eachplayer)
        );
    );
});

//GET ONE PLAYER ID

app.get("/players/:playerId/", async(request,response) =>{
    const {playerId} = request.params;
    const getPlayeQuery = `
    SELECT
        *
    FROM
        playes
    WHERE
        player_id = ${playerId};
    `;
    const player = await database.get(getPlayeQuery);
    response.send(convertPlayerObjectAndResponseObject(player))
});
//GET PUT PLAYER
app.get("/players/:playerId/", async(request,response) =>{
    const {playerName} = request.body;
    const {playerId} = request.params;
    const updatePlayerQuery = `
    UPDATE
        player
    SET
        player_name = '${playerName}'
    WHERE
        player_id = ${playerId};
    `;
    await datebase.run(updatePlayerQuery);
    response.send("Player Details Updated")

});
//GET MATCH ID API

app.get("/matches/:matchId", async(request,response) => {
    const {matchId} = request.params;
    const getMatchQuery = `
    SELECT
        *
    FROM
        match
    WHERE
        match_id = ${matchId};
    `;
    const match = await database.get(getMatchQuery);
    response.send(convetMatchObjectAndResponseObject(match));
});
//GET API 
app.get("/players/:playerId/matches", async (request,response) => {
    const {playerId} = request.params;
    const getPlayersQuery = `
    SELECT
        *
    FROM
        player_match_score
    NATURAL JOIN 
        match_details
    WHERE
        player_id = ${playerId};
    `;
    const playersMatchArray = await database.all(getPlayersQuery);
    response.send(
        playersMatchArray.map((eachMatch) => 
        convetMatchObjectAndResponseObject(eachMatch))
    )
});

// GET MATCH API
app.get("/matches/:matchId/players", async (request,response) => {
    const {matchId} = request.params;
    const  getMatchsQuery = `
    SELECT
        *
    FROM
        match_details
    NATURAL JOIN
        player_match_score
    WHERE
        match_id = ${matchId};
    `;
    const matchPlayerArray = await database.all(getMatchsQuery);
    response.send(
        matchPlayerArray.map((eachPlayer) =>
        convertPlayerObjectAndResponseObject(eachPlayer))
    )
});

//GET ALL API

app.get("/players/:playerId/playerScores", async(request,response) => {
    const {playerId} = request.params;
    const getPlayerScored = `
    SELECT
    player_details.player_id AS playerId,
    player_details.player_name AS playerName,
    SUM(player_match_score.score) AS totalScore,
    SUM(fours) AS totalFours,
    SUM(sixes) AS totalSixes FROM 
    player_details INNER JOIN player_match_score ON
    player_details.player_id = player_match_score.player_id
    WHERE player_details.player_id = ${playerId};
    `;
    const player = await datebase.get(getPlayerScored);
    response.send({
 
    totalScore: stats["SUM(score)"],
    totalFours: stats["SUM(fours)"],
    totalSixes: stats["SUM(sixes)"],
    });
});

module.exports = app;














