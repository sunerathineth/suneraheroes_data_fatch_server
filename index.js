const { default: fetch } = require('node-fetch')

const apiKey = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjNiMzllYWMwLTJjOTgtNGRhNC05Mzk0LTAxM2FlODU1MDNjYSIsImlhdCI6MTczMjgyMDgyNiwic3ViIjoiZGV2ZWxvcGVyL2ZiNzFhOTRiLTExNzYtNGFjNC0zNzMzLThhMjA5NzQxNzFhMiIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjExMi4xMzUuNzAuMTUzIl0sInR5cGUiOiJjbGllbnQifV19.xi9oMEiabnc7-QI6SV7hUGLXk5WtSxAXpkiTTpg6wh4Vm6Ps6SN0SvZmgBK_zB542xW-TTBRkek-qrzHXEItkg`
const clanTag = `VGR09CL8`

export default async function handler(req, res) {
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

        let names = []
        let roles = []
        let townHallLevels = []
        let leagues = []
        let trophies = []
        let builderBaseTrophies = []
        let donations = []

        data.items.forEach(member => {
            names.push(member.name)
            roles.push(member.role)
            townHallLevels.push(member.townHallLevel)
            leagues.push(member.league ? member.league.name : "Unranked")
            trophies.push(member.trophies)
            builderBaseTrophies.push(member.builderBaseTrophies)
            donations.push(member.donations)
        })

        res.status(200).json({
            names,
            roles,
            townHallLevels,
            leagues,
            trophies,
            builderBaseTrophies,
            donations
        })
    } catch (error) {
        console.error('Fetch Error:', error)
        res.status(500).send('Server Error')
    }
}
