// pslfprivatepagecirca2026augsp.js
(function() {
    const correctPassword = "Chevy2027";

    function init() {
        const authOverlay = document.getElementById('auth-overlay');
        const mainContent = document.getElementById('main-content');
        const passwordInput = document.getElementById('password-input');
        const authBtn = document.getElementById('auth-btn');
        const authError = document.getElementById('auth-error');

        function handleAuth() {
            if (passwordInput.value === correctPassword) {
                authOverlay.classList.add('hidden');
                mainContent.classList.remove('hidden');
                buildTrackerTable();
            } else {
                authError.textContent = "Incorrect password. Case-sensitive.";
                passwordInput.value = "";
            }
        }

        authBtn.addEventListener('click', handleAuth);
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleAuth();
            }
        });
    }

    function buildTrackerTable() {
        const tableBody = document.getElementById('table-body');
        const runningTotalEl = document.getElementById('running-total');
        const statusMessageEl = document.getElementById('status-message');

        const monthsList = [
            "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December"
        ];

        let startYear = 2016;
        let startMonthIndex = 10; // November
        let endYear = 2027;
        let endMonthIndex = 6;  // July

        let currentYear = startYear;
        let currentMonthIndex = startMonthIndex;

        let savedState = {};
        try {
            const stored = localStorage.getItem('pslf_tracker_state');
            if (stored) {
                savedState = JSON.parse(stored);
            }
        } catch (e) {
            console.error("Could not load local storage", e);
        }

        tableBody.innerHTML = '';

        while (
            currentYear < endYear || 
            (currentYear === endYear && currentMonthIndex <= endMonthIndex)
        ) {
            let monthName = monthsList[currentMonthIndex];
            let rowId = monthName + '-' + currentYear;

            let tr = document.createElement('tr');

            // Month Cell
            let tdMonth = document.createElement('td');
            tdMonth.textContent = monthName;
            tr.appendChild(tdMonth);

            // Year Cell
            let tdYear = document.createElement('td');
            tdYear.textContent = currentYear;
            tr.appendChild(tdYear);

            // Checkmark / Ineligible Cell
            let tdAction = document.createElement('td');
            let isIneligible = (currentYear === 2024 && (monthName === "June" || monthName === "July"));

            if (isIneligible) {
                let span = document.createElement('span');
                span.className = 'ineligible-text';
                span.textContent = "Ineligible: Forbearance on Due Date";
                tdAction.appendChild(span);
            } else {
                let checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.setAttribute('data-id', rowId);
                checkbox.checked = !!savedState[rowId];

                checkbox.addEventListener('change', function() {
                    savedState[rowId] = this.checked;
                    try {
                        localStorage.setItem('pslf_tracker_state', JSON.stringify(savedState));
                    } catch (e) {
                        console.error("Could not save to local storage", e);
                    }
                    updateTotals();
                });

                tdAction.appendChild(checkbox);
            }

            tableBody.appendChild(tr);

            // Advance month/year loop pointer
            currentMonthIndex++;
            if (currentMonthIndex > 11) {
                currentMonthIndex = 0;
                currentYear++;
            }
        }

        updateTotals();

        function updateTotals() {
            let totalChecked = 0;
            const checkboxes = tableBody.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(function(cb) {
                if (cb.checked) {
                    totalChecked++;
                }
            });

            runningTotalEl.textContent = totalChecked;

            if (totalChecked >= 120) {
                statusMessageEl.textContent = "120 months achieved.";
                statusMessageEl.className = "status-message achieved";
            } else {
                statusMessageEl.textContent = "NOT YET ACHIEVED 120 MONTHS.";
                statusMessageEl.className = "status-message not-yet";
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
