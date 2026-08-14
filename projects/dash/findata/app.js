/**
 * Findata Research Dashboard - Core Application Logic
 * v2.0 | Privacy-hardened | No external dependencies
 * 
 * This script uses only vanilla JavaScript with no CDN libraries.
 * All data is loaded from local JSON files.
 */

// ============================================================================
// MODULE IMPORTS (Local Files Only)
// ============================================================================
// Note: icons.js can be imported if needed, but we're using inline SVGs for
// maximum privacy (no additional HTTP requests to any server)

let appData = null;
let complianceChecks = null;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Debounce function for search/filter inputs
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Deep clone an object (for safe data manipulation)
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Format currency with USD symbol
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format percentage value
 * @param {number} value - Value to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted percentage string
 */
function formatPercentage(value, decimals = 2) {
  if (value === null || value === undefined) return '-';
  return `${parseFloat(value).toFixed(decimals)}%`;
}

// ============================================================================
// DATA LOADING
// ============================================================================

/**
 * Load data from local JSON files
 */
async function loadDashboardData() {
  try {
    // Load institution data (replace with actual filename)
    const institutionsResponse = await fetch('findata-research-top104-tagged.json');
    const institutionsData = await institutionsResponse.json();
    
    // Load meta/research data
    const metaResponse = await fetch('findata-research-meta-v7.json');
    const metaData = await metaResponse.json();
    
    appData = institutionsData;
    complianceChecks = metaData.compliance_checks;
    
    console.log('Dashboard data loaded successfully');
    renderAllSections();
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    document.querySelector('.content').innerHTML = `
      <div class="error-message">
        <h2>Data Loading Error</h2>
        <p>Unable to load dashboard data. Please ensure the JSON files are present in the same directory.</p>
        <p><strong>Error:</strong> ${error.message}</p>
      </div>
    `;
  }
}

// ============================================================================
// RENDERING FUNCTIONS
// ============================================================================

/**
 * Render all dashboard sections
 */
function renderAllSections() {
  renderInstitutions();
  renderPersonalAccounts();
  renderBusinessAccounts();
  renderCreditCards();
  renderLoans();
  renderMerchantServices();
  renderComplianceResults();
  renderFrameworkFindings();
}

/**
 * Render institutions grid
 */
function renderInstitutions() {
  const container = document.querySelector('.institution-grid');
  if (!appData?.institutions) return;
  
  const institutions = appData.institutions.slice(0, 12); // Show first 12 for demo
  
  const html = institutions.map(inst => {
    const iconSvg = getIconSvg(inst.id);
    const ldsStatus = checkLDSAffiliation(inst.id);
    
    return `
      <article class="institution-card" data-inst-id="${inst.id}">
        <header class="card-header">
          <div class="institution-icon" aria-hidden="true">${iconSvg}</div>
          <h3>${inst.name || inst.id}</h3>
          <span class="badge badge--${inst.type || 'credit-union'}">${inst.type || 'Credit Union'}</span>
        </header>
        <div class="card-body">
          <dl class="data-points">
            <div><dt>Insurance</dt><dd>${inst.insurance || 'Unknown'}</dd></div>
            <div><dt>Min Balance</dt><dd>${formatCurrency(inst.min_balance)}</dd></div>
            <div><dt>Monthly Fee</dt><dd>${inst.monthly_fee || 'Varies'}</dd></div>
            <div><dt>LDS Status</dt><dd class="${ldsStatus.class}">${ldsStatus.label}</dd></div>
            <div><dt>Research</dt><dd><code>${inst.research_status || 'pending'}</code></dd></div>
          </dl>
          <footer class="card-footer">
            <a href="${inst.website_url || '#'}" target="_blank" rel="noopener noreferrer">
              Visit Website<span class="visually-hidden">(opens in new tab)</span>
            </a>
          </footer>
        </div>
      </article>
    `;
  }).join('');
  
  container.innerHTML = html;
}

/**
 * Render personal accounts table
 */
function renderPersonalAccounts() {
  const tbody = document.querySelector('#personal-accounts-table tbody');
  if (!appData?.institutions) return;
  
  // Sample data - replace with actual accounts data from institutions
  const sampleAccounts = [
    {
      institution: 'Navy Federal Credit Union',
      productType: 'Checking',
      apy: 0.15,
      minOpen: 5,
      minKeep: 5,
      monthlyFee: 0,
      feeWaiver: 'Any direct deposit',
      cashAccess: 'CO-OP Shared Branch',
      complianceTags: ['pass_min_balance', 'pass_monthly_fee']
    },
    {
      institution: 'USAA',
      productType: 'Savings',
      apy: 0.50,
      minOpen: 0,
      minKeep: 0,
      monthlyFee: 0,
      feeWaiver: 'None required',
      cashAccess: '50K+ ATMs nationwide',
      complianceTags: ['pass_min_balance', 'pass_monthly_fee', 'pass_cash_access']
    }
  ];
  
  tbody.innerHTML = sampleAccounts.map(acc => `
    <tr>
      <td>${acc.institution}</td>
      <td>${acc.productType}</td>
      <td>${formatPercentage(acc.apy)}</td>
      <td>${formatCurrency(acc.minOpen)}</td>
      <td>${formatCurrency(acc.minKeep)}</td>
      <td>${formatCurrency(acc.monthlyFee)}</td>
      <td>${acc.feeWaiver}</td>
      <td>${acc.cashAccess}</td>
      <td>${acc.complianceTags.map(tag => `<span class="badge">${tag.replace(/_/g, ' ')}</span>`).join(' ')}</td>
      <td><a href="#" class="details-link">View Details</a></td>
    </tr>
  `).join('');
}

/**
 * Render business accounts
 */
function renderBusinessAccounts() {
  const container = document.querySelector('.business-products-grid');
  container.innerHTML = '<p class="loading-indicator">Loading business products...</p>';
  // Implementation depends on actual business accounts data structure
}

/**
 * Render credit cards
 */
function renderCreditCards() {
  const tbody = document.querySelector('#credit-cards-table tbody');
  tbody.innerHTML = '<tr><td colspan="8" class="loading-indicator">Loading credit card data...</td></tr>';
  // Implementation depends on actual credit cards data structure
}

/**
 * Render loans accordion
 */
function renderLoans() {
  const accordion = document.querySelector('#loans-accordion');
  accordion.innerHTML = '<p class="loading-indicator">Loading loan products...</p>';
  // Implementation depends on actual loans data structure
}

/**
 * Render merchant services
 */
function renderMerchantServices() {
  const tbody = document.querySelector('#merchant-services-table tbody');
  tbody.innerHTML = '<tr><td colspan="8" class="loading-indicator">Loading merchant services...</td></tr>';
  // Implementation depends on actual merchant services data structure
}

/**
 * Render compliance results table
 */
function renderComplianceResults() {
  const container = document.querySelector('#compliance-results');
  container.innerHTML = '<p class="loading-indicator">Applying compliance filters...</p>';
  // Implementation depends on filtering logic and data structure
}

/**
 * Render framework findings
 */
function renderFrameworkFindings() {
  const container = document.querySelector('.findings-log');
  // Extract findings from metadata
  const findings = appData?.framework_findings || [];
  
  container.innerHTML = findings.map(finding => `
    <article class="finding-item finding-item--${getFindingSeverity(finding.id)}">
      <h4>${finding.title}</h4>
      <p>${finding.detail}</p>
      <p><strong>Impact:</strong> ${finding.affected_institutions.join(', ')}</p>
      <p><strong>Recommendation:</strong> ${finding.recommendation}</p>
      <small>Found: ${finding.date}</small>
    </article>
  `).join('') || '<p>No framework findings recorded.</p>';
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get SVG icon for institution (inline to avoid external requests)
 * @param {string} instId - Institution identifier
 * @returns {string} SVG markup
 */
function getIconSvg(instId) {
  // Simplified generic icon - replace with actual mapping if needed
  return `<svg viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10"/>
  </svg>`;
}

/**
 * Check LDS affiliation status
 * @param {string} instId - Institution identifier
 * @returns {Object} Status object
 */
function checkLDSAffiliation(instId) {
  const affiliated = ['deseret-first', 'beehive-fcu', 'uccu'];
  const historical = ['zions-bank'];
  
  if (affiliated.includes(instId)) {
    return { label: 'Current Affiliation', class: 'flag-current-affiliation' };
  }
  if (historical.includes(instId)) {
    return { label: 'Historical Only', class: 'flag-historical' };
  }
  return { label: 'None', class: '' };
}

/**
 * Determine finding severity for styling
 * @param {string} findingId - Finding identifier
 * @returns {string} Severity class
 */
function getFindingSeverity(findingId) {
  if (findingId.includes('merge')) return 'critical';
  if (findingId.includes('collision') || findingId.includes('duplication')) return 'warning';
  return 'info';
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Initialize tab switching functionality
 */
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Deactivate all tabs and panes
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
          t.setAttribute('tabindex', '-1');
        });
        
        panes.forEach(p => {
          p.classList.remove('active');
          p.hidden = true;
        });
        
        // Activate selected tab and pane
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        tab.setAttribute('tabindex', '0');
        
        const targetPane = document.getElementById(`${targetTab}-pane`);
        if (targetPane) {
          targetPane.classList.add('active');
          targetPane.hidden = false;
        }
        
        // Focus management for accessibility
        tab.focus();
      });
    });
  }
  
  /**
   * Initialize product tab switching within personal accounts pane
   */
  function initProductTabs() {
    const productTabs = document.querySelectorAll('.product-tab');
    
    productTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const productType = tab.dataset.product;
        
        // Update active state
        productTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Filter table rows by product type
        const tbody = document.querySelector('#personal-accounts-table tbody');
        const rows = tbody.querySelectorAll('tr');
        
        rows.forEach(row => {
          const rowType = row.cells[1]?.textContent.toLowerCase();
          if (rowType?.includes(productType)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });
  }
  
  /**
   * Initialize business product tabs
   */
  function initBusinessTabs() {
    const businessTabs = document.querySelectorAll('.business-tab');
    
    businessTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const category = tab.dataset.category;
        
        businessTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // This would filter business products based on category
        // Implementation depends on actual data structure
      });
    });
  }
  
  /**
   * Initialize compliance filter toggles
   */
  function initComplianceFilters() {
    const checkboxes = document.querySelectorAll('.filter-checkbox');
    
    const updateFilters = () => {
      const filters = {};
      checkboxes.forEach(cb => {
        filters[cb.id] = cb.checked;
      });
      
      // Apply filters to institutions list
      // This is a placeholder - actual implementation depends on data structure
      console.log('Compliance filters updated:', filters);
    };
    
    // Debounce the filter application
    const debouncedUpdate = debounce(updateFilters, 300);
    
    checkboxes.forEach(cb => {
      cb.addEventListener('change', debouncedUpdate);
    });
  }
  
  /**
   * Initialize search functionality
   */
  function initSearch() {
    const searchInput = document.getElementById('institution-search');
    if (!searchInput) return;
    
    const performSearch = () => {
      const query = searchInput.value.toLowerCase().trim();
      const cards = document.querySelectorAll('.institution-card');
      
      cards.forEach(card => {
        const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const id = card.dataset.instId || '';
        
        if (name.includes(query) || id.includes(query)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    };
    
    searchInput.addEventListener('input', debounce(performSearch, 300));
  }
  
  /**
   * Initialize export functionality
   */
  function initExports() {
    const exportJsonBtn = document.getElementById('export-json');
    const exportCsvBtn = document.getElementById('export-csv');
    
    exportJsonBtn?.addEventListener('click', () => {
      if (!appData) {
        alert('No data available to export.');
        return;
      }
      
      const jsonString = JSON.stringify(appData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = `findata-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    });
    
    exportCsvBtn?.addEventListener('click', () => {
      if (!appData?.institutions) {
        alert('No institutions data available to export.');
        return;
      }
      
      const institutions = appData.institutions;
      const headers = ['ID', 'Name', 'Type', 'Insurance', 'Min Balance', 'Monthly Fee', 'Research Status'];
      
      const csvRows = [headers.join(',')];
      
      institutions.forEach(inst => {
        const row = [
          inst.id || '',
          `"${(inst.name || '').replace(/"/g, '""')}"`,
          inst.type || 'credit-union',
          inst.insurance || '',
          inst.min_balance ?? '',
          inst.monthly_fee ?? '',
          inst.research_status || ''
        ].join(',');
        
        csvRows.push(row);
      });
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = `findata-institutions-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    });
  }
  
  /**
   * Initialize loan filter buttons
   */
  function initLoanFilters() {
    const loanFilters = document.querySelectorAll('.loan-filter');
    
    loanFilters.forEach(filter => {
      filter.addEventListener('click', () => {
        const loanType = filter.dataset.type;
        
        loanFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        
        // This would filter loans by type
        // Implementation depends on actual loan data structure
      });
    });
  }
  
  /**
   * Initialize sort functionality for personal accounts
   */
  function initSortPersonal() {
    const sortSelect = document.getElementById('sort-personal');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', () => {
      const sortBy = sortSelect.value;
      const tbody = document.querySelector('#personal-accounts-table tbody');
      const rows = Array.from(tbody.querySelectorAll('tr'));
      
      rows.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy) {
          case 'name':
            aValue = a.cells[0]?.textContent.toLowerCase() || '';
            bValue = b.cells[0]?.textContent.toLowerCase() || '';
            break;
          case 'apy-desc':
            aValue = parseFloat(a.cells[2]?.textContent) || 0;
            bValue = parseFloat(b.cells[2]?.textContent) || 0;
            return bValue - aValue;
          case 'fee-asc':
            aValue = parseFloat(a.cells[5]?.textContent.replace('$', '')) || Infinity;
            bValue = parseFloat(b.cells[5]?.textContent.replace('$', '')) || Infinity;
            return aValue - bValue;
          case 'min-balance':
            aValue = parseFloat(a.cells[3]?.textContent.replace('$', '')) || Infinity;
            bValue = parseFloat(b.cells[3]?.textContent.replace('$', '')) || Infinity;
            return aValue - bValue;
          default:
            return 0;
        }
        
        return aValue.localeCompare(bValue);
      });
      
      rows.forEach(row => tbody.appendChild(row));
    });
  }
  
  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  
  /**
   * Initialize all dashboard functionality
   */
  function initializeDashboard() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeDashboard);
      return;
    }
    
    console.log('Initializing Findata Research Dashboard v2.0...');
    
    // Initialize all components
    initTabs();
    initProductTabs();
    initBusinessTabs();
    initComplianceFilters();
    initSearch();
    initExports();
    initLoanFilters();
    initSortPersonal();
    
    // Load data asynchronously
    loadDashboardData();
    
    console.log('Dashboard initialization complete.');
  }
  
  // Start the dashboard when the script loads
  initializeDashboard();
  
  // Export functions for potential module usage (if needed in future)
  window.FindataDashboard = {
    loadDashboardData,
    renderAllSections,
    formatCurrency,
    formatPercentage,
    deepClone
  };