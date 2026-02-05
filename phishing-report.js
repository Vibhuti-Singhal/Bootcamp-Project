// phishing-report.js - Persistent reporting and logging system

class PhishingReporter {
    constructor() {
        this.storageKey = 'phishing_reports';
        this.maxReports = 100; // Keep last 100 reports
    }

    // Add a new phishing report
    async addReport(report) {
        const timestamp = new Date().toISOString();
        const fullReport = {
            id: Date.now() + Math.random(),
            timestamp,
            ...report
        };

        try {
            const data = await chrome.storage.local.get(this.storageKey);
            let reports = data[this.storageKey] || [];

            // Add new report
            reports.unshift(fullReport);

            // Keep only last N reports
            if (reports.length > this.maxReports) {
                reports = reports.slice(0, this.maxReports);
            }

            await chrome.storage.local.set({ [this.storageKey]: reports });
            console.log('✓ Report saved:', fullReport.id);
            return fullReport;
        } catch (error) {
            console.error('Error saving report:', error);
            return null;
        }
    }

    // Get all reports
    async getReports(limit = null) {
        try {
            const data = await chrome.storage.local.get(this.storageKey);
            let reports = data[this.storageKey] || [];

            if (limit) {
                reports = reports.slice(0, limit);
            }

            return reports;
        } catch (error) {
            console.error('Error retrieving reports:', error);
            return [];
        }
    }

    // Get reports by risk level
    async getReportsByRiskLevel(riskLevel) {
        try {
            const reports = await this.getReports();
            return reports.filter(r => r.riskLevel === riskLevel);
        } catch (error) {
            console.error('Error filtering reports:', error);
            return [];
        }
    }

    // Get reports from date range
    async getReportsByDateRange(startDate, endDate) {
        try {
            const reports = await this.getReports();
            const start = new Date(startDate).getTime();
            const end = new Date(endDate).getTime();

            return reports.filter(r => {
                const reportTime = new Date(r.timestamp).getTime();
                return reportTime >= start && reportTime <= end;
            });
        } catch (error) {
            console.error('Error filtering by date:', error);
            return [];
        }
    }

    // Clear all reports
    async clearAllReports() {
        try {
            await chrome.storage.local.remove(this.storageKey);
            console.log('✓ All reports cleared');
            return true;
        } catch (error) {
            console.error('Error clearing reports:', error);
            return false;
        }
    }

    // Delete specific report
    async deleteReport(reportId) {
        try {
            const data = await chrome.storage.local.get(this.storageKey);
            let reports = data[this.storageKey] || [];

            reports = reports.filter(r => r.id !== reportId);

            await chrome.storage.local.set({ [this.storageKey]: reports });
            console.log('✓ Report deleted:', reportId);
            return true;
        } catch (error) {
            console.error('Error deleting report:', error);
            return false;
        }
    }

    // Get statistics
    async getStatistics() {
        try {
            const reports = await this.getReports();

            const stats = {
                total: reports.length,
                byRiskLevel: {
                    safe: 0,
                    low: 0,
                    medium: 0,
                    high: 0
                },
                byDate: {},
                topDomains: {}
            };

            reports.forEach(report => {
                // Count by risk level
                if (stats.byRiskLevel.hasOwnProperty(report.riskLevel)) {
                    stats.byRiskLevel[report.riskLevel]++;
                }

                // Count by date
                const date = report.timestamp.split('T')[0];
                stats.byDate[date] = (stats.byDate[date] || 0) + 1;

                // Count top domains
                const domain = new URL(report.url).hostname;
                stats.topDomains[domain] = (stats.topDomains[domain] || 0) + 1;
            });

            // Sort top domains
            stats.topDomainsSorted = Object.entries(stats.topDomains)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([domain, count]) => ({ domain, count }));

            return stats;
        } catch (error) {
            console.error('Error getting statistics:', error);
            return null;
        }
    }

    // Export reports as JSON
    async exportReports() {
        try {
            const reports = await this.getReports();
            const stats = await this.getStatistics();

            return {
                exportDate: new Date().toISOString(),
                version: '1.0',
                statistics: stats,
                reports: reports
            };
        } catch (error) {
            console.error('Error exporting reports:', error);
            return null;
        }
    }

    // Import reports from JSON
    async importReports(importData) {
        try {
            if (!importData.reports || !Array.isArray(importData.reports)) {
                throw new Error('Invalid import format');
            }

            const data = await chrome.storage.local.get(this.storageKey);
            let existingReports = data[this.storageKey] || [];

            // Merge and deduplicate by ID
            const allReports = [...existingReports, ...importData.reports];
            const uniqueReports = Array.from(
                new Map(allReports.map(r => [r.id, r])).values()
            );

            // Keep only last N
            const finalReports = uniqueReports.slice(0, this.maxReports);

            await chrome.storage.local.set({ [this.storageKey]: finalReports });
            console.log('✓ Reports imported:', importData.reports.length);
            return true;
        } catch (error) {
            console.error('Error importing reports:', error);
            return false;
        }
    }
}

// Create global instance
const phishingReporter = new PhishingReporter();
