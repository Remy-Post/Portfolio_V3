import mongoose from 'mongoose';

const NEW_LANGUAGES = [
    {
        name: 'Node.js',
        colour: '#339933',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
        proficiency: 2,
        description: 'A JavaScript runtime built on Chrome\'s V8 engine for server-side applications.',
        similarLanguages: ['JavaScript', 'Express'],
        projects: [],
    },
    {
        name: 'Express',
        colour: '#000000',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg',
        proficiency: 2,
        description: 'A minimal, flexible Node.js web application framework.',
        similarLanguages: ['Node.js', 'JavaScript'],
        projects: [],
    },
    {
        name: 'Next.js',
        colour: '#000000',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
        proficiency: 2,
        description: 'A React framework for production-grade full-stack web applications.',
        similarLanguages: ['React', 'TypeScript'],
        projects: [],
    },
    {
        name: 'XML',
        colour: '#005FAD',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/xml/xml-original.svg',
        proficiency: 1,
        description: 'A markup language for encoding structured data in a human-readable format.',
        similarLanguages: ['HTML', 'JSON'],
        projects: [],
    },
    {
        name: 'MERN',
        colour: '#00ED64',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg',
        proficiency: 2,
        description: 'A full-stack JavaScript framework combining MongoDB, Express, React, and Node.js.',
        similarLanguages: ['React', 'Node.js'],
        projects: [],
    },
    {
        name: 'Markdown',
        colour: '#000000',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/markdown/markdown-original.svg',
        proficiency: 3,
        description: 'A lightweight markup language for creating formatted text with plain-text syntax.',
        similarLanguages: ['HTML'],
        projects: [],
    },
    {
        name: 'JSON',
        colour: '#000000',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/json/json-plain.svg',
        proficiency: 3,
        description: 'A lightweight data interchange format that is easy for humans and machines to read.',
        similarLanguages: ['XML', 'JavaScript'],
        projects: [],
    },
];

async function migrate() {
    const dbUri = process.env.DB!;
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db!;
    const languagesCol = db.collection('languages');
    const projectsCol = db.collection('projects');

    // Step 1: Insert new languages (skip if they already exist)
    console.log('\n--- Step 1: Inserting missing languages ---');
    for (const lang of NEW_LANGUAGES) {
        const existing = await languagesCol.findOne({ name: lang.name });
        if (!existing) {
            await languagesCol.insertOne(lang);
            console.log(`  Inserted: ${lang.name}`);
        } else {
            console.log(`  Already exists: ${lang.name}`);
        }
    }

    // Step 2: Build lookup maps
    console.log('\n--- Step 2: Building lookup maps ---');
    const allLanguages = await languagesCol.find().toArray();
    const allProjects = await projectsCol.find().toArray();

    const langNameToId = new Map<string, mongoose.Types.ObjectId>();
    for (const lang of allLanguages) {
        langNameToId.set(lang.name as string, lang._id as mongoose.Types.ObjectId);
    }

    const projNameToId = new Map<string, mongoose.Types.ObjectId>();
    for (const proj of allProjects) {
        projNameToId.set(proj.name as string, proj._id as mongoose.Types.ObjectId);
    }

    console.log(`  Languages: ${langNameToId.size}, Projects: ${projNameToId.size}`);

    // Step 3: Convert each project's languages from name strings to ObjectIds
    console.log('\n--- Step 3: Converting project.languages to ObjectIds ---');
    for (const proj of allProjects) {
        const currentLangs = proj.languages || [];
        // Skip if already converted (first element is an ObjectId, not a string)
        if (currentLangs.length > 0 && typeof currentLangs[0] !== 'string') {
            console.log(`  Skipping "${proj.name}" (already converted)`);
            continue;
        }

        const languageIds: mongoose.Types.ObjectId[] = [];
        for (const langRef of currentLangs) {
            const langId = langNameToId.get(langRef as string);
            if (langId) {
                languageIds.push(langId);
            } else {
                console.log(`  WARNING: Project "${proj.name}" references unknown language "${langRef}"`);
            }
        }
        await projectsCol.updateOne({ _id: proj._id }, { $set: { languages: languageIds } });
    }

    // Step 4: Convert each language's projects from path strings to ObjectIds
    console.log('\n--- Step 4: Converting language.projects to ObjectIds ---');
    for (const lang of allLanguages) {
        const currentProjs = lang.projects || [];
        // Skip if already converted
        if (currentProjs.length > 0 && typeof currentProjs[0] !== 'string') {
            console.log(`  Skipping "${lang.name}" (already converted)`);
            continue;
        }

        const projectIds: mongoose.Types.ObjectId[] = [];
        for (const projRef of currentProjs) {
            // Strip leading "/" from path-style references like "/portfolioV2"
            const projName = (projRef as string).replace(/^\//, '');
            const projId = projNameToId.get(projName);
            if (projId) {
                projectIds.push(projId);
            } else {
                console.log(`  WARNING: Language "${lang.name}" references unknown project "${projRef}"`);
            }
        }
        await languagesCol.updateOne({ _id: lang._id }, { $set: { projects: projectIds } });
    }

    // Step 5: Ensure bidirectional consistency
    // If Project X lists Language Y, then Language Y.projects must include Project X (and vice versa)
    console.log('\n--- Step 5: Ensuring bidirectional consistency ---');
    const updatedProjects = await projectsCol.find().toArray();
    const updatedLanguages = await languagesCol.find().toArray();

    let syncCount = 0;

    // For every project→language link, ensure the reverse link exists
    for (const proj of updatedProjects) {
        for (const langId of (proj.languages || [])) {
            const result = await languagesCol.updateOne(
                { _id: langId },
                { $addToSet: { projects: proj._id } }
            );
            if (result.modifiedCount > 0) {
                const langDoc = updatedLanguages.find(l => l._id.equals(langId));
                console.log(`  Synced: added project "${proj.name}" to language "${langDoc?.name}"`);
                syncCount++;
            }
        }
    }

    // For every language→project link, ensure the reverse link exists
    for (const lang of updatedLanguages) {
        for (const projId of (lang.projects || [])) {
            const result = await projectsCol.updateOne(
                { _id: projId },
                { $addToSet: { languages: lang._id } }
            );
            if (result.modifiedCount > 0) {
                const projDoc = updatedProjects.find(p => p._id.equals(projId));
                console.log(`  Synced: added language "${lang.name}" to project "${projDoc?.name}"`);
                syncCount++;
            }
        }
    }

    console.log(`  Total sync fixes: ${syncCount}`);

    // Summary
    const finalLangs = await languagesCol.countDocuments();
    const finalProjs = await projectsCol.countDocuments();
    console.log(`\n--- Migration complete ---`);
    console.log(`Languages: ${finalLangs} total`);
    console.log(`Projects: ${finalProjs} total`);

    await mongoose.disconnect();
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
