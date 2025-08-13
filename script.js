// Invoice Tracker Application
class InvoiceTracker {
    constructor() {
        this.invoices = this.loadInvoices();
        this.settings = this.loadSettings();
        this.initializeEventListeners();
        this.setDefaultDates();
        this.updateDashboard();
        this.displayInvoices();
    }

    // Data persistence methods
    loadInvoices() {
        try {
            const data = localStorage.getItem('invoices');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading invoices:', error);
            this.showAlert('Error loading saved data. Starting fresh.', 'error');
            return [];
        }
    }

    loadSettings() {
        try {
            const data = localStorage.getItem('settings');
            return data ? JSON.parse(data) : { vatPercentage: 23 };
        } catch (error) {
            console.error('Error loading settings:', error);
            return { vatPercentage: 23 };
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('settings', JSON.stringify(this.settings));
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showAlert('Error saving settings. Please try again.', 'error');
            return false;
        }
    }

    saveInvoices() {
        try {
            localStorage.setItem('invoices', JSON.stringify(this.invoices));
            return true;
        } catch (error) {
            console.error('Error saving invoices:', error);
            if (error.name === 'QuotaExceededError') {
                this.showAlert('Storage quota exceeded. Please export your data and clear old invoices.', 'error');
            } else {
                this.showAlert('Error saving data. Please try again.', 'error');
            }
            return false;
        }
    }

    // Input validation and sanitization
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        return input.replace(/[<>]/g, '').trim();
    }

    validateInvoice(invoice) {
        const errors = [];
        
        if (!invoice.clientName || invoice.clientName.length < 2) {
            errors.push('Client name must be at least 2 characters long');
        }
        
        if (!invoice.serviceType) {
            errors.push('Service type is required');
        }
        
        if (!invoice.amount || invoice.amount <= 0) {
            errors.push('Amount must be greater than 0');
        }
        
        if (!invoice.invoiceDate) {
            errors.push('Invoice date is required');
        }
        
        if (!invoice.dueDate) {
            errors.push('Due date is required');
        }
        
        if (new Date(invoice.dueDate) < new Date(invoice.invoiceDate)) {
            errors.push('Due date cannot be before invoice date');
        }
        
        return errors;
    }

    // UI Helper methods
    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        // Insert at the top of the content area
        const content = document.querySelector('.content');
        content.insertBefore(alertDiv, content.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 5000);
    }

    // Event listeners
    initializeEventListeners() {
        // Invoice form submission
        const invoiceForm = document.getElementById('invoiceForm');
        if (invoiceForm) {
            invoiceForm.addEventListener('submit', (e) => this.handleInvoiceSubmit(e));
        }

        // File import
        const importBtn = document.getElementById('importData');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.importData());
        }
    }

    // Tab switching
    showTab(tabName) {
        // Remove existing alerts
        document.querySelectorAll('.alert').forEach(alert => alert.remove());
        
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected tab content
        const targetTab = document.getElementById(tabName);
        if (targetTab) {
            targetTab.classList.add('active');
        }
        
        // Add active class to clicked tab
        const clickedTab = document.querySelector(`[onclick="app.showTab('${tabName}')"]`);
        if (clickedTab) {
            clickedTab.classList.add('active');
        }
        
        // Update content based on tab
        if (tabName === 'dashboard') {
            this.updateDashboard();
        } else if (tabName === 'invoices') {
            this.displayInvoices();
        }
    }

    // Invoice management
    handleInvoiceSubmit(e) {
        e.preventDefault();
        
        const invoice = {
            id: Date.now(),
            clientName: this.sanitizeInput(document.getElementById('clientName').value),
            serviceType: this.sanitizeInput(document.getElementById('serviceType').value),
            amount: parseFloat(document.getElementById('amount').value),
            invoiceDate: document.getElementById('invoiceDate').value,
            dueDate: document.getElementById('dueDate').value,
            status: document.getElementById('status').value,
            notes: this.sanitizeInput(document.getElementById('notes').value)
        };
        
        const validationErrors = this.validateInvoice(invoice);
        if (validationErrors.length > 0) {
            this.showAlert('Please fix the following errors: ' + validationErrors.join(', '), 'error');
            return;
        }
        
        this.invoices.push(invoice);
        
        if (this.saveInvoices()) {
            document.getElementById('invoiceForm').reset();
            this.setDefaultDates();
            this.showAlert('Invoice added successfully!', 'success');
            this.showTab('invoices');
        }
    }

    displayInvoices() {
        this.displayDesktopTable();
        this.displayMobileCards();
    }

    displayDesktopTable() {
        const tbody = document.getElementById('invoiceTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (this.invoices.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: #9ca3af;">No invoices yet. Add your first invoice! 💫</td></tr>';
            return;
        }
        
        this.invoices.forEach(invoice => {
            const row = tbody.insertRow();
            
            row.innerHTML = `
                <td>${new Date(invoice.invoiceDate).toLocaleDateString('pt-PT')}</td>
                <td>${this.escapeHtml(invoice.clientName)}</td>
                <td>${this.escapeHtml(invoice.serviceType)}</td>
                <td>€${invoice.amount.toFixed(2)}</td>
                <td><span class="status-${invoice.status} clickable-status" onclick="app.showStatusDropdown(${invoice.id}, this)" title="Click to change status">${this.getStatusDisplay(invoice.status)}</span></td>
                <td>${new Date(invoice.dueDate).toLocaleDateString('pt-PT')}</td>
                <td>
                    <button class="btn" onclick="app.editInvoice(${invoice.id})" style="padding: 5px 10px; font-size: 12px; margin: 2px; background: #a78bfa;">✏️ Edit</button>
                    <button class="btn btn-danger" onclick="app.deleteInvoice(${invoice.id})" style="padding: 5px 10px; font-size: 12px; margin: 2px;">🗑️ Delete</button>
                </td>
            `;
            
            // Add special styling for sent and overdue invoices AFTER setting innerHTML
            if (invoice.status === 'sent') {
                row.classList.add('invoice-sent');
            } else if (invoice.status === 'overdue') {
                row.classList.add('invoice-overdue');
            }
        });
    }

    displayMobileCards() {
        const cardsContainer = document.getElementById('invoiceCards');
        if (!cardsContainer) return;
        
        cardsContainer.innerHTML = '';
        
        if (this.invoices.length === 0) {
            cardsContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #9ca3af;">No invoices yet. Add your first invoice! 💫</div>';
            return;
        }
        
        this.invoices.forEach(invoice => {
            const card = document.createElement('div');
            card.className = `invoice-card ${invoice.status === 'sent' ? 'invoice-sent' : ''} ${invoice.status === 'overdue' ? 'invoice-overdue' : ''}`;
            
            card.innerHTML = `
                <div class="invoice-card-header">
                    <div class="invoice-card-client">${this.escapeHtml(invoice.clientName)}</div>
                    <div class="invoice-card-amount">€${invoice.amount.toFixed(2)}</div>
                </div>
                
                <div class="invoice-card-details">
                    <div class="invoice-card-detail">
                        <div class="invoice-card-detail-label">Service</div>
                        <div class="invoice-card-detail-value">${this.escapeHtml(invoice.serviceType)}</div>
                    </div>
                    <div class="invoice-card-detail">
                        <div class="invoice-card-detail-label">Invoice Date</div>
                        <div class="invoice-card-detail-value">${new Date(invoice.invoiceDate).toLocaleDateString('pt-PT')}</div>
                    </div>
                    <div class="invoice-card-detail">
                        <div class="invoice-card-detail-label">Due Date</div>
                        <div class="invoice-card-detail-value">${new Date(invoice.dueDate).toLocaleDateString('pt-PT')}</div>
                    </div>
                    <div class="invoice-card-detail">
                        <div class="invoice-card-detail-label">Status</div>
                        <div class="invoice-card-detail-value">
                            <span class="status-${invoice.status} clickable-status" onclick="app.showStatusDropdown(${invoice.id}, this)" title="Click to change status">
                                ${this.getStatusDisplay(invoice.status)}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="invoice-card-actions">
                    <button class="btn" onclick="app.editInvoice(${invoice.id})" style="background: #a78bfa;">✏️ Edit</button>
                    <button class="btn btn-danger" onclick="app.deleteInvoice(${invoice.id})">🗑️ Delete</button>
                </div>
            `;
            
            cardsContainer.appendChild(card);
        });
    }

    getStatusDisplay(status) {
        const statusMap = {
            'pending': 'PENDING',
            'sent': 'SENT',
            'paid': 'PAID',
            'overdue': 'OVERDUE'
        };
        return statusMap[status] || status.toUpperCase();
    }

    // Edit invoice functionality
    editInvoice(invoiceId) {
        const invoice = this.invoices.find(inv => inv.id === invoiceId);
        if (!invoice) return;

        // Create modal for editing
        const modal = this.createEditModal(invoice);
        document.body.appendChild(modal);
    }

    createEditModal(invoice) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); display: flex; justify-content: center;
            align-items: center; z-index: 1000;
        `;

        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 20px; max-width: 600px; width: 95%; max-height: 90vh; overflow-y: auto;">
                <h3 style="color: #374151; margin-bottom: 20px;">✏️ Edit Invoice</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div class="form-group">
                        <label>💅 Client Name</label>
                        <input type="text" id="editClientName" value="${this.escapeHtml(invoice.clientName)}" style="width: 100%; padding: 10px; border: none; border-radius: 10px; background: #f9fafb;">
                    </div>
                    <div class="form-group">
                        <label>✨ Service Type</label>
                        <select id="editServiceType" style="width: 100%; padding: 10px; border: none; border-radius: 10px; background: #f9fafb;">
                            <option value="Bridal Makeup" ${invoice.serviceType === 'Bridal Makeup' ? 'selected' : ''}>👰 Bridal Makeup</option>
                            <option value="Evening Makeup" ${invoice.serviceType === 'Evening Makeup' ? 'selected' : ''}>🌙 Evening Makeup</option>
                            <option value="Photoshoot Makeup" ${invoice.serviceType === 'Photoshoot Makeup' ? 'selected' : ''}>📸 Photoshoot Makeup</option>
                            <option value="Special Event" ${invoice.serviceType === 'Special Event' ? 'selected' : ''}>🎉 Special Event</option>
                            <option value="Makeup Lesson" ${invoice.serviceType === 'Makeup Lesson' ? 'selected' : ''}>📚 Makeup Lesson</option>
                            <option value="Other" ${invoice.serviceType === 'Other' ? 'selected' : ''}>🎀 Other</option>
                        </select>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div class="form-group">
                        <label>💰 Amount (€)</label>
                        <input type="number" id="editAmount" value="${invoice.amount}" step="0.01" min="0" style="width: 100%; padding: 10px; border: none; border-radius: 10px; background: #f9fafb;">
                    </div>
                    <div class="form-group">
                        <label>🎀 Payment Status</label>
                        <select id="editStatus" style="width: 100%; padding: 10px; border: none; border-radius: 10px; background: #f9fafb;">
                            <option value="pending" ${invoice.status === 'pending' ? 'selected' : ''}>⏳ Pending</option>
                            <option value="sent" ${invoice.status === 'sent' ? 'selected' : ''}>📤 Sent</option>
                            <option value="paid" ${invoice.status === 'paid' ? 'selected' : ''}>💖 Paid</option>
                            <option value="overdue" ${invoice.status === 'overdue' ? 'selected' : ''}>😭 Overdue</option>
                        </select>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div class="form-group">
                        <label>📅 Invoice Date</label>
                        <input type="date" id="editInvoiceDate" value="${invoice.invoiceDate}" style="width: 100%; padding: 10px; border: none; border-radius: 10px; background: #f9fafb;">
                    </div>
                    <div class="form-group">
                        <label>⏰ Due Date</label>
                        <input type="date" id="editDueDate" value="${invoice.dueDate}" style="width: 100%; padding: 10px; border: none; border-radius: 10px; background: #f9fafb;">
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 20px;">
                    <label>📝 Notes</label>
                    <input type="text" id="editNotes" value="${this.escapeHtml(invoice.notes || '')}" placeholder="Additional notes..." style="width: 100%; padding: 10px; border: none; border-radius: 10px; background: #f9fafb;">
                </div>

                <div style="text-align: center;">
                    <button onclick="app.saveEditedInvoice(${invoice.id})" class="btn" style="margin-right: 10px;">💾 Save Changes</button>
                    <button onclick="app.closeEditModal()" class="btn btn-danger">❌ Cancel</button>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeEditModal();
            }
        });

        return modal;
    }

    saveEditedInvoice(invoiceId) {
        const invoice = this.invoices.find(inv => inv.id === invoiceId);
        if (!invoice) return;

        const newClientName = this.sanitizeInput(document.getElementById('editClientName').value);
        const newServiceType = this.sanitizeInput(document.getElementById('editServiceType').value);
        const newAmount = parseFloat(document.getElementById('editAmount').value);
        const newStatus = document.getElementById('editStatus').value;
        const newInvoiceDate = document.getElementById('editInvoiceDate').value;
        const newDueDate = document.getElementById('editDueDate').value;
        const newNotes = this.sanitizeInput(document.getElementById('editNotes').value);

        // Validate inputs
        if (!newClientName || newClientName.length < 2) {
            this.showAlert('Client name must be at least 2 characters long', 'error');
            return;
        }

        if (!newServiceType) {
            this.showAlert('Service type is required', 'error');
            return;
        }

        if (!newAmount || newAmount <= 0) {
            this.showAlert('Amount must be greater than 0', 'error');
            return;
        }

        if (!newInvoiceDate || !newDueDate) {
            this.showAlert('Both invoice date and due date are required', 'error');
            return;
        }

        if (new Date(newDueDate) < new Date(newInvoiceDate)) {
            this.showAlert('Due date cannot be before invoice date', 'error');
            return;
        }

        // Update invoice
        invoice.clientName = newClientName;
        invoice.serviceType = newServiceType;
        invoice.amount = newAmount;
        invoice.status = newStatus;
        invoice.invoiceDate = newInvoiceDate;
        invoice.dueDate = newDueDate;
        invoice.notes = newNotes;

        if (this.saveInvoices()) {
            this.closeEditModal();
            this.displayInvoices();
            this.updateDashboard();
            this.showAlert('Invoice updated successfully!', 'success');
        }
    }

    closeEditModal() {
        const modal = document.querySelector('div[style*="position: fixed"]');
        if (modal) {
            document.body.removeChild(modal);
        }
    }

    updateStatus(invoiceId, newStatus) {
        const invoice = this.invoices.find(inv => inv.id === invoiceId);
        if (invoice) {
            invoice.status = newStatus;
            if (this.saveInvoices()) {
                this.displayInvoices();
                this.updateDashboard();
                this.showAlert(`Invoice status updated to ${newStatus}!`, 'success');
            }
        }
    }

    // Show status dropdown when clicking status badge
    showStatusDropdown(invoiceId, element) {
        // Remove any existing dropdown
        this.closeStatusDropdown();
        
        const invoice = this.invoices.find(inv => inv.id === invoiceId);
        if (!invoice) return;

        const dropdown = document.createElement('div');
        dropdown.className = 'status-dropdown';
        dropdown.innerHTML = `
            <div class="status-option ${invoice.status === 'pending' ? 'current' : ''}" onclick="app.changeStatus(${invoiceId}, 'pending')">
                <span class="status-pending">⏳ Pending</span>
            </div>
            <div class="status-option ${invoice.status === 'sent' ? 'current' : ''}" onclick="app.changeStatus(${invoiceId}, 'sent')">
                <span class="status-sent">📤 Sent</span>
            </div>
            <div class="status-option ${invoice.status === 'paid' ? 'current' : ''}" onclick="app.changeStatus(${invoiceId}, 'paid')">
                <span class="status-paid">💖 Paid</span>
            </div>
            <div class="status-option ${invoice.status === 'overdue' ? 'current' : ''}" onclick="app.changeStatus(${invoiceId}, 'overdue')">
                <span class="status-overdue">😭 Overdue</span>
            </div>
        `;

        // Position the dropdown
        const rect = element.getBoundingClientRect();
        dropdown.style.position = 'fixed';
        dropdown.style.top = (rect.bottom + 5) + 'px';
        dropdown.style.left = rect.left + 'px';
        dropdown.style.zIndex = '1001';

        document.body.appendChild(dropdown);

        // Close dropdown when clicking outside
        setTimeout(() => {
            document.addEventListener('click', this.handleOutsideClick.bind(this), { once: true });
        }, 10);
    }

    changeStatus(invoiceId, newStatus) {
        this.closeStatusDropdown();
        this.updateStatus(invoiceId, newStatus);
    }

    closeStatusDropdown() {
        const dropdown = document.querySelector('.status-dropdown');
        if (dropdown) {
            document.body.removeChild(dropdown);
        }
    }

    handleOutsideClick(event) {
        if (!event.target.closest('.status-dropdown') && !event.target.closest('.clickable-status')) {
            this.closeStatusDropdown();
        }
    }

    deleteInvoice(invoiceId) {
        if (confirm('Are you sure you want to delete this invoice?')) {
            this.invoices = this.invoices.filter(inv => inv.id !== invoiceId);
            if (this.saveInvoices()) {
                this.displayInvoices();
                this.updateDashboard();
                this.showAlert('Invoice deleted successfully!', 'success');
            }
        }
    }

    // Dashboard calculations
    updateDashboard() {
        const totalInvoices = this.invoices.length;
        const totalRevenue = this.invoices.reduce((sum, inv) => 
            (inv.status === 'paid' || inv.status === 'sent') ? sum + inv.amount : sum, 0);
        const pendingPayments = this.invoices.reduce((sum, inv) => 
            (inv.status === 'pending' || inv.status === 'overdue') ? sum + inv.amount : sum, 0);
        
        // Calculate tax obligations based on paid invoices (removed social security)
        const ivaAmount = totalRevenue * (this.settings.vatPercentage / 100);
        // Simplified income tax calculation (average ~18% for middle income)
        const incomeTaxAmount = Math.max(0, (totalRevenue - 4104) * 0.18);
        const totalTaxAmount = ivaAmount + incomeTaxAmount;
        
        // Update DOM elements safely
        this.updateElementText('totalInvoices', totalInvoices);
        this.updateElementText('totalRevenue', `€${totalRevenue.toFixed(2)}`);
        this.updateElementText('pendingPayments', `€${pendingPayments.toFixed(2)}`);
        this.updateElementText('taxReserve', `€${totalTaxAmount.toFixed(2)}`);
        
        this.updateElementText('ivaAmount', `€${ivaAmount.toFixed(2)}`);
        this.updateElementText('incomeTaxAmount', `€${incomeTaxAmount.toFixed(2)}`);
        this.updateElementText('totalTaxAmount', `€${totalTaxAmount.toFixed(2)}`);
        
        // Update VAT percentage display
        this.updateElementText('vatPercentageDisplay', `${this.settings.vatPercentage}%`);
        const vatInput = document.getElementById('vatPercentageInput');
        if (vatInput) {
            vatInput.value = this.settings.vatPercentage;
        }
    }

    // Settings management
    toggleTaxSettings() {
        const taxSettings = document.getElementById('taxSettings');
        const taxToggle = document.getElementById('taxToggle');
        
        if (taxSettings.style.display === 'none' || taxSettings.style.display === '') {
            taxSettings.style.display = 'block';
            taxToggle.classList.add('rotated');
            taxToggle.textContent = '❌';
        } else {
            taxSettings.style.display = 'none';
            taxToggle.classList.remove('rotated');
            taxToggle.textContent = '⚙️';
        }
    }

    updateVatPercentage() {
        const vatInput = document.getElementById('vatPercentageInput');
        const newVatPercentage = parseFloat(vatInput.value);
        
        if (isNaN(newVatPercentage) || newVatPercentage < 0 || newVatPercentage > 50) {
            this.showAlert('Please enter a valid VAT percentage between 0% and 50%', 'error');
            vatInput.value = this.settings.vatPercentage;
            return;
        }
        
        this.settings.vatPercentage = newVatPercentage;
        if (this.saveSettings()) {
            this.updateDashboard();
            this.showAlert(`VAT percentage updated to ${newVatPercentage}%`, 'success');
            // Auto-close settings after successful update
            this.toggleTaxSettings();
        }
    }

    updateElementText(id, text) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    }

    // Data export/import
    exportData() {
        try {
            const dataStr = JSON.stringify(this.invoices, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `invoice-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            this.showAlert('Data exported successfully!', 'success');
        } catch (error) {
            console.error('Export error:', error);
            this.showAlert('Error exporting data. Please try again.', 'error');
        }
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    if (Array.isArray(importedData)) {
                        // Validate imported data
                        const validInvoices = importedData.filter(invoice => {
                            return invoice.id && invoice.clientName && invoice.amount;
                        });
                        
                        if (validInvoices.length > 0) {
                            this.invoices = [...this.invoices, ...validInvoices];
                            if (this.saveInvoices()) {
                                this.updateDashboard();
                                this.displayInvoices();
                                this.showAlert(`Imported ${validInvoices.length} invoices successfully!`, 'success');
                            }
                        } else {
                            this.showAlert('No valid invoices found in the file.', 'warning');
                        }
                    } else {
                        this.showAlert('Invalid file format. Please select a valid JSON file.', 'error');
                    }
                } catch (error) {
                    console.error('Import error:', error);
                    this.showAlert('Error reading file. Please check the file format.', 'error');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    clearAllData() {
        if (confirm('Are you sure you want to delete ALL invoice data? This cannot be undone!')) {
            localStorage.removeItem('invoices');
            this.invoices = [];
            this.displayInvoices();
            this.updateDashboard();
            this.showAlert('All data has been cleared.', 'warning');
        }
    }

    // Utility methods
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setDefaultDates() {
        const invoiceDateEl = document.getElementById('invoiceDate');
        const dueDateEl = document.getElementById('dueDate');
        
        if (invoiceDateEl) {
            invoiceDateEl.valueAsDate = new Date();
        }
        
        if (dueDateEl) {
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            dueDateEl.valueAsDate = nextMonth;
        }
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', function() {
    app = new InvoiceTracker();
});
