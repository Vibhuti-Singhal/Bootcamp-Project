// popup.js

document.addEventListener('DOMContentLoaded', () => {
  console.log('Popup opened, requesting results...');

  // Request results from background script
  chrome.runtime.sendMessage({ type: 'get_results' }, (response) => {
    console.log('Popup received response:', response);

    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    const noResults = document.getElementById('no-results');

    loading.classList.add('hidden');

    if (response && response.results) {
      console.log('Displaying results:', response.results);
      displayResults(response.results);
      results.classList.remove('hidden');
    } else {
      console.log('No results available');
      noResults.classList.remove('hidden');
    }
  });
});

function displayResults(results) {
  console.log('displayResults called with:', results);

  const riskLevelText = document.getElementById('risk-level-text');
  const scoreValue = document.getElementById('score-value');
  const scoreFill = document.getElementById('score-fill');
  const indicatorList = document.getElementById('indicator-list');
  const recommendationText = document.getElementById('recommendation-text');
  const riskLevelContainer = document.querySelector('.risk-level');
  const emailInfo = document.getElementById('email-info');

  // Set risk level
  riskLevelText.textContent = results.riskLevel;
  riskLevelContainer.className = `risk-level ${results.riskLevel}`;

  // Set score
  scoreValue.textContent = results.score;
  const scorePercentage = Math.min((results.score / 100) * 100, 100);
  scoreFill.style.width = scorePercentage + '%';
  scoreFill.className = `score-fill ${results.riskLevel}`;

  // Display indicators
  if (results.indicators && results.indicators.length > 0) {
    indicatorList.innerHTML = '';
    results.indicators.forEach(indicator => {
      const li = document.createElement('li');
      li.textContent = indicator;
      indicatorList.appendChild(li);
    });

    if (results.riskLevel === 'safe') {
      indicatorList.classList.add('safe');
    }
  } else {
    indicatorList.innerHTML = '<li>No suspicious indicators found.</li>';
    indicatorList.classList.add('safe');
  }

  // Set recommendations
  recommendationText.textContent = getRecommendation(results.riskLevel);

  // Display email information if available
  if (results.detectionDetails && results.detectionDetails.isEmailInterface) {
    emailInfo.style.display = 'block';
    const emailProviderText = document.getElementById('email-provider-text');
    emailProviderText.innerHTML = `
      <strong>Email Provider Detected:</strong> ${results.detectionDetails.emailProvider}<br>
      <small>Email elements checked: ${results.detectionDetails.checkedElements}</small>
    `;
  }

  console.log('✓ Results displayed successfully');
}

function getRecommendation(riskLevel) {
  const recommendations = {
    'safe': 'This page appears to be safe. No significant phishing indicators were detected.',
    'low': 'This page has some minor concerns. Exercise normal caution when entering personal information.',
    'medium': 'This page shows several suspicious indicators. Be very cautious about entering any personal or financial information. Verify the website\'s legitimacy before proceeding.',
    'high': '⚠️ DANGER: This page has strong indicators of being a phishing attempt. Do NOT enter any personal information, passwords, or financial details. Leave this site immediately and report it if possible.'
  };

  return recommendations[riskLevel] || recommendations['safe'];
}