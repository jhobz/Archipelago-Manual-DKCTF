import fs from 'fs'

const generateLocations = (from, to) => {
    const infile = fs.readFileSync(from, 'utf8')
    const locArray = infile.split("\r\n").map((row) => { return row.split(",") })

    // const items = cards.filter(({ collectible }) => collectible).map(({ name }) => ({ name, count: 1, category: ["Cards"], progression: true }))
    const locations = []
    locArray.forEach((row) => {
        const rowLocations = []
        const checkTemplate = {
            region: `[${row[0]}] ${row[1]}`,
            requires: []
        }

        // BOSSES
        if (row[0].includes("Boss")) {
            const check = {
                name: `Defeat ${row[4]}`,
                ...checkTemplate,
                category: ['Bosses', checkTemplate.region],
                "place_item": ['Boss Barrel']
            }
            rowLocations.push(check)
        }

        // KONG LETTERS
        for (let letter of row[3].split("")) {
            const check = {
                name: `[${row[0]}] Letter ${letter}`,
                ...checkTemplate,
                category: ['KONG Letters', checkTemplate.region]
            }
            rowLocations.push(check)
        }

        // PUZZLE PIECES
        for (let i = 1; i <= row[2]; i++) {
            const check = {
                name: `[${row[0]}] Puzzle Piece #${i}`,
                ...checkTemplate,
                category: ['Puzzle Pieces', checkTemplate.region]
            }
            rowLocations.push(check)
        }

        locations.push(...rowLocations)
    })

    // VICTORY
    locArray.push({
        name: "Victory",
        requires: "|Boss Barrel:4|",
        victory: true
    })
    try {
        fs.writeFileSync(to, JSON.stringify(locations))
        console.log('Successfully output all locations')
    } catch (e) {
        console.error('Something went wrong', e)
    }

    return 0
}

generateLocations('../data/troplocations.csv', '../data/locations.json')