

import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();

import path from 'path';

// To get the current directory of the module
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Now you can use __dirname like in CommonJS
app.use(express.static(path.join(__dirname, 'public')));

const apiKey = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjA3MGZhZDQ4LWExOTctNGZiZS05NmQxLWYxYzY0YWUyYzJjZCIsImlhdCI6MTczMjgzMjUzMiwic3ViIjoiZGV2ZWxvcGVyL2ZiNzFhOTRiLTExNzYtNGFjNC0zNzMzLThhMjA5NzQxNzFhMiIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjExMi4xMzUuNjguMTI4Il0sInR5cGUiOiJjbGllbnQifV19.Qga65kU-VbmC1R_jB5BQji9tvxtgVMK5lYgr8mtBPk7Yt5lBXQaAzwjmrCNohf3Bv5YK4q_BVjlWMX-LrVkwbg`
const clanTag = `VGR09CL8`

let names = [];
let roles = [];
let townHallLevels = [];
let leagues = [];
let trophies = [];
let builderBaseTrophies = [];
let donations = [];

async function fetchClanInfo() {
    const fetch = (await import('node-fetch')).default; // Dynamic import

    try {
        const response = await fetch(
            `https://api.clashofclans.com/v1/clans/%23${clanTag}/members`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP error! status: ${response.status}, ${errorText}`);
            throw new Error(`Error: ${errorText}`);
        }

        const data = await response.json();

        // Update arrays
        names = [];
        roles = [];
        townHallLevels = [];
        leagues = [];
        trophies = [];
        builderBaseTrophies = [];
        donations = [];

        data.items.forEach((member) => {
            names.push(member.name);
            roles.push(member.role);
            townHallLevels.push(member.townHallLevel);
            leagues.push(member.league ? member.league.name : 'Unranked');
            trophies.push(member.trophies);
            builderBaseTrophies.push(member.builderBaseTrophies);
            donations.push(member.donations);
        });

        console.log(roles);
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
            names,
            roles,
            townHallLevels,
            leagues,
            trophies,
            builderBaseTrophies,
            donations
        });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).send('Server Error');
    }
});

// Export the serverless function handler for Vercel
export default app;
