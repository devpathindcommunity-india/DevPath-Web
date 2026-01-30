const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../hackfiestacertificates/HackFiesta.csv');
const outputPath = path.join(__dirname, '../src/data/participants.ts');

try {
    const data = fs.readFileSync(csvPath, 'utf8');
    const lines = data.split('\n').filter(line => line.trim() !== '');

    // Remove header
    const header = lines.shift();

    const participants = lines.map(line => {
        // Simple CSV parse handling quotes
        const match = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!match) return null;

        let [firstName, lastName, project, teamName] = match;

        // Clean quotes
        firstName = firstName ? firstName.replace(/^"|"$/g, '').trim() : '';
        lastName = lastName ? lastName.replace(/^"|"$/g, '').trim() : '';
        project = project ? project.replace(/^"|"$/g, '').trim() : '';
        teamName = teamName ? teamName.replace(/^"|"$/g, '').trim() : '';

        if (!firstName) return null;

        const finalTeam = (teamName && teamName.trim() !== '') ? teamName : 'N/A';

        return {
            name: `${firstName} ${lastName}`.trim(),
            firstName,
            lastName,
            team: finalTeam
        };
    }).filter(p => p !== null);

    const fileContent = `export const PARTICIPANTS = ${JSON.stringify(participants, null, 4)};`;

    // Ensure dir exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, fileContent);
    console.log(`Generated ${participants.length} participants in ${outputPath}`);

} catch (err) {
    console.error('Error converting CSV:', err);
}
