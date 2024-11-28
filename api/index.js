const { default: fetch } = require('node-fetch');
const express = require('express');
const cors = require('cors');
const app = express();

const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjNiMzllYWMwLTJjOTgtNGRhNC05Mzk0LTAxM2FlODU1MDNjYSIsImlhdCI6MTczMjgyMDgyNiwic3ViIjoiZGV2ZWxvcGVyL2ZiNzFhOTRiLTExNzYtNGFjNC0zNzMzLThhMjA5NzQxNzFhMiIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjExMi4xMzUuNzAuMTUzIl0sInR5cGUiOiJjbGllbnQifV19.xi9oMEiabnc7-QI6SV7hUGLXk5WtSxAXpkiTTpg6wh4Vm6Ps6SN0SvZmgBK_zB542xW-TTBRkek-qrzHXEItkg';
const clanTag = 'VGR09CL8';

let names = [];
let roles = [];
let townHallLevels = [];
let leagues = [];
let trophies = [];
let builderBaseTrophies = [];
let donations = [];

app.use(cors());

async function fetchClanInfo() {
    try {
        const response = await fetch(`https://api.clashofclans.com/v1/clans/%23${clanTag}/members`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        data.items.forEach(member => {
            names.push(member.name);
            roles.push(member.role);
            townHallLevels.push(member.townHallLevel);
            leagues.push(member.league ? member.league.name : "Unranked");
            trophies.push(member.trophies);
            builderBaseTrophies.push(member.builderBaseTrophies);
            donations.push(member.donations);
        });
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

app.get('/', async (req, res) => {
    await fetchClanInfo();
    res.json({
        names, roles, townHallLevels, leagues, trophies, builderBaseTrophies, donations
    });
});

module.exports = app;  // Vercel will treat this as a serverless function
