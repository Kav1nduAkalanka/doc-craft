import type { LayoutState } from '../types';

export function renderTemplate(
  templateId: string,
  data: Record<string, any>,
  layoutState: LayoutState | null,
  accentColor: string,
  documentType: string = 'invoice'
): string {
  // Extract data
  const lineItems = (data.lineItems as Array<{ description: string; quantity: number; unitPrice: number; total: number }>) || [];
  const subtotal = (data.subtotal as number) || lineItems.reduce((s, i) => s + (i.total || 0), 0);
  const taxRate = (data.taxRate as number) || 0;
  const taxAmount = (data.taxAmount as number) || subtotal * (taxRate / 100);
  const totalDue = (data.totalDue as number) || subtotal + taxAmount;
  const currency = data.currency || '$';

  // Extract layout settings
  const showLogo = layoutState?.showLogo ?? false;
  const logoUrl = layoutState?.logoUrl || '';
  const showNotes = layoutState?.showNotes ?? true;
  const sectionOrder = layoutState?.sectionOrder || ['header', 'client_details', 'line_items', 'total', 'notes'];

  // Formatting helper
  const applyFormatting = (html: string, size: any, bold: any) => {
    let result = html;
    if (size === 'small') {
      result = result.replace(/font-size:\s*(\d+)px/g, (_, p1) => `font-size: ${Math.round(parseInt(p1) * 0.9)}px`);
    } else if (size === 'large') {
      result = result.replace(/font-size:\s*(\d+)px/g, (_, p1) => `font-size: ${Math.round(parseInt(p1) * 1.15)}px`);
    }
    if (bold) {
      result = result.replace(/font-weight:\s*600/g, 'font-weight: 700');
      result = result.replace(/font-weight:\s*800/g, 'font-weight: 900');
      result = `<div style="font-weight: 500;">${result}</div>`;
    }
    return result;
  };

  // Apply template styles
  let fontFamily = "'Inter', sans-serif";
  let borderStyle = `border-bottom: 2px solid ${accentColor};`;
  let tableHeaderBg = 'transparent';
  let headerTitleColor = accentColor;
  
  if (templateId.includes('_minimal')) {
    fontFamily = "'Roboto', sans-serif";
    borderStyle = 'border-bottom: 1px solid #e2e8f0;';
    tableHeaderBg = '#f8fafc';
    headerTitleColor = '#1e293b'; // Black title for minimal
  } else if (templateId.includes('_classic')) {
    fontFamily = "'Times New Roman', serif";
    borderStyle = `border-bottom: 3px double ${accentColor};`;
    tableHeaderBg = `${accentColor}15`; // Light accent background
  }

  // Override with custom typography if set
  if (layoutState?.fontFamily && layoutState.fontFamily !== 'default') {
    fontFamily = layoutState.fontFamily;
  }

  // Determine document specifics
  const isQuotation = documentType === 'quotation';
  const isReceipt = documentType === 'receipt';
  
  const docTitle = isQuotation ? 'QUOTATION' : isReceipt ? 'RECEIPT' : 'INVOICE';
  const docNumber = isQuotation 
    ? (data.quotationNumber || 'QT-0001') 
    : isReceipt 
      ? (data.receiptNumber || 'RCP-0001') 
      : (data.invoiceNumber || 'INV-0001');

  const totalLabel = isReceipt ? 'Amount Paid' : 'Total Due';

  // Define section generators
  const sections: Record<string, string> = {
    header: applyFormatting(`
      <!-- Header -->
      <div style="text-align: ${layoutState?.header_alignment || layoutState?.headerAlignment || 'left'}; margin-bottom: 32px;">
        ${showLogo && logoUrl ? `<img src="${logoUrl}" alt="Logo" style="max-height: 60px; margin-bottom: 16px;" />` : ''}
        <div style="display: flex; justify-content: ${(layoutState?.header_alignment || layoutState?.headerAlignment) === 'center' ? 'center' : (layoutState?.header_alignment || layoutState?.headerAlignment) === 'right' ? 'flex-end' : 'space-between'}; align-items: flex-start; text-align: ${layoutState?.header_alignment || layoutState?.headerAlignment || 'left'};">
          <div style="${(layoutState?.header_alignment || layoutState?.headerAlignment) === 'right' ? 'order: 2; text-align: right;' : 'order: 1;'}">
            <h1 style="font-size: 24px; font-weight: 800; color: ${headerTitleColor}; margin: 0 0 4px 0;">
              ${data.businessName || 'Your Business'}
            </h1>
            <p style="font-size: 12px; color: #64748b; margin: 2px 0;">${data.senderEmail || ''}</p>
            <p style="font-size: 12px; color: #64748b; margin: 2px 0;">${data.senderAddress || ''}</p>
            <p style="font-size: 12px; color: #64748b; margin: 2px 0;">${data.senderPhone || ''}</p>
          </div>
          <div style="${(layoutState?.header_alignment || layoutState?.headerAlignment) === 'right' ? 'order: 1; text-align: left;' : 'order: 2; text-align: right;'}">
            <h2 style="font-size: 28px; font-weight: 800; color: ${accentColor}; margin: 0; letter-spacing: 2px;">${docTitle}</h2>
            <p style="font-size: 13px; color: #475569; margin: 4px 0;"><strong>#${docNumber}</strong></p>
            <p style="font-size: 11px; color: #94a3b8; margin: 2px 0;">Date: ${data.issueDate || '—'}</p>
            ${!isReceipt ? `<p style="font-size: 11px; color: #94a3b8; margin: 2px 0;">${isQuotation ? 'Valid Until' : 'Due'}: ${data.dueDate || '—'}</p>` : ''}
          </div>
        </div>
      </div>
    `, layoutState?.header_fontSize || layoutState?.fontSize, layoutState?.header_bold || layoutState?.bold),
    client_details: (layoutState?.showClientDetails ?? true) ? applyFormatting(`
      <!-- Bill To -->
      <div style="text-align: ${layoutState?.client_details_alignment || 'left'}; background: ${templateId.includes('_minimal') ? 'transparent' : '#f8fafc'}; border-radius: 8px; padding: 16px; margin-bottom: 24px; border-left: 4px solid ${accentColor};">
        <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin: 0 0 4px 0; font-weight: 600;">Bill To</p>
        <p style="font-size: 15px; font-weight: 600; color: #1e293b; margin: 0;">${data.clientName || 'Client Name'}</p>
        <p style="font-size: 12px; color: #64748b; margin: 2px 0;">${data.clientEmail || ''}</p>
        <p style="font-size: 12px; color: #64748b; margin: 2px 0;">${data.clientAddress || ''}</p>
      </div>
    `, layoutState?.client_details_fontSize || layoutState?.fontSize, layoutState?.client_details_bold) : '',
    line_items: applyFormatting(`
      <!-- Line Items -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead style="background: ${tableHeaderBg};">
          <tr style="${borderStyle}">
            <th style="text-align: left; padding: 10px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600;">Description</th>
            ${(layoutState?.showQuantityColumn ?? true) ? `<th style="text-align: center; padding: 10px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600;">Qty</th>` : ''}
            <th style="text-align: right; padding: 10px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600;">Unit Price</th>
            <th style="text-align: right; padding: 10px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${lineItems.map((item, i) => `
            <tr style="border-bottom: 1px solid #f1f5f9; ${i % 2 === 1 && !templateId.includes('_minimal') ? 'background: #fafbfc;' : ''}">
              <td style="padding: 12px 8px; font-size: 13px; color: #334155;">${item.description}</td>
              ${(layoutState?.showQuantityColumn ?? true) ? `<td style="padding: 12px 8px; font-size: 13px; color: #475569; text-align: center;">${item.quantity}</td>` : ''}
              <td style="padding: 12px 8px; font-size: 13px; color: #475569; text-align: right;">${currency}${item.unitPrice.toFixed(2)}</td>
              <td style="padding: 12px 8px; font-size: 13px; color: #1e293b; font-weight: 600; text-align: right;">${currency}${item.total.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `, layoutState?.fontSize, layoutState?.bold),
    total: applyFormatting(`
      <!-- Totals -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 32px;">
        <div style="width: 320px;">
          <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #64748b;">
            <span>Subtotal</span><span>${currency}${subtotal.toFixed(2)}</span>
          </div>
          ${taxRate > 0 ? `
          <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #64748b;">
            <span>Tax (${taxRate}%)</span><span>${currency}${taxAmount.toFixed(2)}</span>
          </div>` : ''}
          <div style="display: flex; justify-content: space-between; padding: 12px 0; font-size: 18px; font-weight: 800; color: ${accentColor}; border-top: 2px solid ${accentColor}; margin-top: 8px;">
            <span>${totalLabel}</span><span>${currency}${totalDue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `, layoutState?.total_fontSize || layoutState?.fontSize, layoutState?.total_bold || layoutState?.bold),
    notes: showNotes && data.notesAndTerms ? applyFormatting(`
      <!-- Notes -->
      <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin: 0 0 6px 0; font-weight: 600;">Notes & Payment Terms</p>
        <p style="font-size: 12px; color: #475569; margin: 0; line-height: 1.6;">${data.notesAndTerms}</p>
      </div>
    `, layoutState?.notes_fontSize || layoutState?.fontSize, layoutState?.notes_bold || layoutState?.bold) : ''
  };

  const footer = `
    <!-- Footer -->
    <div style="text-align: center; padding: 16px 0; border-top: 1px solid #e2e8f0; margin-top: 16px;">
      <p style="font-size: 10px; color: #cbd5e1;">Generated with DocCraft · doccraft.app</p>
    </div>
  `;

  // Render ordered sections
  const renderedSections = sectionOrder.map(id => sections[id] || '').join('\n');

  return `
    <div style="font-family: ${fontFamily}; color: #1e293b; padding: 12px; background: white; min-height: 100%;">
      ${renderedSections}
      ${footer}
    </div>
  `;
}

export function renderTemplateSections(
  templateId: string,
  data: Record<string, any>,
  layoutState: LayoutState | null,
  accentColor: string,
  documentType: string = 'invoice'
): Record<string, string> {
  // Extract data
  const lineItems = (data.lineItems as Array<{ description: string; quantity: number; unitPrice: number; total: number }>) || [];
  const subtotal = (data.subtotal as number) || lineItems.reduce((s, i) => s + (i.total || 0), 0);
  const taxRate = (data.taxRate as number) || 0;
  const taxAmount = (data.taxAmount as number) || subtotal * (taxRate / 100);
  const totalDue = (data.totalDue as number) || subtotal + taxAmount;
  const currency = data.currency || '$';

  // Extract layout settings
  const showLogo = layoutState?.showLogo ?? false;
  const logoUrl = layoutState?.logoUrl || '';
  const showNotes = layoutState?.showNotes ?? true;

  // Formatting helper
  const applyFormatting = (html: string, size: any, bold: any) => {
    let result = html;
    if (size === 'small') {
      result = result.replace(/font-size:\s*(\d+)px/g, (_, p1) => `font-size: ${Math.round(parseInt(p1) * 0.9)}px`);
    } else if (size === 'large') {
      result = result.replace(/font-size:\s*(\d+)px/g, (_, p1) => `font-size: ${Math.round(parseInt(p1) * 1.15)}px`);
    }
    if (bold) {
      result = result.replace(/font-weight:\s*600/g, 'font-weight: 700');
      result = result.replace(/font-weight:\s*800/g, 'font-weight: 900');
      result = `<div style="font-weight: 500;">${result}</div>`;
    }
    return result;
  };

  // Apply template styles
  let fontFamily = "'Inter', sans-serif";
  let borderStyle = `border-bottom: 2px solid ${accentColor};`;
  let tableHeaderBg = 'transparent';
  let headerTitleColor = accentColor;
  
  if (templateId.includes('_minimal')) {
    fontFamily = "'Roboto', sans-serif";
    borderStyle = 'border-bottom: 1px solid #e2e8f0;';
    tableHeaderBg = '#f8fafc';
    headerTitleColor = '#1e293b'; // Black title for minimal
  } else if (templateId.includes('_classic')) {
    fontFamily = "'Times New Roman', serif";
    borderStyle = `border-bottom: 3px double ${accentColor};`;
    tableHeaderBg = `${accentColor}15`; // Light accent background
  }

  // Override with custom typography if set
  if (layoutState?.fontFamily && layoutState.fontFamily !== 'default') {
    fontFamily = layoutState.fontFamily;
  }

  const isQuotation = documentType === 'quotation';
  const isReceipt = documentType === 'receipt';
  
  const docTitle = isQuotation ? 'QUOTATION' : isReceipt ? 'RECEIPT' : 'INVOICE';
  const docNumber = isQuotation 
    ? (data.quotationNumber || 'QT-0001') 
    : isReceipt 
      ? (data.receiptNumber || 'RCP-0001') 
      : (data.invoiceNumber || 'INV-0001');

  const totalLabel = isReceipt ? 'Amount Paid' : 'Total Due';

  const sections: Record<string, string> = {
    header: applyFormatting(`
      <div style="text-align: ${layoutState?.header_alignment || layoutState?.headerAlignment || 'left'}; margin-bottom: 32px;">
        ${showLogo && logoUrl ? `<img src="${logoUrl}" alt="Logo" style="max-height: 60px; margin-bottom: 16px;" />` : ''}
        <div style="display: flex; justify-content: ${(layoutState?.header_alignment || layoutState?.headerAlignment) === 'center' ? 'center' : (layoutState?.header_alignment || layoutState?.headerAlignment) === 'right' ? 'flex-end' : 'space-between'}; align-items: flex-start; text-align: ${layoutState?.header_alignment || layoutState?.headerAlignment || 'left'};">
          <div style="${(layoutState?.header_alignment || layoutState?.headerAlignment) === 'right' ? 'order: 2; text-align: right;' : 'order: 1;'}">
            <h1 contenteditable="true" data-slot="businessName" style="font-size: 24px; font-weight: 800; color: ${headerTitleColor}; margin: 0 0 4px 0; outline: none;">
              ${data.businessName || 'Your Business'}
            </h1>
            <p contenteditable="true" data-slot="senderEmail" style="font-size: 12px; color: #64748b; margin: 2px 0; outline: none;">${data.senderEmail || 'email@example.com'}</p>
            <p contenteditable="true" data-slot="senderAddress" style="font-size: 12px; color: #64748b; margin: 2px 0; outline: none;">${data.senderAddress || ''}</p>
            <p contenteditable="true" data-slot="senderPhone" style="font-size: 12px; color: #64748b; margin: 2px 0; outline: none;">${data.senderPhone || ''}</p>
          </div>
          <div style="${(layoutState?.header_alignment || layoutState?.headerAlignment) === 'right' ? 'order: 1; text-align: left;' : 'order: 2; text-align: right;'}">
            <h2 style="font-size: 28px; font-weight: 800; color: ${accentColor}; margin: 0; letter-spacing: 2px;">${docTitle}</h2>
            <p style="font-size: 13px; color: #475569; margin: 4px 0;"><strong>#<span contenteditable="true" data-slot="invoiceNumber" style="outline:none;">${docNumber}</span></strong></p>
            <p style="font-size: 11px; color: #94a3b8; margin: 2px 0;">Date: <span contenteditable="true" data-slot="issueDate" style="outline:none;">${data.issueDate || '—'}</span></p>
            ${!isReceipt ? `<p style="font-size: 11px; color: #94a3b8; margin: 2px 0;">${isQuotation ? 'Valid Until' : 'Due'}: <span contenteditable="true" data-slot="dueDate" style="outline:none;">${data.dueDate || '—'}</span></p>` : ''}
          </div>
        </div>
      </div>
    `, layoutState?.header_fontSize || layoutState?.fontSize, layoutState?.header_bold || layoutState?.bold),
    client_details: (layoutState?.showClientDetails ?? true) ? applyFormatting(`
      <div style="text-align: ${layoutState?.client_details_alignment || 'left'}; background: ${templateId.includes('_minimal') ? 'transparent' : '#f8fafc'}; border-radius: 8px; padding: 16px; margin-bottom: 24px; border-left: 4px solid ${accentColor};">
        <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin: 0 0 4px 0; font-weight: 600;">Bill To</p>
        <p contenteditable="true" data-slot="clientName" style="font-size: 15px; font-weight: 600; color: #1e293b; margin: 0; outline:none;">${data.clientName || 'Client Name'}</p>
        <p contenteditable="true" data-slot="clientEmail" style="font-size: 12px; color: #64748b; margin: 2px 0; outline:none;">${data.clientEmail || ''}</p>
        <p contenteditable="true" data-slot="clientAddress" style="font-size: 12px; color: #64748b; margin: 2px 0; outline:none;">${data.clientAddress || ''}</p>
      </div>
    `, layoutState?.client_details_fontSize || layoutState?.fontSize, layoutState?.client_details_bold) : '',
    line_items: applyFormatting(`
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead style="background: ${tableHeaderBg};">
          <tr style="${borderStyle}">
            <th style="text-align: left; padding: 10px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600;">Description</th>
            ${(layoutState?.showQuantityColumn ?? true) ? `<th style="text-align: center; padding: 10px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600;">Qty</th>` : ''}
            <th style="text-align: right; padding: 10px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600;">Unit Price</th>
            <th style="text-align: right; padding: 10px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${lineItems.map((item, i) => `
            <tr style="border-bottom: 1px solid #f1f5f9; ${i % 2 === 1 && !templateId.includes('_minimal') ? 'background: #fafbfc;' : ''}">
              <td style="padding: 12px 8px; font-size: 13px; color: #334155;">${item.description}</td>
              ${(layoutState?.showQuantityColumn ?? true) ? `<td style="padding: 12px 8px; font-size: 13px; color: #475569; text-align: center;">${item.quantity}</td>` : ''}
              <td style="padding: 12px 8px; font-size: 13px; color: #475569; text-align: right;">${currency}${item.unitPrice.toFixed(2)}</td>
              <td style="padding: 12px 8px; font-size: 13px; color: #1e293b; font-weight: 600; text-align: right;">${currency}${item.total.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `, layoutState?.fontSize, layoutState?.bold),
    total: applyFormatting(`
      <div style="display: flex; justify-content: flex-end; margin-bottom: 32px;">
        <div style="width: 320px;">
          <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #64748b;">
            <span>Subtotal</span><span>${currency}${subtotal.toFixed(2)}</span>
          </div>
          ${taxRate > 0 ? `
          <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #64748b;">
            <span>Tax (<span contenteditable="true" data-slot="taxRate" style="outline:none;">${taxRate}</span>%)</span><span>${currency}${taxAmount.toFixed(2)}</span>
          </div>` : ''}
          <div style="display: flex; justify-content: space-between; padding: 12px 0; font-size: 18px; font-weight: 800; color: ${accentColor}; border-top: 2px solid ${accentColor}; margin-top: 8px;">
            <span>${totalLabel}</span><span>${currency}${totalDue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `, layoutState?.total_fontSize || layoutState?.fontSize, layoutState?.total_bold || layoutState?.bold),
    notes: showNotes && data.notesAndTerms ? applyFormatting(`
      <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin: 0 0 6px 0; font-weight: 600;">Notes & Payment Terms</p>
        <p contenteditable="true" data-slot="notesAndTerms" style="font-size: 12px; color: #475569; margin: 0; line-height: 1.6; outline:none;">${data.notesAndTerms}</p>
      </div>
    `, layoutState?.notes_fontSize || layoutState?.fontSize, layoutState?.notes_bold || layoutState?.bold) : ''
  };

  return sections;
}
