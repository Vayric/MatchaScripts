// --- 1. STATE & VARIABLES ---
// Try to load scripts from memory, or start with 1 dummy script
let scripts = JSON.parse(localStorage.getItem('matchaScripts')) || [
    {
        id: 1,
        title: "Infinite Jump",
        desc: "Allows you to jump infinitely in the air without falling.",
        code: "game.Players.LocalPlayer.Character.Humanoid.JumpPower = 100\n// Toggle on/off with Keybind 'F'",
        tag: "Lua"
    }
];

let currentPage = 1;
const itemsPerPage = 9; // 3 rows of 3

// --- 2. DOM ELEMENTS ---
const scriptGrid = document.getElementById('scriptGrid');
const searchInput = document.getElementById('searchInput');

// Modal Elements
const uploadModal = document.getElementById('uploadModal');
const viewModal = document.getElementById('viewModal');
const uploadBtn = document.getElementById('uploadBtn');
const closeUpload = document.getElementById('closeUpload');
const closeView = document.getElementById('closeView');
const submitScriptBtn = document.getElementById('submitScriptBtn');

// View Modal Elements
const viewTitle = document.getElementById('viewTitle');
const viewDesc = document.getElementById('viewDesc');
const viewCode = document.getElementById('viewCode');
const copyBtn = document.getElementById('copyBtn');

// --- 3. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    renderScripts();
    updatePagination();
});

// --- 4. RENDER FUNCTION (The Core Logic) ---
function renderScripts() {
    scriptGrid.innerHTML = ""; // Clear current grid

    // 1. Filter scripts based on Search
    const searchTerm = searchInput.value.toLowerCase();
    const filteredScripts = scripts.filter(script => 
        script.title.toLowerCase().includes(searchTerm) || 
        script.desc.toLowerCase().includes(searchTerm)
    );

    // 2. Calculate Pagination (Slice the array)
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const scriptsToShow = filteredScripts.slice(startIndex, endIndex);

    // 3. Loop through and create HTML for each card
    scriptsToShow.forEach(script => {
        const card = document.createElement('div');
        card.className = 'script-card';
        card.onclick = () => openViewModal(script);

        card.innerHTML = `
            <h3>${script.title}</h3>
            <p class="description">${script.desc}</p>
            <div class="tags">
                <span class="tag">${script.tag || 'Script'}</span>
            </div>
        `;
        scriptGrid.appendChild(card);
    });

    // 4. Handle "No Results"
    if (scriptsToShow.length === 0) {
        scriptGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#888;">No scripts found.</p>`;
    }

    updatePagination(filteredScripts.length);
}

// --- 5. PAGINATION LOGIC ---
function updatePagination(totalItems) {
    const pageNumbers = document.getElementById('pageNumbers');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    pageNumbers.innerHTML = ""; // Clear buttons

    // Create numbered buttons (1, 2, 3...)
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.onclick = () => {
            currentPage = i;
            renderScripts();
        };
        pageNumbers.appendChild(btn);
    }

    // Enable/Disable Prev/Next
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;

    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderScripts();
        }
    };

    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderScripts();
        }
    };
}

// --- 6. UPLOAD FUNCTIONALITY ---
uploadBtn.onclick = () => { uploadModal.style.display = "flex"; };
closeUpload.onclick = () => { uploadModal.style.display = "none"; };

submitScriptBtn.onclick = () => {
    const name = document.getElementById('uploadName').value;
    const desc = document.getElementById('uploadDesc').value;
    const code = document.getElementById('uploadCode').value;

    if (!name || !code) {
        alert("Please enter at least a Name and Code!");
        return;
    }

    const newScript = {
        id: Date.now(), // Unique ID
        title: name,
        desc: desc,
        code: code,
        tag: "User Upload"
    };

    // Add to the START of the array (Unshift)
    scripts.unshift(newScript);
    
    // Save to Local Storage (Simulating a Database)
    localStorage.setItem('matchaScripts', JSON.stringify(scripts));

    // Reset Form & Close
    document.getElementById('uploadName').value = "";
    document.getElementById('uploadDesc').value = "";
    document.getElementById('uploadCode').value = "";
    uploadModal.style.display = "none";

    // Refresh Grid
    currentPage = 1; // Go back to page 1 to see new post
    renderScripts();
};

// --- 7. VIEW MODAL & COPY ---
function openViewModal(script) {
    viewTitle.innerText = script.title;
    viewDesc.innerText = script.desc;
    viewCode.innerText = script.code;
    copyBtn.innerText = "Copy"; // Reset button text
    viewModal.style.display = "flex";
}

closeView.onclick = () => { viewModal.style.display = "none"; };

copyBtn.onclick = () => {
    const codeText = viewCode.innerText;
    navigator.clipboard.writeText(codeText).then(() => {
        copyBtn.innerText = "Copied!";
        setTimeout(() => { copyBtn.innerText = "Copy"; }, 2000);
    });
};

// Close modal if clicking outside the box
window.onclick = (event) => {
    if (event.target == uploadModal) uploadModal.style.display = "none";
    if (event.target == viewModal) viewModal.style.display = "none";
};

// Search Listener
searchInput.addEventListener('input', () => {
    currentPage = 1;
    renderScripts();
});
