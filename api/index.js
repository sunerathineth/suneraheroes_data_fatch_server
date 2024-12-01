import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();

// To get the current directory of the module
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Now you can use __dirname like in CommonJS
app.use(express.static(path.join(__dirname, 'public')));

const apiKey = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjE4YTIzYjMyLWNiMWUtNDI2NS04ZjY0LThkYzkyOWFkYTc2MyIsImlhdCI6MTczMzA2MTA3Miwic3ViIjoiZGV2ZWxvcGVyL2ZiNzFhOTRiLTExNzYtNGFjNC0zNzMzLThhMjA5NzQxNzFhMiIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjExMi4xMzUuNzcuMTgiXSwidHlwZSI6ImNsaWVudCJ9XX0.sfWdFgpegbOlNA7UECzoP-QxEO2t-CAexMSSIKCjbV_F8oaT_M0HmXxXs1ZWSqguMneWIdJN_yu7u8AthUJ2MA`
const clanTag = `VGR09CL8`
const playerTag = `L8GLLR2PU`

// Variables to store data
let clanData = {};
let playerData = {};
let warLog = [];
let cwlData = {};
let currentWarData = {};
let capitalRaidSeasons = [];

// Fetch Clan Information
async function fetchClanInfo() {
    const fetch = (await import('node-fetch')).default; // Dynamic import

    try {
        // Fetch Clan Members
        const clanResponse = await fetch(
            `https://api.clashofclans.com/v1/clans/%23${clanTag}/members`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );

        if (!clanResponse.ok) {
            const errorText = await clanResponse.text();
            console.error(`HTTP error! status: ${clanResponse.status}, ${errorText}`);
            throw new Error(`Error: ${errorText}`);
        }

        const clanDataResponse = await clanResponse.json();
        clanData = clanDataResponse.items.map(member => ({
            name: member.name,
            role: member.role,
            townHallLevel: member.townHallLevel,
            trophies: member.trophies,
            builderBaseTrophies: member.builderBaseTrophies,
            donations: member.donations,
            league: member.league ? member.league.name : 'Unranked',
        }));

        // Fetch War Log
        const warLogResponse = await fetch(
            `https://api.clashofclans.com/v1/clans/%23${clanTag}/warlog`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );
        if (warLogResponse.ok) {
            const warLogData = await warLogResponse.json();
            warLog = warLogData.items;
        } else {
            console.error('Error fetching war log');
        }

        // Fetch CWL (Clan War League) Data
        const cwlResponse = await fetch(
            `https://api.clashofclans.com/v1/clans/%23${clanTag}/currentwar`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );
        if (cwlResponse.ok) {
            const cwlDataResponse = await cwlResponse.json();
            cwlData = cwlDataResponse;
        } else {
            console.error('Error fetching CWL data');
        }

        // Fetch Current War Data
        const currentWarResponse = await fetch(
            `https://api.clashofclans.com/v1/clans/%23${clanTag}/currentwar`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );
        if (currentWarResponse.ok) {
            const currentWarDataResponse = await currentWarResponse.json();
            currentWarData = currentWarDataResponse;
        } else {
            console.error('Error fetching current war data');
        }

        // Fetch Capital Raid Seasons Data
        const capitalRaidsResponse = await fetch(
            `https://api.clashofclans.com/v1/clans/%23${clanTag}/capitalraidseasons`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );
        if (capitalRaidsResponse.ok) {
            const capitalRaidsData = await capitalRaidsResponse.json();
            capitalRaidSeasons = capitalRaidsData.items;
        } else {
            console.error('Error fetching capital raid seasons');
        }

        // Fetch Player Information
        const playerResponse = await fetch(
            `https://api.clashofclans.com/v1/players/%23${playerTag}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );
        if (playerResponse.ok) {
            const playerDataResponse = await playerResponse.json();
            playerData = {
                name: playerDataResponse.name,
                trophies: playerDataResponse.trophies,
                townHallLevel: playerDataResponse.townHallLevel,
                league: playerDataResponse.league ? playerDataResponse.league.name : 'Unranked',
                donations: playerDataResponse.donations,
            };
        } else {
            console.error('Error fetching player data');
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        throw error;
    }
}

// API endpoint
app.get('/', async (req, res) => {
    try {
        await fetchClanInfo();
        res.json({
            clanData,
            warLog,
            cwlData,
            currentWarData,
            capitalRaidSeasons,
            playerData
        });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).send('Server Error');
    }
});

// Export the serverless function handler for Vercel
export default app;
