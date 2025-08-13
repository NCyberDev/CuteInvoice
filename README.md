# 💄✨ Cute Invoice Tracker ✨💖

A beautiful, client-side invoice tracking application designed specifically for makeup artists in Portugal. Track your invoices, calculate taxes, and manage your business with style! 🎀

## ✨ Features

### 📊 Dashboard
- **Real-time Overview**: Total invoices, revenue, pending payments, and tax reserves
- **Portuguese Tax Calculations**: Automatic calculations for IVA (VAT), Social Security, and Income Tax
- **Visual Summary Cards**: Beautiful pastel design with emoji indicators

### 📋 Invoice Management
- **Add New Invoices**: Complete form with client details, services, amounts, and dates
- **Track Payment Status**: Pending, Paid, and Overdue statuses with visual indicators
- **Service Categories**: Pre-defined makeup service types (Bridal, Evening, Photoshoot, etc.)
- **Edit & Delete**: Easy invoice management with confirmation dialogs

### 💾 Data Management
- **Local Storage**: All data stays on your device - completely private
- **Export Data**: Download your invoices as JSON backup files
- **Import Data**: Restore or merge data from backup files
- **Data Validation**: Input sanitization and error handling for data integrity

### 💰 Tax Information
- **Portuguese Tax Rates**: Up-to-date 2024 tax information for self-employed makeup artists
- **IVA (VAT)**: 23% calculation with threshold information
- **Social Security**: 21.4% self-employed rate calculations
- **Income Tax**: Progressive rate calculator with tax-free allowance
- **Tax Strategy**: Recommended percentage to set aside for taxes

## 🚀 Getting Started

### Quick Setup
1. Download all files to a folder on your computer
2. Double-click `index.html` to open in your web browser
3. Start adding your invoices!

### File Structure
```
CuteInvoice/
├── index.html      # Main application file
├── styles.css      # Beautiful pastel styling
├── script.js       # Application logic and functionality
└── README.md       # This documentation
```

## 💡 How to Use

### Adding Your First Invoice
1. Click the "✨ Add Invoice" tab
2. Fill in client name and select service type
3. Enter the amount and set invoice/due dates
4. Choose payment status
5. Add optional notes
6. Click "💾 Add Invoice 🎀"

### Managing Invoices
- **View All**: Go to "📋 Invoices" tab to see your invoice table
- **Mark as Paid**: Click the "✓ Paid" button next to any invoice
- **Delete**: Use the "🗑️ Delete" button (with confirmation)
- **Export**: Click "📥 Export Data 🎀" to download a backup
- **Import**: Click "📤 Import Data 💖" to restore from backup

### Understanding Your Dashboard
- **💫 Total Invoices**: Count of all invoices created
- **💸 Total Revenue**: Sum of all PAID invoices
- **⏳ Pending Payments**: Sum of unpaid invoices
- **🏦 Tax Reserve Fund**: Recommended amount to set aside for taxes

## 🔒 Privacy & Security

### Data Storage
- **100% Client-Side**: No data ever leaves your device
- **Browser Storage**: Uses localStorage for persistence
- **No Server**: No external servers or databases involved
- **Private**: Only you can access your data

### Security Features
- **Input Sanitization**: All user inputs are cleaned and validated
- **XSS Protection**: HTML content is properly escaped
- **Data Validation**: Forms validate data before saving
- **Error Handling**: Graceful handling of storage errors and quota limits

### Data Backup Strategy
1. **Regular Exports**: Export your data weekly/monthly
2. **Multiple Backups**: Keep backups in different locations
3. **Before Updates**: Always export before browser updates
4. **Cloud Storage**: Store backup files in your preferred cloud service

## 🇵🇹 Portuguese Tax Information (2024)

### IVA (VAT)
- **Rate**: 23% on all services
- **Threshold**: Must register if turnover > €14,500
- **Payment**: Quarterly (every 3 months)
- **Deadline**: 7 days after reporting period

### Social Security
- **Rate**: 21.4% for self-employed
- **Payment**: Monthly (1st-20th of each month)
- **Based on**: Previous year's taxable income

### Income Tax (IRS)
- **Tax-free allowance**: €4,104
- **Progressive rates**: 13.25% to 48% depending on income
- **Payment**: Annual declaration + advance payments

### Recommended Strategy
Set aside **50-55%** of each paid invoice to cover:
- IVA (VAT): 23%
- Social Security: 21.4%
- Income Tax: ~15-20% (varies by total income)

## 🎨 Design Features

### Soft Pastel Theme
- **No Harsh Gradients**: Clean, solid pastel colors
- **Purple & Pink Accents**: Soft lavender and rose tones
- **Consistent Spacing**: Clean, organized layout
- **Emoji Enhancement**: Cute icons throughout the interface

### Responsive Design
- **Mobile Friendly**: Works on phones and tablets
- **Flexible Layout**: Adapts to different screen sizes
- **Touch Friendly**: Large buttons and touch targets

## 🔧 Technical Details

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **JavaScript Required**: ES6+ features used
- **Local Storage**: Must support localStorage API
- **File API**: For import/export functionality

### Performance
- **Lightweight**: No external dependencies
- **Fast Loading**: All assets are local
- **Efficient Storage**: Optimized JSON data structure
- **Memory Safe**: Proper cleanup and error handling

## 📱 Sharing with Others

### Safe Sharing Options
1. **Zip the Files**: Package all files in a ZIP
2. **Cloud Storage**: Share via Dropbox, Google Drive, etc.
3. **USB Drive**: Copy files to a USB stick
4. **Email**: Send as attachment (small file size)

### What Recipients Need
- Any modern web browser
- No special software installation required
- Basic computer skills to open HTML files

### Privacy Note
Each person gets their own separate data storage - no data is shared between users.

## 🆘 Troubleshooting

### Common Issues

**Data Not Saving**
- Check if browser allows localStorage
- Clear some browser data if storage is full
- Try a different browser

**Export Not Working**
- Ensure browser allows file downloads
- Check download folder permissions
- Try a different browser

**Import Failed**
- Verify JSON file format is correct
- Check file isn't corrupted
- Ensure file was exported from this app

**Display Issues**
- Try refreshing the page (Ctrl+F5 or Cmd+Shift+R)
- Clear browser cache
- Check if JavaScript is enabled

## 🎯 Best Practices

### Regular Maintenance
- Export data weekly
- Review and clean old invoices monthly
- Update payment statuses promptly
- Monitor tax calculations quarterly

### Professional Usage
- Use consistent service naming
- Include detailed notes for complex jobs
- Set realistic due dates
- Follow up on overdue payments

## 🔮 Future Enhancements

Potential features for future versions:
- PDF invoice generation
- Client contact management
- Expense tracking
- Multi-currency support
- Advanced reporting
- Calendar integration

---

**Made with 💖 for Portuguese Makeup Artists**

*This tool is designed to help you focus on your artistry while keeping your business organized. Stay beautiful! ✨*
