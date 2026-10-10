import fs from 'fs';

// Configuration
const CONCURRENT_USERS = 50; // Change this to simulate more/less users
const HOST = 'https://www.savaupajkadhurandhar.com'; // Use http://localhost:3000 if testing locally

async function simulateFarmer(id) {
    const filename = `loadtest_farmer_${id}_${Date.now()}.mp4`;
    const dummyVideoContent = Buffer.from('This is a dummy video file for load testing.', 'utf8');
    const mimeType = 'video/mp4';

    console.log(`[Farmer ${id}] Starting...`);
    const startTime = Date.now();

    try {
        // Step 1: Get Upload URL from Vercel
        const urlRes = await fetch(`${HOST}/api/getUploadUrl`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename, mimeType })
        });
        
        if (!urlRes.ok) throw new Error(`getUploadUrl failed: ${urlRes.status}`);
        const { uploadUrl, publicUrl } = await urlRes.json();
        console.log(`[Farmer ${id}] Got R2 URL in ${Date.now() - startTime}ms`);

        // Step 2: Upload to Cloudflare R2
        const uploadStart = Date.now();
        const uploadRes = await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': mimeType },
            body: dummyVideoContent
        });
        
        if (!uploadRes.ok) throw new Error(`R2 Upload failed: ${uploadRes.status}`);
        console.log(`[Farmer ${id}] Uploaded to R2 in ${Date.now() - uploadStart}ms`);

        // Step 3: Save Data to Google Sheets
        const saveStart = Date.now();
        const saveRes = await fetch(`${HOST}/api/saveData`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: `Load Test User ${id}`,
                location: 'Test City',
                mobile: `555-000-${id.toString().padStart(4, '0')}`,
                publicUrl
            })
        });

        if (!saveRes.ok) throw new Error(`saveData failed: ${saveRes.status}`);
        console.log(`[Farmer ${id}] Saved to Sheets in ${Date.now() - saveStart}ms. 🟢 SUCCESS!`);
        
        return true;
    } catch (error) {
        console.error(`[Farmer ${id}] 🔴 FAILED:`, error.message);
        return false;
    }
}

async function runLoadTest() {
    console.log(`🚀 Starting Load Test with ${CONCURRENT_USERS} simultaneous users...`);
    console.log(`Target: ${HOST}`);
    console.log('--------------------------------------------------');

    const startTime = Date.now();
    const promises = [];

    // Fire all requests simultaneously
    for (let i = 1; i <= CONCURRENT_USERS; i++) {
        promises.push(simulateFarmer(i));
    }

    const results = await Promise.all(promises);
    
    const successes = results.filter(r => r).length;
    const failures = results.length - successes;
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('--------------------------------------------------');
    console.log(`🏁 Load Test Complete in ${totalTime} seconds`);
    console.log(`✅ Successes: ${successes}`);
    console.log(`❌ Failures: ${failures}`);
    
    if (failures > 0) {
        console.log('⚠️ Some requests failed. Check Vercel logs for timeouts or rate limits.');
    } else {
        console.log('🎉 PERFECT RUN! Vercel and Cloudflare R2 handled the concurrency flawlessly.');
    }
}

runLoadTest();
