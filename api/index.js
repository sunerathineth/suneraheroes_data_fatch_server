import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();

// To get the current directory of the module
const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const apiKey = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjE4YTIzYjMyLWNiMWUtNDI2NS04ZjY0LThkYzkyOWFkYTc2MyIsImlhdCI6MTczMzA2MTA3Miwic3ViIjoiZGV2ZWxvcGVyL2ZiNzFhOTRiLTExNzYtNGFjNC0zNzMzLThhMjA5NzQxNzFhMiIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjExMi4xMzUuNzcuMTgiXSwidHlwZSI6ImNsaWVudCJ9XX0.sfWdFgpegbOlNA7UECzoP-QxEO2t-CAexMSSIKCjbV_F8oaT_M0HmXxXs1ZWSqguMneWIdJN_yu7u8AthUJ2MA`
const clanTag = 'VGR09CL8';
const playerTag = 'L8GLLR2PU';

let clanData = {};
let playerData = {};
let warLog = [];
let cwlData = {};
let currentWarData = {};
let capitalRaidSeasons = [];

async function fetchClanInfo() {
    const fetch = (await import('node-fetch')).default;

    try {
        const clanResponse = await fetch(`https://api.clashofclans.com/v1/clans/%23${clanTag}/members`, {
            method: 'GET',
            headers: { Accept: 'application/json', Authorization: `Bearer ${apiKey}` },
        });
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
    } catch (error) {
        console.error('Fetch Error:', error);
        throw error;
    }
}

app.get('/', async (req, res) => {
    try {
        await fetchClanInfo();
        res.json({ playerData, clanData, warLog, cwlData, currentWarData, capitalRaidSeasons });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).send('Server Error');
    }
});

// This will export the serverless function for Vercel
export default (req, res) => app(req, res);
