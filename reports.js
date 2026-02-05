// reports.js - Reports page functionality

let allReports = [];
let currentFilter = '';
let currentRiskFilter = '';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Reports page loaded');

    // Tab navigation
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Button handlers
    document.getElementById('refresh-btn').addEventListener('click', loadReports);
    document.getElementById('clear-btn').addEventListener('click', clearAllReports);
    document.getElementById('export-btn').addEventListener('click', exportReports);
    document.getElementById('import-btn').addEventListener('click', importReports);

    // Search and filter
    document.getElementById('search-input').addEventListener('input', (e) => {
        currentFilter = e.target.value.toLowerCase();
        filterReports();
    });

    document.getElementById('filter-risk').addEventListener('change', (e) => {
        currentRiskFilter = e.target.value;
        filterReports();
    });

    // Modal close
    document.querySelector('.modal-close').addEventListener('click', () => {
        document.getElementById('detail-modal').classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        const modal = document.getElementById('detail-modal');
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // Load initial data
    loadReports();
    loadStatistics();
});

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Deactivate all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');

    // Activate button
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Refresh data for statistics tab
    if (tabName === 'statistics') {
        loadStatistics();
    }
}

function loadReports() {
    chrome.runtime.sendMessage({ type: 'get_reports', limit: 100 }, (response) => {
        if (response && response.reports) {
            allReports = response.reports;
            console.log('Loaded', allReports.length, 'reports');
            filterReports();
        }
    });
}

function filterReports() {
    let filtered = allReports;

    // Filter by search term
    if (currentFilter) {
        filtered = filtered.filter(report => {
            return report.url.toLowerCase().includes(currentFilter) ||
                (report.detectionDetails && report.detectionDetails.emailProvider &&
                    report.detectionDetails.emailProvider.toLowerCase().includes(currentFilter));
        });
    }

    // Filter by risk level
    if (currentRiskFilter) {
        filtered = filtered.filter(report => report.riskLevel === currentRiskFilter);
    }

    displayReports(filtered);
}

function displayReports(reports) {
    const container = document.getElementById('reports-container');

    if (reports.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>✓ No reports found. Safe browsing!</p></div>';
        return;
    }

    container.innerHTML = reports.map(report => `
    <div class="report-card risk-${report.riskLevel}">
      <div class="report-header">
        <span class="risk-badge ${report.riskLevel}">${report.riskLevel.toUpperCase()}</span>
        <span class="score">Score: ${report.score}</span>
        <span class="timestamp">${formatDate(report.timestamp)}</span>
      </div>

      <div class="report-body">
        <div class="url">
          <strong>URL:</strong> 
          <code>${truncateURL(report.url)}</code>
        </div>
        
        ${report.detectionDetails && report.detectionDetails.isEmailInterface ? `
          <div class="email-provider">
            <strong>Email Provider:</strong> ${report.detectionDetails.emailProvider}
          </div>
        ` : ''}

        <div class="indicators-preview">
          <strong>Indicators Found: ${report.indicators.length}</strong>
          ${report.indicators.length > 0 ? `
            <ul>
              ${report.indicators.slice(0, 3).map(ind => `<li>${ind}</li>`).join('')}
              ${report.indicators.length > 3 ? `<li class="more">+${report.indicators.length - 3} more...</li>` : ''}
            </ul>
          ` : '<p>No indicators</p>'}
        </div>
      </div>

      <div class="report-footer">
        <button class="btn btn-small" onclick="showReportDetail('${report.id}')">View Details</button>
        <button class="btn btn-small btn-danger" onclick="deleteReport('${report.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function showReportDetail(reportId) {
    const report = allReports.find(r => r.id === reportId);
    if (!report) return;

    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
    <h2>Phishing Detection Report</h2>
    
    <div class="detail-section">
      <h3>Risk Assessment</h3>
      <p><strong>Risk Level:</strong> <span class="risk-badge ${report.riskLevel}">${report.riskLevel.toUpperCase()}</span></p>
      <p><strong>Suspicion Score:</strong> ${report.score}%</p>
      <p><strong>Detection Time:</strong> ${formatDate(report.timestamp)}</p>
    </div>

    <div class="detail-section">
      <h3>Target URL</h3>
      <p class="full-url">${report.url}</p>
    </div>

    ${report.detectionDetails && report.detectionDetails.isEmailInterface ? `
      <div class="detail-section">
        <h3>Email Interface</h3>
        <p><strong>Provider:</strong> ${report.detectionDetails.emailProvider}</p>
        <p><strong>Elements Checked:</strong> ${report.detectionDetails.checkedElements}</p>
      </div>
    ` : ''}

    <div class="detail-section">
      <h3>Detected Indicators (${report.indicators.length})</h3>
      ${report.indicators.length > 0 ? `
        <ul class="full-indicators">
          ${report.indicators.map((ind, i) => `<li>${i + 1}. ${ind}</li>`).join('')}
        </ul>
      ` : '<p>No suspicious indicators detected.</p>'}
    </div>

    ${report.performanceMetrics ? `
      <div class="detail-section">
        <h3>Analysis Metrics</h3>
        <p><strong>Analysis Duration:</strong> ${report.performanceMetrics.duration}ms</p>
      </div>
    ` : ''}
  `;

    document.getElementById('detail-modal').classList.remove('hidden');
}

function deleteReport(reportId) {
    if (confirm('Delete this report?')) {
        allReports = allReports.filter(r => r.id !== reportId);
        filterReports();
    }
}

function clearAllReports() {
    if (confirm('Delete ALL reports? This cannot be undone.')) {
        chrome.runtime.sendMessage({ type: 'clear_reports' }, (response) => {
            if (response.success) {
                allReports = [];
                filterReports();
                console.log('✓ All reports cleared');
            }
        });
    }
}

function loadStatistics() {
    chrome.runtime.sendMessage({ type: 'get_statistics' }, (response) => {
        if (response && response.statistics) {
            const stats = response.statistics;

            // Update stat cards
            document.getElementById('stat-total').textContent = stats.total;
            document.getElementById('stat-high').textContent = stats.byRiskLevel.high;
            document.getElementById('stat-medium').textContent = stats.byRiskLevel.medium;
            document.getElementById('stat-low').textContent = stats.byRiskLevel.low;
            document.getElementById('stat-safe').textContent = stats.byRiskLevel.safe;

            // Update top domains
            const topDomainsList = document.getElementById('top-domains-list');
            if (stats.topDomainsSorted && stats.topDomainsSorted.length > 0) {
                topDomainsList.innerHTML = stats.topDomainsSorted.map(item => `
          <li>
            <span class="domain">${item.domain}</span>
            <span class="count">${item.count} detection${item.count > 1 ? 's' : ''}</span>
          </li>
        `).join('');
            } else {
                topDomainsList.innerHTML = '<li class="empty">No data yet</li>';
            }

            console.log('Statistics updated');
        }
    });
}

function exportReports() {
    chrome.runtime.sendMessage({ type: 'export_reports' }, (response) => {
        if (response && response.data) {
            const dataStr = JSON.stringify(response.data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `phishing-reports-${new Date().toISOString().split('T')[0]}.json`;
            link.click();

            URL.revokeObjectURL(url);
            console.log('✓ Reports exported');
        }
    });
}

function importReports() {
    const fileInput = document.getElementById('import-file');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importData = JSON.parse(e.target.result);

            // Validate structure
            if (!importData.reports || !Array.isArray(importData.reports)) {
                alert('Invalid file format');
                return;
            }

            chrome.runtime.sendMessage(
                { type: 'import_reports', data: importData },
                (response) => {
                    if (response && response.success) {
                        alert(`✓ Imported ${importData.reports.length} reports`);
                        fileInput.value = '';
                        loadReports();
                        loadStatistics();
                    }
                }
            );
        } catch (error) {
            alert('Error parsing file: ' + error.message);
        }
    };

    reader.readAsText(file);
}

// Utility functions
function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleString();
}

function truncateURL(url, length = 50) {
    if (url.length > length) {
        return url.substring(0, length) + '...';
    }
    return url;
}
