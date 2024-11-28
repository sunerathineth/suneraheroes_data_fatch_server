const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')))

const apiKey = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjNiMzllYWMwLTJjOTgtNGRhNC05Mzk0LTAxM2FlODU1MDNjYSIsImlhdCI6MTczMjgyMDgyNiwic3ViIjoiZGV2ZWxvcGVyL2ZiNzFhOTRiLTExNzYtNGFjNC0zNzMzLThhMjA5NzQxNzFhMiIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjExMi4xMzUuNzAuMTUzIl0sInR5cGUiOiJjbGllbnQifV19.xi9oMEiabnc7-QI6SV7hUGLXk5WtSxAXpkiTTpg6wh4Vm6Ps6SN0SvZmgBK_zB542xW-TTBRkek-qrzHXEItkg`
const clanTag = `VGR09CL8`

// Arrays to hold the information
let names = []
let roles = []
let townHallLevels = []
let leagues = []
let trophies = []
let builderBaseTrophies = []
let donations = []

function One() {
    async function fetchClanInfo() {
        const { default: fetch } = await import('node-fetch')

        try {
            const response = await fetch(`https://api.clashofclans.com/v1/clans/%23${clanTag}/members`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error(`HTTP error! status: ${response.status}, ${errorText}`)
                throw new Error(`Error: ${errorText}`)
            }

            const data = await response.json()

            names = []
            roles = []
            townHallLevels = []
            leagues = []
            trophies = []
            builderBaseTrophies = []
            donations = []

            data.items.forEach(member => {
                names.push(member.name)
                roles.push(member.role)
                townHallLevels.push(member.townHallLevel)
                leagues.push(member.league ? member.league.name : "Unranked")
                trophies.push(member.trophies)
                builderBaseTrophies.push(member.builderBaseTrophies)
                donations.push(member.donations)
            })

            console.log(roles)

        } catch (error) {
            console.error('Fetch Error:', error)
            throw error
        }
    }

    app.get('/', async (req, res) => {
        try {
            // res.send('Welcome to the Clash of Clans Clan Info API');
            await fetchClanInfo()
            res.json({
                names,
                roles,
                townHallLevels,
                leagues,
                trophies,
                builderBaseTrophies,
                donations
            })
        } catch (error) {
            console.error('Server Error:', error)
            res.status(500).send('Server Error')
        }
    })

    app.listen(3000, () => {
        console.log('Server running on port 3000')
    })
}

One()


// Arrays to hold war-related information
let clanName = "";
let opponentClanName = "";
let warState = "";
let clanStars = 0;
let opponentStars = 0;
let clanAttacks = 0;
let opponentAttacks = 0;

function retrieveWarInfo() {
    async function fetchWarInfo() {
        const { default: fetch } = await import('node-fetch');

        try {
            const response = await fetch(`https://api.clashofclans.com/v1/clans/%23${clanTag}/currentwar`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`HTTP error! status: ${response.status}, ${errorText}`);
                throw new Error(`Error: ${errorText}`);
            }

            const data = await response.json();

            // Clear any previous data
            clanName = "";
            opponentClanName = "";
            warState = "";
            clanStars = 0;
            opponentStars = 0;
            clanAttacks = 0;
            opponentAttacks = 0;

            // Process the war information
            clanName = data.clan.name;
            opponentClanName = data.opponent.name;
            warState = data.state;
            clanStars = data.clan.stars;
            opponentStars = data.opponent.stars;
            clanAttacks = data.clan.attacks || 0; // Some wars may not have all attacks done
            opponentAttacks = data.opponent.attacks || 0;

            console.log(`War between ${clanName} and ${opponentClanName}: State = ${warState}`);

        } catch (error) {
            console.error('Fetch Error:', error);
            throw error;
        }
    }

    // Define an endpoint to provide war information
    app.get('/', async (req, res) => {
        try {
            await fetchWarInfo(); // Fetch the latest war information
            res.json({
                clanName,
                opponentClanName,
                warState,
                clanStars,
                opponentStars,
                clanAttacks,
                opponentAttacks
            });
        } catch (error) {
            console.error('Server Error:', error);
            res.status(500).send('Server Error');
        }
    });

    // Start the server
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
}

// Call the function to start fetching war information
// retrieveWarInfo();